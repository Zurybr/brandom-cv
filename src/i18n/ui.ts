export const languages = {
  en: '🇺🇸',
  es: '🇲🇽',
}

export const defaultLang = 'en'

export type Lang = keyof typeof languages

export const ui = {
  en: {
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.menu.open': 'Open menu',
    'nav.menu.close': 'Close menu',
    'nav.main': 'Main navigation',
    'section.about': 'About Me',
    'section.experience': 'Experience',
    'section.education': 'Education',
    'section.skills': 'Skills',
    'section.projects': 'Projects',
    'section.contact': 'Contact',
    'section.contact.subtitle': "Let's connect",
    'section.contact.text': 'Interested in collaborating? Feel free to reach out.',
    'section.projects.empty': 'More projects coming soon.',
    'section.projects.demo': 'Demo',
    'section.projects.code': 'Code',
    'blog.empty': 'No posts yet.',
    'blog.readingTime': 'min read',
    '404.title': 'Page not found',
    '404.description': "The page you're looking for doesn't exist or was moved.",
    '404.back': 'Back to home',
    'hero.photoAlt': 'Photo of',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.blog': 'Blog',
    'nav.menu.open': 'Abrir menú',
    'nav.menu.close': 'Cerrar menú',
    'nav.main': 'Navegación principal',
    'section.about': 'Sobre Mí',
    'section.experience': 'Experiencia',
    'section.education': 'Educación',
    'section.skills': 'Habilidades',
    'section.projects': 'Proyectos',
    'section.contact': 'Contacto',
    'section.contact.subtitle': 'Conectemos',
    'section.contact.text': '¿Interesado en colaborar? No dudes en contactarme.',
    'section.projects.empty': 'Próximamente más proyectos.',
    'section.projects.demo': 'Demo',
    'section.projects.code': 'Código',
    'blog.empty': 'Aún no hay publicaciones.',
    'blog.readingTime': 'min de lectura',
    '404.title': 'Página no encontrada',
    '404.description': 'La página que buscas no existe o fue movida.',
    '404.back': 'Volver al inicio',
    'hero.photoAlt': 'Foto de',
  },
} as const
