import { SiteContent } from '../models';
import { conform, defaultContent, type SiteContent as Content } from '../content/siteContent';
import { db } from '.';

export const SITE_CONTENT_KEY = 'site';

export interface StoredContent {
  content: Content;
  /** null when nothing has been saved yet and `content` is just the defaults. */
  updatedAt: string | null;
}

/** Reads the site content merged over the defaults. Never throws: a DB failure yields defaults. */
export const getSiteContent = async (): Promise<StoredContent> => {
  try {
    await db.connect();
    const doc = await SiteContent.findOne({ key: SITE_CONTENT_KEY }).lean();
    await db.disconnect();
    return {
      content: conform(doc?.data, defaultContent),
      updatedAt: doc?.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
    };
  } catch (error) {
    console.error('[content] using defaults, database unavailable:', error);
    return { content: defaultContent, updatedAt: null };
  }
};

export const saveSiteContent = async (content: Content, updatedBy: string) => {
  await db.connect();
  const doc = await SiteContent.findOneAndUpdate(
    { key: SITE_CONTENT_KEY },
    { data: content, updatedBy },
    { upsert: true, new: true, lean: true },
  );
  await db.disconnect();
  return { content, updatedAt: doc?.updatedAt ? new Date(doc.updatedAt).toISOString() : null };
};
