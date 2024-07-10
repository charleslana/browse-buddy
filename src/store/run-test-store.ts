import translate from '@/translate';
import { Action } from '@electron/interfaces/action';
import { defineStore } from 'pinia';
import { RunTest } from '@electron/interfaces/run-test';

const t = translate.global.t;

export const runTestStore = defineStore('runTest', {
  state: (): { runTest: RunTest } => ({
    runTest: {
      name: t('inputTestName'),
      url: '',
      isSaveLastScreenshot: true,
      isSaveEveryScreenshot: true,
      isHeadless: true,
      defaultTimeout: 15000,
      actions: [],
      repeat: 1,
      log: true,
    },
  }),
  actions: {
    saveRunTest(runTest: RunTest): void {
      this.runTest = runTest;
    },
    saveUrl(url: string): void {
      this.runTest.url = url;
    },
    saveContextUrl(context?: string): void {
      this.runTest.contextUrl = context;
    },
    setIsSaveLastScreenshot(value: boolean): void {
      this.runTest.isSaveLastScreenshot = value;
    },
    setIsSaveEveryScreenshot(value: boolean): void {
      this.runTest.isSaveEveryScreenshot = value;
    },
    setIsSaveHeadless(value: boolean): void {
      this.runTest.isHeadless = value;
    },
    setSaveLog(value: boolean): void {
      this.runTest.log = value;
    },
    setActions(actions: Action[]): void {
      this.runTest.actions = actions;
    },
    addAction(newAction: Action): void {
      this.runTest.actions.push(newAction);
    },
    removeAction(actionId: string): void {
      this.runTest.actions = this.runTest.actions.filter(action => action.id !== actionId);
    },
    updateAction(updatedAction: Action): void {
      const index = this.runTest.actions.findIndex(action => action.id === updatedAction.id);
      if (index !== -1) {
        this.runTest.actions[index] = updatedAction;
      }
    },
    filterEnabledActions(): RunTest {
      const enabledActions = this.runTest.actions.filter(action => action.disabled !== true);
      return { ...this.runTest, actions: enabledActions };
    },
    toggleActionStatus(actionId: string): void {
      const index = this.runTest.actions.findIndex(action => action.id === actionId);
      if (index !== -1) {
        this.runTest.actions[index].disabled = !this.runTest.actions[index].disabled;
      }
    },
    toggleActionVisible(actionId: string): void {
      const index = this.runTest.actions.findIndex(action => action.id === actionId);
      if (index !== -1) {
        const isVisible =
          this.runTest.actions[index].isVisible !== undefined
            ? this.runTest.actions[index].isVisible
            : true;
        this.runTest.actions[index].isVisible = !isVisible;
      }
    },
    setDefaultTimeout(defaultTimeout: number): void {
      this.runTest.defaultTimeout = defaultTimeout;
    },
    setRepeat(repeatCount: number): void {
      this.runTest.repeat = repeatCount;
    },
  },
});
