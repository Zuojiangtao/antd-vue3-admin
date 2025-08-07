import type { EChartsOption } from 'echarts';
import type { Ref } from 'vue';
import { unref, nextTick, computed, ref } from 'vue';
import { useDebounceFn, tryOnUnmounted, useTimeoutFn, useEventListener } from '@vueuse/core';
import echarts from '@/core/echarts';

declare interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

export function useEcharts(elRef: Ref<HTMLDivElement>) {
  let chartInstance: echarts.ECharts | null = null;
  let resizeFn: Fn = resize;
  const cacheOptions = ref({}) as Ref<EChartsOption>;
  // let removeResizeFn: Fn = () => {};z

  resizeFn = useDebounceFn(resize, 200);

  const getOptions = computed(() => {
    return {
      backgroundColor: 'transparent',
      ...cacheOptions.value,
    } as EChartsOption;
  });

  function initCharts() {
    const el = unref(elRef);
    if (!el || !unref(el)) {
      return;
    }

    chartInstance = echarts.init(el);
    // const { removeEvent } = useEventListener({
    //   el: window,
    //   name: 'resize',
    //   listener: resizeFn,
    // });
    useEventListener(window, 'resize', resizeFn);
    // removeResizeFn = removeEvent;
    // const { widthRef, screenEnum } = useBreakpoint();
    if (el.offsetHeight === 0) {
      useTimeoutFn(() => {
        resizeFn();
      }, 30);
    }
  }

  function setOptions(options: EChartsOption, clear = true) {
    cacheOptions.value = options;
    return new Promise(resolve => {
      if (unref(elRef)?.offsetHeight === 0) {
        useTimeoutFn(() => {
          setOptions(unref(getOptions)).then(() => resolve(null));
        }, 30);
      }
      nextTick(() => {
        useTimeoutFn(() => {
          if (!chartInstance) {
            initCharts();
            if (!chartInstance) return;
          }
          clear && chartInstance?.clear();

          chartInstance?.setOption(unref(getOptions));
          resolve(null);
        }, 30);
      });
    });
  }

  function resize() {
    chartInstance?.resize({
      animation: {
        duration: 300,
        easing: 'quadraticIn',
      },
    });
  }

  tryOnUnmounted(() => {
    if (!chartInstance) return;
    // removeResizeFn();
    chartInstance.dispose();
    chartInstance = null;
  });

  function getInstance(): echarts.ECharts | null {
    if (!chartInstance) {
      initCharts();
    }
    return chartInstance;
  }

  return {
    setOptions,
    resize,
    echarts,
    getInstance,
  };
}
