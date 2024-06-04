import { defineStore } from 'pinia';
import { NavigationResult } from 'electron/interfaces/navigation-result';

export const navigationResultStore = defineStore('navigationResult', {
  state: (): { navigationResult: NavigationResult[] } => ({
    navigationResult: [],
  }),
  actions: {
    save(navigationResult: NavigationResult[]): void {
      this.navigationResult = navigationResult;
    },
  },
});
