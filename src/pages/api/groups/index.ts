import type { NextApiRequest, NextApiResponse } from 'next';
import { db, dbGroups } from '@/database';
import { Group } from '@/models';

/** GET /api/groups — active groups for the home page. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(400).json({ message: 'Bad request' });
  try {
    await db.connect();
    await dbGroups.ensureSeeded();
    const groups = await Group.find({ isActive: true })
      .select('code slug name description logo en.name en.description')
      .sort({ code: 'asc' })
      .lean();
    return res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Could not load groups' });
  }
}
