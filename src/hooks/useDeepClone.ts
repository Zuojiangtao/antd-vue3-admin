import { toRaw, type Ref, isRef, ref } from 'vue';

type Cloneable = object | Array<any> | Date | RegExp | Map<any, any> | Set<any> | Ref<any>;

export function useDeepClone() {
  const deepClone = <T extends Cloneable>(val: T, cache = new WeakMap()): T => {
    // ref类型处理
    if (isRef(val)) {
      const value = deepClone(val.value, cache);
      return ref(value) as T;
    }

    // 解包 Vue 响应式对象
    const rawVal = toRaw(val as object);

    // 处理循环引用
    if (cache.has(rawVal)) return cache.get(rawVal);

    // 处理特殊对象类型
    if (rawVal instanceof Date) {
      return new Date(rawVal) as T;
    }
    if (rawVal instanceof RegExp) {
      return new RegExp(rawVal.source, rawVal.flags) as T;
    }
    if (rawVal instanceof Map) {
      const map = new Map();
      cache.set(rawVal, map);
      rawVal.forEach((v, k) => map.set(deepClone(k, cache), deepClone(v, cache)));
      return map as T;
    }
    if (rawVal instanceof Set) {
      const set = new Set();
      cache.set(rawVal, set);
      rawVal.forEach(v => set.add(deepClone(v, cache)));
      return set as T;
    }
    if (rawVal instanceof Array) {
      const arr: any[] = [];
      cache.set(rawVal, arr);
      for (let i = 0; i < rawVal.length; i++) {
        arr[i] = deepClone(rawVal[i], cache);
      }
      return arr as T;
    }
    if (typeof rawVal === 'object' && rawVal !== null) {
      // 保留原型链
      const obj = Object.create(Object.getPrototypeOf(rawVal));
      cache.set(rawVal, obj);
      Reflect.ownKeys(rawVal).forEach(key => {
        obj[key] = deepClone((rawVal as any)[key], cache);
      });
      return obj as T;
    }

    // 基础类型直接返回
    return rawVal as T;
  };

  return { deepClone };
}
