import { createContext, useContext } from 'react';
import { defaultContent, localize, type LocalizedContent } from './siteContent';
import { useT } from '@/i18n/useT';

/** Filled in _app from `pageProps.content` (see getContentProps). */
export const ContentContext = createContext<LocalizedContent | null>(null);

/** Site content in the active language; defaults on pages without getContentProps (admin). */
export const useContent = (): LocalizedContent => {
  const content = useContext(ContentContext);
  const { locale } = useT();
  return content ?? localize(defaultContent, locale);
};
