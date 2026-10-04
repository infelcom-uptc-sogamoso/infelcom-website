import type { NextApiRequest, NextApiResponse } from 'next';
import { db, dbGroups } from '@/database';
import { Group, Project } from '@/models';

// Hidden researchers ("Ocultar en la página pública") are left out, as on /api/researchers.
const PEOPLE = { match: { isShowed: true } };

/** GET /api/group?slug=… — one group with its director, members and projects resolved. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(400).json({ message: 'Bad request' });
  const { slug } = req.query;
  if (typeof slug !== 'string' || !slug) return res.status(400).json({ message: 'Missing slug' });
  try {
    await db.connect();
    await dbGroups.ensureSeeded();
    const group = await Group.findOne({ slug: slug.toLowerCase() })
      .populate({ path: 'director', ...PEOPLE })
      .populate({ path: 'members', ...PEOPLE })
      .lean();
    if (!group) return res.status(404).json({ message: 'Not found' });
    const projects = await Project.find({ group: group.code }).sort({ title: 'asc' }).lean();
    return res.status(200).json({ ...group, projects });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Could not load group' });
  }
}
