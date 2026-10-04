import type { Locale } from '../content/siteContent';

export type { Locale };

/** Cookie Next.js itself reads for the locale; the language switcher writes it. */
export const LOCALE_COOKIE = 'NEXT_LOCALE';

export const toLocale = (value: string | undefined | null): Locale =>
  value === 'es' ? 'es' : 'en';

/**
 * Picks the locale from the browser's preferred language (the first entry of the
 * Accept-Language header, i.e. `navigator.language`). Spanish → es, anything else → en.
 * The country part is ignored on purpose: es-CO, es-ES → es; en-US, en-GB, fr-FR → en.
 */
export const pickLocale = (acceptLanguage: string | null | undefined): Locale => {
  const first = (acceptLanguage ?? '').split(',')[0].trim().toLowerCase();
  return first === 'es' || first.startsWith('es-') ? 'es' : 'en';
};

/** Reads `field` of a DB document in the active locale: `doc.en.field` for English when filled. */
export const inLocale = (
  doc: { en?: Record<string, string | undefined> },
  field: string,
  locale: Locale,
): string => {
  const en = doc.en?.[field]?.trim();
  return locale === 'en' && en ? en : ((doc as Record<string, unknown>)[field] as string) || '';
};
