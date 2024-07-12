import messages from './messages';
import { app } from 'electron';
import { createI18n } from 'vue-i18n';
import { getLangPreference, setLangPreference } from '@electron/utils/store';
import { SupportedLanguages } from '@electron/types/supported-languages';

const systemLanguage = getLangPreference() || (app ? app.getLocale().split('-')[0] : 'en');

const defaultLocale = systemLanguage in messages ? systemLanguage : 'en';

const translate = createI18n({
  locale: defaultLocale,
  messages,
});

export function setLanguage(locale: SupportedLanguages) {
  translate.global.locale = locale;
  setLangPreference(locale);
}

export function getLanguage(): SupportedLanguages | undefined {
  return getLangPreference();
}

export default translate;
