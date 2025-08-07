import type { RouteRecordRaw } from 'vue-router';
import LAYOUT from '@/layouts/Layout.vue';
import EXCEPTION_COMPONENT from '@/components/Exception/Exception';
import { PAGE_NOT_FOUND_NAME } from './constant';

import { HomeRoute } from './module/home';

export const constantRouterMap: RouteRecordRaw = [
  {
    path: '/403',
    component: EXCEPTION_COMPONENT,
  },
  {
    path: '/404',
    component: EXCEPTION_COMPONENT,
  },
  {
    path: '/500',
    component: EXCEPTION_COMPONENT,
  },
  {
    path: '/10000',
    component: EXCEPTION_COMPONENT,
  },
];
export const asyncRouterMap: RouteRecordRaw = [...HomeRoute];

export const completeRouterMap: RouteRecordRaw = [...constantRouterMap, ...asyncRouterMap];

export const WHITELIST: string[] = [PAGE_NOT_FOUND_NAME]; // 基础路由放入白名单

export const ROOT_REDIRECT_ROUTE = '/';

export const basicRoutes: RouteRecordRaw = [
  {
    path: ROOT_REDIRECT_ROUTE,
    name: 'app',
    component: LAYOUT,
    redirect: '/dashboard',
    children: asyncRouterMap,
  },
  ...constantRouterMap,
];
