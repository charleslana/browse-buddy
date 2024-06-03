import { getThemeModePreference } from './utils/store';
import { nativeTheme } from 'electron';

export function setTheme(): void {
  const getThemeMode = getThemeModePreference();
  nativeTheme.themeSource = getThemeMode;
}
