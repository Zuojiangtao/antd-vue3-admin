// https://github.com/anncwb/vite-plugin-compression
import type { PluginOption } from 'vite';
import vitePluginCompression from 'vite-plugin-compression';

export function configPluginCompression(
  compress: 'gzip' | 'brotli' | 'none',
  deleteOriginFile = false,
): PluginOption | PluginOption[] {
  const compressList: string[] = compress.split('|');

  const plugins: PluginOption[] = [];

  if (compressList.includes('gzip')) {
    plugins.push(
      vitePluginCompression({
        ext: '.gz',
        deleteOriginFile,
      }),
    );
  }

  if (compressList.includes('brotli')) {
    plugins.push(
      vitePluginCompression({
        ext: '.br',
        algorithm: 'brotliCompress',
        deleteOriginFile,
      }),
    );
  }

  return plugins;
}
