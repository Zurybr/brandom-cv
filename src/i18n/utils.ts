import { ui, defaultLang, type Lang } from './ui'

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/')
  if (lang in ui) return lang as Lang
  return defaultLang
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang][key] || ui[defaultLang][key]
  }
}

export function useTranslatedPath(lang: Lang) {
  return function translatePath(path: string, l: string = lang) {
    return `/${l}${path}`
  }
}

export function getLocalizedPath(path: string, lang: Lang): string {
  return `/${lang}${path}`
}

export function switchLocalePath(currentUrl: URL, targetLang: Lang): string {
  const [, , ...rest] = currentUrl.pathname.split('/')
  const path = '/' + rest.join('/')
  return getLocalizedPath(path, targetLang)
}
