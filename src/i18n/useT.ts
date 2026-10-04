import { useRouter } from 'next/router';
import { messages } from './messages';
import { toLocale } from './locale';

/** UI strings for the active locale: `const { t, locale } = useT(); t.nav.home`. */
export const useT = () => {
  const locale = toLocale(useRouter().locale);
  return { t: messages[locale], locale };
};
