const languageKey = 'language';

export function saveLanguage(lang: string): void {
  localStorage.setItem(languageKey, lang);
}

export function getLanguage(): string | null {
  return localStorage.getItem(languageKey);
}

export function removeLanguage(): void {
  localStorage.removeItem(languageKey);
}
