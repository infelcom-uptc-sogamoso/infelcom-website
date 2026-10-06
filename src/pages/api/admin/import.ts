import type { NextApiRequest, NextApiResponse } from 'next';
import { Group, Researcher } from '@/models';
import { db } from '@/database';
import { requireAdmin } from '@/utils/requireAdmin';
import { slugify } from '@/utils';
import { toInscriptions } from '@/utils/inscriptions';

type Data = { message: string; created?: number; existing?: number };

const caseInsensitive = { locale: 'en', strength: 2 };

/** POST { rows: string[][] } — the sheet of the semillero sign-up form, header row first. */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== 'POST') return res.status(400).json({ message: 'Bad Request' });

  const { rows } = req.body ?? {};
  const valid =
    Array.isArray(rows) &&
    rows.length <= 5000 &&
    rows.every((r) => Array.isArray(r) && r.every((c) => typeof c === 'string'));
  if (!valid) return res.status(400).json({ message: 'Formato no válido' });

  let inscriptions;
  try {
    inscriptions = toInscriptions(rows);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }

  try {
    await db.connect();
    let created = 0;
    // Existing researchers (same email) are left as the admin edited them.
    for (const { interests, ...person } of inscriptions) {
      const result = await Researcher.updateOne(
        { email: person.email },
        {
          $setOnInsert: {
            ...person,
            code: crypto.randomUUID(),
            type: 'Semillero de investigación',
            category: 'undergraduate',
            role: 'student',
            isShowed: false,
          },
        },
        { upsert: true, collation: caseInsensitive },
      );
      created += result.upsertedCount;
    }

    const people = await Researcher.find({ email: { $in: inscriptions.map((i) => i.email) } })
      .collation(caseInsensitive)
      .lean();
    const idByEmail = new Map(people.map((p) => [p.email.toLowerCase(), p._id]));
    for (const group of await Group.find().lean()) {
      const keys = [group.slug, slugify(group.name).replace(/^semillero-de-/, '')];
      const ids = inscriptions
        .filter((i) => i.interests.some((s) => keys.some((k) => slugify(s).includes(k))))
        .map((i) => idByEmail.get(i.email));
      if (ids.length)
        await Group.updateOne({ _id: group._id }, { $addToSet: { members: { $each: ids } } });
    }

    return res.status(200).json({
      message: 'Importación completa',
      created,
      existing: inscriptions.length - created,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Revisar la consola del servidor' });
  }
}
