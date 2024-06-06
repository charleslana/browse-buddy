import Store from 'electron-store';
import { RunTest } from '@electron/interfaces/run-test';
import { SupportedLanguages } from '@electron/types/supported-languages';
import { ThemeMode } from '@electron/types/theme-mode';

const store = new Store();

const themeKey = 'theme';
const langKey = 'lang';
const urlsKey = 'urls';
const sessionKey = 'session';

export function setThemeModePreference(mode: ThemeMode): void {
  store.set(themeKey, mode);
}

export function getThemeModePreference(): ThemeMode {
  const theme = store.get(themeKey) as ThemeMode | undefined;
  return theme || 'system';
}

export function setLangPreference(lang: SupportedLanguages): void {
  store.set(langKey, lang);
}

export function getLangPreference(): SupportedLanguages | undefined {
  const lang = store.get(langKey) as SupportedLanguages | undefined;
  return lang;
}

export function getUrlsPreference(): string[] {
  const urls = store.get(urlsKey) as string[] | undefined;
  return urls !== undefined ? urls : [];
}

export function addUrlPreference(url: string): void {
  const urls = getUrlsPreference();
  if (!urls.includes(url)) {
    urls.unshift(url);
    store.set(urlsKey, urls);
  }
}

export function deleteUrlPreference(url: string): void {
  const urls = getUrlsPreference();
  const index = urls.indexOf(url);
  if (index !== -1) {
    urls.splice(index, 1);
    store.set(urlsKey, urls);
  }
}

export function getSessionPreference(): RunTest | undefined {
  const session = store.get(sessionKey) as RunTest | undefined;
  return session;
}

export function saveSessionPreference(runTestJSON: string): void {
  const runTest: RunTest = JSON.parse(runTestJSON);
  delete runTest.repeat;
  store.set(sessionKey, runTest);
}

export function deleteSessionPreference(): void {
  store.delete(sessionKey);
}
