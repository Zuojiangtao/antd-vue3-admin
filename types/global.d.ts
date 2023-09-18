export {};

declare global {
  interface ViteEnv {
    VITE_APP_NODE_ENV?: string;
    VITE_PORT?: number;
    VITE_USE_MOCK?: boolean;
    VITE_USE_PWA?: boolean;
    VITE_USE_CDN?: boolean;
    VITE_USE_IMAGEMIN?: boolean;
    VITE_DROP_CONSOLE?: boolean;
    VITE_PROXY?: [string, string][];
    VITE_GLOB_APP_TITLE?: string;
    VITE_GLOB_APP_SHORT_NAME?: string;
    VITE_GLOB_API_URL?: string;
    VITE_GLOB_API_URL_PREFIX?: string;
    VITE_BUILD_COMPRESS?: 'gzip' | 'brotli' | 'none';
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE?: boolean;
  }
}
