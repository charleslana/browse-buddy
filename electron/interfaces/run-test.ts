import { Action } from './action';

export interface RunTest {
  name: string;
  url: string;
  contextUrl?: string;
  isSaveLastScreenshot: boolean;
  isSaveEveryScreenshot: boolean;
  isHeadless: boolean;
  defaultTimeout: number;
  actions: Action[];
  repeat?: number;
  log: boolean;
}
