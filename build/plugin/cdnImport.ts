// https://github.com/Zuojiangtao/vite-plugin-external-cdn
import type { PluginOption } from 'vite';
import transformExternalCDN, { autoComplete } from 'vite-plugin-external-cdn';

export function configPluginCDNImport(): PluginOption | PluginOption[] {
  return transformExternalCDN({
    modules: [
      autoComplete('vue'), // vue2 使用 autoComplete('vue2')
      autoComplete('axios'),
      autoComplete('@vueuse/shared'),
      autoComplete('@vueuse/core'),
      autoComplete('dayjs'),
      autoComplete('vue-router'),
      autoComplete('pinia'),
      {
        name: 'vue-demi',
        var: 'VueDemi',
        version: '0.14.10',
        path: 'lib/index.iife.min.js',
      },
    ],
  });
}
