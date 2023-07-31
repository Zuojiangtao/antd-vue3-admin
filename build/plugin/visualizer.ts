// https://github.com/btd/rollup-plugin-visualizer
import type { PluginOption } from 'vite';
import visualizer from 'rollup-plugin-visualizer';

export function configVisualizerConfig(): PluginOption | PluginOption[] {
  return visualizer({
    // template: 'treemap', // sunburst | treemap | network | raw-data | list
    filename: './node_modules/.cache/visualizer/stats.html',
    open: true,
    gzipSize: true,
    brotliSize: true,
  }) as PluginOption;
}
