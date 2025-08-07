import type { RouteRecordRaw } from 'vue-router';
import { HomeOutlined } from '@ant-design/icons-vue';

export const HomeRoute: RouteRecordRaw = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/home.vue'),
    meta: {
      title: '首页',
      icon: HomeOutlined,
      permission: ['/dashboard'],
    },
  },
];
