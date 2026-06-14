export const languages = {
  en: 'English',
  it: 'Italiano',
} as const;

export const defaultLang = 'en' as const;
export type Lang = keyof typeof languages;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Lang;
  return defaultLang;
}

export function getAlternateLang(lang: Lang): Lang {
  return lang === 'en' ? 'it' : 'en';
}
