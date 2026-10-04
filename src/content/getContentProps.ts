import type { GetStaticProps } from 'next';
import { getSiteContent } from '@/database/dbContent';
import { localize } from './siteContent';
import { toLocale } from '@/i18n/locale';

/**
 * getStaticProps for every public page: reads the content from MongoDB (defaults if the DB is
 * empty or down) in the page's language. Pages are regenerated every 60 s and right after an
 * admin saves (see /api/admin/content).
 */
export const getContentProps: GetStaticProps = async ({ locale }) => {
  const { content } = await getSiteContent();
  return { props: { content: localize(content, toLocale(locale)) }, revalidate: 60 };
};
