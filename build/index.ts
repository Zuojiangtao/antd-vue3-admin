import { PluginOption } from 'vite';
import { isProd, isReport } from './utils';

// import { configLoaderMd } from './loader/mdComponent';
import { configLoaderSvg } from './loader/svgComponent';

import { configPluginHTML } from './plugin/html';
import { configPluginAutoImport } from './plugin/autoImport';
import { configPluginComponents } from './plugin/components';
import { configPluginCDNImport } from './plugin/cdnImport';
import { configPluginCompression } from './plugin/compression';
import { configPluginImageOptimizer } from './plugin/imageOptimize';
import { configPluginVisualizer } from './plugin/visualizer';

export function vitePluginConfig(viteEnv: ViteEnv) {
  const { VITE_GLOB_APP_TITLE, VITE_APP_NODE_ENV, VITE_BUILD_COMPRESS } = viteEnv;

  const isProdMode = isProd(VITE_APP_NODE_ENV);
  const isReportMode = isReport();

  const vitePlugins: (PluginOption | PluginOption[])[] = [];

  // vite-plugin-md
  // vitePlugins.push(configLoaderMd());

  // vite-svg-loader
  vitePlugins.push(configLoaderSvg());

  // vite-plugin-html
  vitePlugins.push(configPluginHTML(VITE_GLOB_APP_TITLE));

  // unplugin-auto-import
  vitePlugins.push(configPluginAutoImport());

  // unplugin-vue-components
  vitePlugins.push(configPluginComponents());

  // vite-plugin-cdn-import
  isProdMode && vitePlugins.push(configPluginCDNImport());

  // vite-plugin-compression
  isProdMode && vitePlugins.push(configPluginCompression(VITE_BUILD_COMPRESS));

  // vite-plugin-image-optimizer
  isProdMode && vitePlugins.push(configPluginImageOptimizer());

  // rollup-plugin-visualizer
  isReportMode && vitePlugins.push(configPluginVisualizer());

  return vitePlugins;
}
