import type { PluginOption } from 'vite';
import { isProd, isReport } from './utils';

import { configLoaderSvg } from './loader/svgComponent';

import { configPluginHTML } from './plugin/html';
import { configPluginAutoImport } from './plugin/autoImport';
import { configPluginComponents } from './plugin/components';
import { configPluginCDNImport } from './plugin/cdnImport';
import { configPluginCompression } from './plugin/compression';
import { configPluginImageOptimizer } from './plugin/imageOptimize';
import { configPluginVisualizer } from './plugin/visualizer';

export function vitePluginConfig(viteEnv: ViteEnv) {
  const {
    VITE_USE_CDN,
    VITE_GLOB_APP_TITLE,
    VITE_APP_NODE_ENV,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
    VITE_USE_IMAGEMIN,
  } = viteEnv;

  const isProdMode = isProd(VITE_APP_NODE_ENV ?? '');
  const isReportMode = isReport();

  const vitePlugins: (PluginOption | PluginOption[])[] = [];

  // vite-svg-loader
  vitePlugins.push(configLoaderSvg());

  // vite-plugin-html
  vitePlugins.push(configPluginHTML(VITE_GLOB_APP_TITLE ?? ''));

  // unplugin-auto-import
  vitePlugins.push(configPluginAutoImport());

  // unplugin-vue-components
  vitePlugins.push(configPluginComponents());

  // vite-plugin-cdn-import
  isProdMode && VITE_USE_CDN && vitePlugins.push(configPluginCDNImport());

  // vite-plugin-compression
  isProdMode &&
    vitePlugins.push(configPluginCompression(VITE_BUILD_COMPRESS ?? 'gzip', VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE));

  // vite-plugin-image-optimizer
  isProdMode && VITE_USE_IMAGEMIN && vitePlugins.push(configPluginImageOptimizer());

  // rollup-plugin-visualizer
  isReportMode && vitePlugins.push(configPluginVisualizer());

  return vitePlugins;
}
