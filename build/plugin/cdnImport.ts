// https://github.com/Zuojiangtao/vite-plugin-external-cdn
import type { PluginOption } from 'vite';
import transformExternalCDN, { autoComplete } from 'vite-plugin-external-cdn';

export function configPluginCDNImport(): PluginOption | PluginOption[] {
  return transformExternalCDN({
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
        name: 'vue-demi',
        var: 'VueDemi',
        version: '0.14.5',
        path: 'lib/index.iife.min.js',
      },
      {
        name: 'pinia',
        var: 'Pinia',
        version: '2.0.36',
        path: 'dist/pinia.iife.min.js',
      },
    ],
  });
}
