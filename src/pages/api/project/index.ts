import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/database';
import { IProject } from '@/interfaces';
import { Project } from '@/models';
import { isValidObjectId } from 'mongoose';

type Data = { message: string } | IProject[] | IProject;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProjectById(req, res);
    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const getProjectById = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { _id } = req.query;
  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: 'El id del proyecto no es válido' });
  }
  try {
    await db.connect();
    const project = await Project.findById(_id).lean();
    await db.disconnect();
    if (!project) {
      return null;
    }
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    await db.disconnect();
    return res.status(400).json({ message: 'Revisar la consola del servidor' });
  }
};
