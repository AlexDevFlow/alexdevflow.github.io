import { ui, type UIKey } from './ui';
import { defaultLang, type Lang } from './languages';

export { languages, defaultLang, getLangFromUrl, getAlternateLang, type Lang } from './languages';
export { ui, type UIKey } from './ui';

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang]?.[key] || ui[defaultLang][key] || key;
  };
}

export function getLocalizedPath(lang: Lang, path: string): string {
  // Lang prefix plus a trailing slash: pages are built as directories, so
  // /en/portfolio would only 301 to /en/portfolio/.
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  return cleanPath ? `/${lang}/${cleanPath}/` : `/${lang}/`;
}

export function getCurrentPath(url: URL): string {
  // Get path without language prefix
  const [, , ...rest] = url.pathname.split('/');
  return '/' + rest.join('/');
}

export function getAlternateUrl(url: URL, targetLang: Lang): string {
  const currentPath = getCurrentPath(url);
  return getLocalizedPath(targetLang, currentPath);
}
