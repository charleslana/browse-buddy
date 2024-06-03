import Store from 'electron-store';
import { SupportedLanguages } from 'electron/types/supported-languages';
import { ThemeMode } from 'electron/types/theme-mode';

const store = new Store();

const themeKey = 'theme';
const langKey = 'lang';

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
