export interface Profile {
  name: string
  title: string
  summary: string
  avatar: string
  location: string
  email: string
  resumeUrl: string
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
