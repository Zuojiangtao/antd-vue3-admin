import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // https://github.com/antfu/unplugin-vue-components
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: 'less',
          resolveIcons: true,
        }),
      ],
      dts: 'types/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // 处理ant-design-vue 样式文件
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  // 依赖优化 - 预构建
  optimizeDeps: {
    include: ['vue', 'pinia', 'vue-router', 'ant-design-vue/es'],
  },
});
