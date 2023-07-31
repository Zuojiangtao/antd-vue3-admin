import { PluginOption } from 'vite';

import { configPluginHTML } from './plugin/html';
import { configPluginAutoImport } from './plugin/autoImport';
import { configPluginComponents } from './plugin/components';

export function vitePluginConfig(viteEnv: ViteEnv) {
  const { VITE_GLOB_APP_TITLE } = viteEnv;

  const vitePlugins: (PluginOption | PluginOption[])[] = [];

  // vite-plugin-html
  vitePlugins.push(configPluginHTML(VITE_GLOB_APP_TITLE));

  // unplugin-auto-import
  vitePlugins.push(configPluginAutoImport());

  // unplugin-vue-components
  vitePlugins.push(configPluginComponents());

  return vitePlugins;
}
