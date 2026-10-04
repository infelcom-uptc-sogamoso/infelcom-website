export const SITE_URL = 'https://infelcom.co';

/** Labels come from messages[locale].nav[key]. Organization data lives in the site content. */
export const NAV_LINKS = [
  { href: '/', key: 'home' },
  { href: '/researchers', key: 'about' },
  { href: '/projects', key: 'projects' },
  { href: '/stories', key: 'news' },
  { href: '/#contact', key: 'contact' },
] as const;
