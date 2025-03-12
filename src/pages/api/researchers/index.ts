import type { NextApiRequest, NextApiResponse } from 'next';
import { db, CATEGORY_CONSTANTS, ROLE_CONSTANTS } from '@/database';
import { IResearcher } from '@/interfaces';
import { Researcher } from '@/models';

type Data = { message: string } | IResearcher[];

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getResearchers(req, res);
    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const getResearchers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { category = 'all', role = 'all' } = req.query;

  let condition = {};

  if (category !== 'all' && CATEGORY_CONSTANTS.validCategories.includes(`${category}`)) {
    condition = { category };
  }

  if (role !== 'all' && ROLE_CONSTANTS.validCategories.includes(`${role}`)) {
    condition = { role };
  }

  await db.connect();
  const researchers = await Researcher.find(condition).lean();
  await db.disconnect();

  const updatedResearchers = researchers.map((researcher) => {
    return researcher;
  });

  return res.status(200).json(updatedResearchers);
};
