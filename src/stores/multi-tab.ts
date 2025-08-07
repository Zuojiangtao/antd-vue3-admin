import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMultiTabStore = defineStore(
  'multiTab',
  () => {
    const tabPages = ref([]); // 页签路由一位数组
    const fullPathList = ref([]); // 页签路由路径
    const activePath = ref(''); // 当前激活路径

    function setActivePath(fullPath) {
      activePath.value = fullPath;
    }

    function pushMultiTabPages(router) {
      const { path, fullPath, meta, name } = router;
      tabPages.value.push({ path, fullPath, meta, name });
    }

    function pushFullPath(fullPath) {
      if (fullPathList.value.includes(fullPath)) return;
      fullPathList.value.push(fullPath);
    }

    function removeMultiTabPages(currentIndex) {
      tabPages.value.splice(currentIndex, 1);
    }

    function removeFullPath(fullPath) {
      const currentIndex = fullPathList.value.indexOf(fullPath);
      if (currentIndex > -1) {
        fullPathList.value.splice(currentIndex, 1);
        removeMultiTabPages(currentIndex);
      }
    }

    return {
      tabPages,
      fullPathList,
      activePath,
      setActivePath,
      pushMultiTabPages,
      pushFullPath,
      removeFullPath,
    };
  },
  {
    persist: true,
  },
);
