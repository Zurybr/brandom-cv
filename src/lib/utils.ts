export function computeReadingTime(content: string): string {
  const words = content.split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  return `${minutes} min de lectura`
}
