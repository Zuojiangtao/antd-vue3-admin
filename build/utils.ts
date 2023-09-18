// utils
import * as process from 'process';

export function isDev(VITE_APP_NODE_ENV: string): boolean {
  return VITE_APP_NODE_ENV === 'development';
}

export function isProd(VITE_APP_NODE_ENV: string): boolean {
  return VITE_APP_NODE_ENV === 'production';
}

export function isReport(): boolean {
  return process.env.REPORT === 'true';
}
