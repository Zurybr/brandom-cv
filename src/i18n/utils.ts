import { ui, defaultLang, type Lang } from './ui'

const base = import.meta.env.BASE_URL.replace(/\/$/, '')

function stripBase(pathname: string): string {
  return pathname.startsWith(base) ? pathname.slice(base.length) || '/' : pathname
}

export function getLangFromUrl(url: URL): Lang {
  const pathWithoutBase = stripBase(url.pathname)
  const [, lang] = pathWithoutBase.split('/')
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
    return `${base}/${l}${path}`
  }
}

export function getLocalizedPath(path: string, lang: Lang): string {
  return `${base}/${lang}${path}`
}

export function switchLocalePath(currentUrl: URL, targetLang: Lang): string {
  const pathWithoutBase = stripBase(currentUrl.pathname)
  const [, , ...rest] = pathWithoutBase.split('/')
  const path = '/' + rest.join('/')
  return getLocalizedPath(path, targetLang)
}

export function publicAsset(path: string): string {
  return `${base}${path}`
}
