// https://github.com/MMF-FE/vite-plugin-cdn-import
import type { PluginOption } from 'vite';
import PluginImportToCDN, { autoComplete } from 'vite-plugin-cdn-import';

export function configPluginCDNImport(): PluginOption | PluginOption[] {
  return PluginImportToCDN({
    modules: [
      autoComplete('vue'), // vue2 使用 autoComplete('vue2')
      autoComplete('axios'),
      // autoComplete('@vueuse/shared'),
      autoComplete('@vueuse/core'),
      {
        name: 'vue-router',
        var: 'VueRouter',
        version: '4.2.0',
        path: 'dist/vue-router.global.min.js',
      },
      {
        name: 'pinia',
        var: 'Pinia',
        version: '2.0.36',
        path: 'dist/pinia.iife.min.js',
      },
      {
        name: '@ant-design/icons-vue',
        var: '@ant-design/icons-vue',
        version: '6.1.0',
        path: '+esm',
      },
    ],
  });
}
