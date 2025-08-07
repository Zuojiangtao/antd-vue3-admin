import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { useUserStore } from '@/stores/user';
import notification from 'ant-design-vue/es/notification';
import { VueAxios } from './axios';
// import * as process from 'process';

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: import.meta.env.VITE_GLOB_API_URL,
  timeout: 10 * 1000, // 请求超时时间
  headers: { 'Content-Type': 'application/json' },
});

const noNetworkKey = 'no-network';

// 当前是否刷新token
let ifRefreshing = false;

// 刷新token时，延迟请求数组
let retryRequest = [];

// 异常拦截处理器
const errorHandler = error => {
  const userStore = useUserStore();
  if (error.response) {
    const { data } = error.response;

    // token 错误/过期/无效/缺失
    if (data.code === 401) {
      const config = error.config;
      if (!ifRefreshing) {
        ifRefreshing = true;
        return userStore
          .Logout()
          .then(() => {
            setTimeout(() => {
              const originUrl = window.location.href;
              userStore.LoginForTicket({ currentUrl: originUrl }).then(url => {
                window.location.href = url;
                ifRefreshing = false;
              });
            }, 1500);
            retryRequest.forEach(cb => cb()); // 换取token后将请求队列的请求依次执行
            retryRequest = []; // 执行完请求后清空队列
            return request(config);
          })
          .catch(e => {
            console.error(e);
            userStore.Logout().then(() => {
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            });
          })
          .finally(() => {
            ifRefreshing = false;
          });
      } else {
        return new Promise(resolve => {
          // 取消请求
          const controller = new AbortController();
          if (!config.signal) {
            config.signal = controller.signal;
          }
          // resolve保存到队列中，等token刷新后直接执行
          retryRequest.push(() => {
            resolve(request(config));
          });
        });
      }
    }

    notification.error({ message: '错误', description: data.msg });
  } else {
    notification.error({
      key: noNetworkKey,
      message: '网络异常',
      description: '请检查网络!',
    });
  }
  return Promise.reject(error);
};

// request interceptor
request.interceptors.request.use((config: AxiosRequestConfig) => {
  const userStore = useUserStore();
  const token = userStore.getToken;
  if (token) {
    // 请求头token信息，请根据实际情况进行修改
    config.headers['Authorization'] = token;
  }
  // 不需要携带token，主动删除
  if (config.headers['No-Carry-Token']) {
    delete config.headers['Authorization'];
  }
  return config;
}, errorHandler);

// response interceptor
request.interceptors.response.use((response: AxiosResponse) => {
  const userStore = useUserStore();
  const { data, headers } = response;
  if (headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8') {
    return Promise.resolve(response);
  }
  if (data.code !== 0) {
    const error = new Error(data.msg || 'Error');
    error.response = response;
    errorHandler(error);
    return Promise.reject(error);
  }
  if (data.refreshedToken) {
    userStore.RefreshToken(data.refreshedToken);
  }
  return Promise.resolve(response.data);
}, errorHandler);

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request);
  },
};

export default request;

export { installer as VueAxios, request as axios };
