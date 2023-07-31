// https://github.com/jpkleemans/vite-svg-loader
import type { PluginOption } from 'vite';
import svgLoader from 'vite-svg-loader';

export function configLoaderSvg(): PluginOption | PluginOption[] {
  return svgLoader();
}
