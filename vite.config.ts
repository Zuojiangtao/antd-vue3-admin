import { fileURLToPath, URL } from 'node:url';

import type { UserConfig, ConfigEnv } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

import { vitePluginConfig } from './build';
import { transformEnvConfType } from './build/utils';
import { createProxy } from './build/proxy';

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();

  const viteEnv = transformEnvConfType(loadEnv(mode, root));

  const { VITE_DROP_CONSOLE, VITE_PORT, VITE_PROXY } = viteEnv;

  return {
    plugins: [
      vue({ include: [/\.vue$/, /\.md$/] }),
      vueJsx(),
      // ext vite plugin
      vitePluginConfig(viteEnv),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '#': fileURLToPath(new URL('./types', import.meta.url)),
      },
    },
    server: {
      https: false,
      // Listening on all local IPs
      host: true,
      port: VITE_PORT,
      // Load proxy configuration from .env
      proxy: createProxy(VITE_PROXY),
    },
    esbuild: {
      // 移除日志打印及debugger
      drop: VITE_DROP_CONSOLE ? ['console', 'debugger'] : [],
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
      include: ['vue', 'pinia', 'vue-router', 'ant-design-vue/es', '@vueuse/core'],
    },
  };
});
