// https://github.com/antfu/vite-plugin-md
import type { PluginOption } from 'vite';
import Markdown from 'vite-plugin-md';

// 为了解决 Error [ERR_PACKAGE_PATH_NOT_EXPORTED], 在package.json增加 "type": "module"
export function configLoaderMd(): PluginOption | PluginOption[] {
  return Markdown();
}
