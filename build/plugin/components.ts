// https://github.com/antfu/unplugin-vue-components
import type { PluginOption } from 'vite';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

export function configPluginComponents(): PluginOption | PluginOption[] {
  return Components({
    resolvers: [
      AntDesignVueResolver({
        importStyle: 'less',
        resolveIcons: true,
      }),
    ],
    dts: 'types/components.d.ts',
    include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    version: 3,
  });
}
