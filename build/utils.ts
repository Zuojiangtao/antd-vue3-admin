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

// 转换env.production文件配置字段数据类型
export function transformEnvConfType(envConf: Recordable): ViteEnv {
  const ret: any = {};

  for (const envKey of Object.keys(envConf)) {
    let realName = envConf[envKey].replace(/\\n/g, '\n');
    realName = realName === 'true' ? true : realName === 'false' ? false : realName;

    if (envKey === 'VITE_PORT') {
      realName = Number(realName);
    }
    if (envKey === 'VITE_PROXY' && realName) {
      try {
        realName = JSON.parse(realName.replace(/'/g, '"'));
      } catch (error) {
        realName = '';
      }
    }
    ret[envKey] = realName;
    // if (typeof realName === 'string') {
    //   process.env[envName] = realName;
    // } else if (typeof realName === 'object') {
    //   process.env[envName] = JSON.stringify(realName);
    // }
  }
  return ret;
}
