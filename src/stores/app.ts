import { defineStore } from 'pinia';

export const useAppStore = defineStore({
  id: 'app',
  state: () => ({
    isEmbedded: false,
    collapsible: false,
  }),
  getters: {
    getIsEmbedded(state): boolean {
      return state.isEmbedded;
    },
    getCollapsible(state): boolean {
      return state.collapsible;
    },
  },
  actions: {
    setIsEmbedded(isEmbedded: boolean) {
      this.isEmbedded = isEmbedded;
    },
    setCollapsible(collapsible: boolean) {
      this.collapsible = collapsible;
    },
  },
});
