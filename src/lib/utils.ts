import type { Lang } from '@/i18n/ui'
import { ui } from '@/i18n/ui'

export function computeReadingTime(content: string, lang: Lang): string {
  const words = content.split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  const label = ui[lang]['blog.readingTime']
  return `${minutes} ${label}`
}
