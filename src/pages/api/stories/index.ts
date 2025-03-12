import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/database';
import { IStory } from '@/interfaces';
import { Story } from '@/models';

type Data = { message: string } | IStory[];

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getStories(req, res);
    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const getStories = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const stories = await Story.find().lean();
  await db.disconnect();

  const updatedStories = stories.map((story) => {
    return story;
  });

  return res.status(200).json(updatedStories);
};
