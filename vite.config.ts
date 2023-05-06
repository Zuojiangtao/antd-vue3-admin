import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

import AutoImport from 'unplugin-auto-import/vite';
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
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        {
          '@vueuse/core': [
            // named imports
            'useMouse', // import { useMouse } from '@vueuse/core',
            'usePreferredDark',
            'useDark',
            'useTitle',
            // alias
            ['useFetch', 'useMyFetch'], // import { useFetch as useMyFetch } from '@vueuse/core',
          ],
          axios: [
            // default imports
            ['default', 'axios'], // import { default as axios } from 'axios',
          ],
        },
      ],
      resolvers: [AntDesignVueResolver()],
      vueTemplate: true,
      cache: true,
      dirs: ['src/hooks', 'src/components'],
      dts: 'types/auto-imports.d.ts',
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
    include: ['vue', 'pinia', 'vue-router', 'ant-design-vue/es', '@vueuse/core'],
  },
});
