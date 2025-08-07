// https://github.com/antfu/unplugin-auto-import
import type { PluginOption } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';

export function configPluginAutoImport(): PluginOption | PluginOption[] {
  return AutoImport({
    imports: [
      'vue',
      'vue-router',
      {
        '@vueuse/core': [
          // named imports
          'useMouse', // import { useMouse } from '@vueuse/core',
          'useTitle',
          'useDebounceFn',
          // alias
          // ['useFetch', 'useMyFetch'], // import { useFetch as useMyFetch } from '@vueuse/core',
        ],
        axios: [
          // default imports
          ['default', 'axios'], // import { default as axios } from 'axios',
        ],
      },
      'pinia',
    ],
    // resolvers: [AntDesignVueResolver()],
    vueTemplate: true,
    dirs: ['src/hooks', 'src/components'],
    dts: 'types/auto-imports.d.ts',
  });
}
