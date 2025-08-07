<template>
  <a-layout-sider
    v-model:collapsed="collapsed"
    :width="232"
    :collapsedWidth="collapsedWidth"
    :theme="layoutTheme"
    collapsible
  >
    <div class="logo">
      <Logo width="24" height="24" />
      <span v-show="!collapsed">antd-vue3-admin</span>
    </div>
    <SiderMenu :menuData="menuData" :defaultSelectedKeys="defaultSelectedKeys" @click="onMenuClick" mode="inline" />
  </a-layout-sider>
</template>

<script lang="ts" setup>
  import type { MenuDataItem } from '../typings';
  import { asyncRouterMap } from '@/router/routes';
  import SiderMenu from '@/layouts/menu/SiderMenu';
  import Logo from '@/assets/logo.svg?component';

  const collapsed: boolean = ref<boolean>(false);
  const collapsedWidth = ref<number>(60);
  const theme = inject('theme');
  const layoutTheme = computed(() => theme.value);
  const menuData: MenuDataItem[] = computed(() => asyncRouterMap);
  const defaultSelectedKeys = computed(() => [asyncRouterMap[0].path]);

  provide('collapsed', collapsed);

  const router = useRouter();
  function onMenuClick({ key }) {
    router.push({ path: key });
  }
</script>

<style lang="less" scoped>
  .logo {
    width: 100%;
    padding: 14px;
    height: 64px;
    box-shadow: 1px 1px 0 0 rgba(0, 0, 0, 0.1);
    display: inline-flex;
    align-items: center;
    justify-content: center;

    & > span {
      margin-left: 16px;
      font-size: 16px;
    }
  }
</style>
