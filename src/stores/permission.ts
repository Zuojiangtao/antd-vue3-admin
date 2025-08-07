import { defineStore } from 'pinia';
import type { RouteRecordRaw } from 'vue-router';
import { useDeepClone } from '@/hooks/useDeepClone';
import { asyncRouterMap, completeRouterMap, constantRouterMap } from '@/router/routes';

interface PermissionState {
  asyncRoutersTree: RouteRecordRaw;
  addRouters: RouteRecordRaw;
  permissions: string[];
  routers: string[];
  btnPermissions: string[];
  rolesPermissions: string[];
}

function hasPermission(permission, route) {
  if (route.meta && route.meta.permission) {
    let flag = false;
    for (let i = 0, len = permission.length; i < len; i++) {
      flag = route.meta.permission.includes(permission[i].path);
      if (flag) {
        return true;
      }
    }
    return false;
  }
  return true;
}

function filterAsyncRouter(routerMap, asyncRouteTree) {
  return routerMap.filter(route => {
    if (hasPermission(asyncRouteTree, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, asyncRouteTree);
      }
      return true;
    }
    return false;
  });
}

function filterAsyncPath(routerMap, permissions = []) {
  for (let i = 0; i < routerMap.length; i++) {
    permissions.push(routerMap[i].path);
    if (routerMap[i].children) {
      filterAsyncPath(routerMap[i].children, permissions);
    }
  }
  return permissions;
}

function filterAsyncButton(routerMap, btnPermissions = []) {
  for (let i = 0; i < routerMap.length; i++) {
    routerMap[i].buttons && routerMap[i].buttons.length && btnPermissions.push(...routerMap[i].buttons);
    if (routerMap[i].children) {
      filterAsyncButton(routerMap[i].children, btnPermissions);
    }
  }
  return btnPermissions;
}

function flatPermissionsTree(routerTree, routerMap = []) {
  for (let i = 0; i < routerTree.length; i++) {
    const route = {
      name: routerTree[i].name,
      path: routerTree[i].path,
    };
    routerMap.push(route);
    if (routerTree[i].children) {
      flatPermissionsTree(routerTree[i].children, routerMap);
    }
  }
  return routerMap;
}

export const usePermissionStore = defineStore({
  id: 'permission',
  state: (): PermissionState => ({
    asyncRoutersTree: [], // 后端返回的权限受控路由树
    addRouters: [], // 权限路由树
    permissions: [], // 用户权限路由路径
    routers: [], // 所有路由路径
    btnPermissions: [], // 按钮权限
    rolesPermissions: [], // 角色权限
  }),
  persist: {
    pick: ['permissions', 'routers'], // 部分数据持久化
  },
  getters: {
    getPermissions(state): string[] {
      return state.permissions;
    },
    getRouters(state): string[] {
      return state.routers;
    },
  },
  actions: {
    setAsyncRoutersTree(asyncRoutersTree): RouteRecordRaw {
      this.asyncRoutersTree = asyncRoutersTree;
    },
    setUserPermissions(permissions): string[] {
      this.permissions = permissions;
    },
    setCompletePermissions(routers): string[] {
      this.routers = routers;
    },
    setRouterTree(dynamicRoutersTree): RouteRecordRaw {
      this.addRouters = dynamicRoutersTree;
    },
    setBtnPermissions(btnPermissions): string[] {
      this.btnPermissions = btnPermissions;
    },
    setRolePermissions(roles): string[] {
      this.rolesPermissions = roles;
    },
    generateRouters(data: RouteRecordRaw): void {
      const { deepClone } = useDeepClone();
      const cloneBaseRouter = deepClone(constantRouterMap); // 深拷贝基础路由
      const cloneAsyncRouter = deepClone(asyncRouterMap); // 深拷贝权限路由
      const cloneAllRouter = deepClone(completeRouterMap); // 深拷贝所有路由
      const permissions = flatPermissionsTree(toRaw(data));
      const accessedRouters = filterAsyncRouter(cloneAsyncRouter, permissions);
      // 用户权限路由路径 - 判断403
      if (accessedRouters.length) {
        this.setUserPermissions(filterAsyncPath(cloneBaseRouter.concat(deepClone(accessedRouters))));
        this.setRouterTree(accessedRouters);
      }
      // 全部路由路径 - 判断404
      this.setCompletePermissions(filterAsyncPath(cloneAllRouter));
      // 按钮权限
      const btnPermissions = filterAsyncButton(toRaw(data));
      if (btnPermissions.length) this.setBtnPermissions(btnPermissions);
      // 角色权限
      // if (roles.length) this.setRolePermissions(roles);
    },
  },
});
