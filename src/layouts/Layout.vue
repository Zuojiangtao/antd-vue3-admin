<template>
  <a-layout>
    <Sider v-if="!injectInQiankun" />
    <a-layout>
      <GlobalHeader v-if="!injectInQiankun" />
      <MultiTab v-if="!injectInQiankun" />
      <a-layout-content :style="getLayoutContentStyle">
        <router-view v-slot="{ Component }">
          <keep-alive :include="getKeepAliveList">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
  import type { CSSProperties } from 'vue';
  import Sider from './sider/LayoutSider.vue';
  import GlobalHeader from '@/layouts/header/GlobalHeader';
  import MultiTab from '@/layouts/multiTab/MultiTab';
  import { useKeepAliveStore } from '@/stores/keep-alive';

  const getLayoutContentStyle = computed((): CSSProperties => {
    const cssProps = reactive({
      backgroundColor: '#ffffff',
      padding: '16px',
      overflowY: 'overlay',
    });
    return {
      ...cssProps,
      margin: '4px 16px 16px',
    };
  });

  provide('theme', ref('light'));

  const keepAliveStore = useKeepAliveStore();
  const { getKeepAliveList } = storeToRefs(keepAliveStore);
  keepAliveStore.init();
</script>

<style lang="less" scoped>
  @import 'index';
</style>
