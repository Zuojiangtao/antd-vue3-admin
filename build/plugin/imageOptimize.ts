// https://github.com/FatehAK/vite-plugin-image-optimizer
import type { PluginOption } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export function configPluginImageOptimizer(): PluginOption | PluginOption[] {
  return ViteImageOptimizer({
    // cache: true,
    // cacheLocation: './node_modules/.cache/imageOptimizer',
  });
}
