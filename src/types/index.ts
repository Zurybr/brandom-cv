type Bilingual = { en: string; es: string }

export interface Profile {
  name: string
  title: string | Bilingual
  summary: string | Bilingual
  avatar: string
  location: string | Bilingual
  email: string
  resumeUrl: string
}

export function localizeText(value: string | Bilingual, lang: string): string {
  if (typeof value === 'string') return value
  return value[lang as keyof Bilingual] || value.en
}

export interface Experience {
  company: string
  role: string
  period: string
  description: string
  highlights?: string[]
  technologies: string[]
}

export interface Education {
  institution: string
  degree: string
  period: string
  description: string
}

export interface SkillGroup {
  category: string
  items: string[]
}

export interface Project {
  title: string
  description: string
  image?: string
  technologies: string[]
  liveUrl?: string
  repoUrl?: string
  featured?: boolean
}

export interface SocialLink {
  platform: string
  url: string
  icon: string
}

export interface BlogPostFrontmatter {
  title: string
  date: string
  category?: string
  excerpt: string
}

export interface BlogPost extends BlogPostFrontmatter {
  slug: string
  readingTime: string
}
