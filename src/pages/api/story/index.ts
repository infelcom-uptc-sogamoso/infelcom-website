import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/database';
import { IStory } from '@/interfaces';
import { Story } from '@/models';
import { isValidObjectId } from 'mongoose';

type Data = { message: string } | IStory[] | IStory;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getStoryById(req, res);
    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const getStoryById = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { _id } = req.query;
  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: 'El id de la noticia no es válido' });
  }
  try {
    await db.connect();
    const story = await Story.findById(_id).lean();
    await db.disconnect();
    if (!story) {
      return null;
    }
    res.status(200).json(story);
  } catch (error) {
    console.error(error);
    await db.disconnect();
    return res.status(400).json({ message: 'Revisar la consola del servidor' });
  }
};
