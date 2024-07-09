import messages from './messages';
import { createI18n } from 'vue-i18n';
import { getLanguage } from '@/utils/local-storage-utils';

const systemLanguage = getLanguage() || navigator.language.split('-')[0];

const defaultLocale = systemLanguage in messages ? systemLanguage : 'en';

const translate = createI18n({
  locale: defaultLocale,
  messages,
});

export default translate;
