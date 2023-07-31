// https://github.com/anncwb/vite-plugin-html
import type { PluginOption } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

export function configPluginHTML(title: string): PluginOption | PluginOption[] {
  return createHtmlPlugin({
    minify: true,
    entry: 'src/main.ts',
    inject: {
      // Inject data into ejs template
      data: {
        title,
      },
      // tags: [
      //   {
      //     tag: 'script',
      //     attrs: {
      //       src: '/assets/',
      //     },
      //   },
      // ],
    },
  });
}
