import { defineStore, storeToRefs } from 'pinia';
import { ref, toRaw } from 'vue';
import type { RouteItem } from 'vue-router';
import { useRoute } from 'vue-router';
import { useMultiTabStore } from '@/stores/multi-tab';

export const useKeepAliveStore = defineStore(
  'keepAlive',
  () => {
    const keepAliveList = ref([]); // 需要缓存keepAlive列表
    const multiTabStore = useMultiTabStore();
    const { tabPages } = storeToRefs(multiTabStore);

    function init() {
      keepAliveList.value = [];
      // 独立运行 - 和多页签联动
      const route = useRoute();
      generateRouterTreeKeepAliveForParent(route); // 当前路由父级路由缓存
      // 多页签存储keep-alive列表
      toRaw(tabPages.value).forEach(item => {
        pushKeepAliveList(item.name);
      });
    }

    function pushKeepAliveList(keepAlive) {
      !keepAliveList.value.includes(keepAlive) && keepAliveList.value.push(keepAlive);
    }

    function removeKeepAlive(activePath) {
      const keepAlive = toRaw(tabPages.value).map(route => route.fullPath === activePath);
      // TODO: 目前只是移除关闭页签的路由，后续要优化成对路由树的深度遍历，确保没有子节点的路由要从列表移除。
      const keepAliveIndex = keepAliveList.value.findIndex(item => item === keepAlive);
      keepAliveIndex > -1 && keepAliveList.value.splice(keepAliveIndex, 1);
    }

    function generateRouterTreeKeepAliveForParent(keepAliveRoute) {
      if (!keepAliveRoute.matched || keepAliveRoute.matched.length <= 1) return;
      keepAliveRoute.matched.forEach(item => {
        if (!keepAliveList.value.includes(item.name)) {
          pushKeepAliveList(item.name);
        }
      });
    }

    function setKeepAliveWithRoute(route: RouteItem) {
      if (!keepAliveList.value.includes(route.name) && route.meta.keepAlive) {
        pushKeepAliveList(route.name);
        generateRouterTreeKeepAliveForParent(route);
      }
    }

    return {
      keepAliveList,
      init,
      pushKeepAliveList,
      removeKeepAlive,
      setKeepAliveWithRoute,
    };
  },
  {
    persist: true,
  },
);
