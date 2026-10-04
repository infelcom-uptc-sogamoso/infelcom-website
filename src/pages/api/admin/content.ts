import type { NextApiRequest, NextApiResponse } from 'next';
import { dbContent } from '@/database';
import { conform, defaultContent, validateContent } from '@/content/siteContent';
import { requireAdmin } from '@/utils/requireAdmin';

// Uploaded images travel inline as data: URLs.
export const config = { api: { bodyParser: { sizeLimit: '6mb' } } };

/** Public pages that render site content, regenerated (ISR) after every save. */
const PUBLIC_PATHS = ['/', '/projects', '/researchers', '/stories'];
const LOCALE_PREFIXES = ['', '/es']; // en is the unprefixed default locale

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireAdmin(req, res);
  if (!user) return;

  switch (req.method) {
    case 'GET':
      return res.status(200).json(await dbContent.getSiteContent());
    case 'PUT':
      return updateContent(req, res, user.email ?? 'unknown');
    default:
      res.setHeader('Allow', 'GET, PUT');
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

const updateContent = async (req: NextApiRequest, res: NextApiResponse, email: string) => {
  const errors = validateContent(req.body?.content);
  if (!req.body?.content || errors.length) {
    return res.status(400).json({ message: 'Invalid content', errors });
  }
  try {
    const saved = await dbContent.saveSiteContent(conform(req.body.content, defaultContent), email);
    // Pages also revalidate every 60 s on their own; this makes the change visible right away.
    await Promise.allSettled(
      LOCALE_PREFIXES.flatMap((prefix) =>
        PUBLIC_PATHS.map((path) => res.revalidate(prefix + path === '/es/' ? '/es' : prefix + path)),
      ),
    );
    return res.status(200).json(saved);
  } catch (error) {
    console.error('[content] save failed:', error);
    return res.status(500).json({ message: 'Could not save content' });
  }
};
