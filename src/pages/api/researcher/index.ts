import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/database';
import { IResearcher } from '@/interfaces';
import { Researcher } from '@/models';
import { isValidObjectId } from 'mongoose';

type Data = { message: string } | IResearcher[] | IResearcher;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getResearcherById(req, res);
    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const getResearcherById = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { _id } = req.query;
  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: 'El id del investigador no es válido' });
  }
  try {
    await db.connect();
    const researcher = await Researcher.findById(_id).lean();
    await db.disconnect();
    if (!researcher) {
      return null;
    }
    res.status(200).json(researcher);
  } catch (error) {
    console.error(error);
    await db.disconnect();
    return res.status(400).json({ message: 'Revisar la consola del servidor' });
  }
};
