import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/database';
import { IProject } from '@/interfaces';
import { Project } from '@/models';

type Data = { message: string } | IProject[];

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProjects(req, res);
    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const getProjects = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const projects = await Project.find().lean();
  await db.disconnect();

  const updatedProjects = projects.map((product) => {
    return product;
  });

  return res.status(200).json(updatedProjects);
};
