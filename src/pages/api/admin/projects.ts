import type { NextApiRequest, NextApiResponse } from 'next';
import { IProject } from '@/interfaces';
import { Project } from '@/models';
import { db } from '@/database';
import { isValidObjectId } from 'mongoose';
import { v4 as uuid } from 'uuid';

type Data = { message: string } | IProject[] | IProject;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProjects(req, res);
    case 'PUT':
      return updateProjects(req, res);
    case 'POST':
      return createProject(req, res);
    case 'DELETE':
      return deleteProject(req, res);
    default:
      return res.status(400).json({ message: 'Bad Request' });
  }
}

const getProjects = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const projects = await Project.find().sort({ title: 'asc' }).lean();
  await db.disconnect();

  const updatedProjects = projects.map((project) => {
    return project;
  });
  res.status(200).json(updatedProjects);
};

const updateProjects = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { _id = '' } = req.body as IProject;
  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: 'El id del proyecto no es válido' });
  }
  try {
    await db.connect();
    const project = await Project.findById(_id);
    if (!project) {
      await db.disconnect();
      return res.status(400).json({ message: 'No existe un proyecto con este ID' });
    }
    await project.updateOne(req.body);
    await db.disconnect();
    return res.status(200).json({ message: 'Proyecto actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    await db.disconnect();
    return res.status(400).json({ message: 'Revisar la consola del servidor' });
  }
};

const createProject = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    await db.connect();
    const projectInDB = await Project.findOne({ code: req.body.code });
    if (projectInDB) {
      await db.disconnect();
      return res.status(400).json({ message: 'Ya existe un proyecto con ese id' });
    }
    const { title, description, image, url, category, group } = req.body;
    const project = new Project({
      code: uuid(),
      title,
      description,
      image,
      url,
      category,
      group,
    });
    await project.save();
    await db.disconnect();
    return res.status(201).json({ message: 'Proyecto creado exitosamente' });
  } catch (error) {
    await db.disconnect();
    console.error({ error });
    return res.status(400).json({ message: 'Revisar logs del servidor' });
  }
};

const deleteProject = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { id } = req.query;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'El id del proyecto no es válido' });
  }
  try {
    await db.connect();
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      await db.disconnect();
      return res.status(400).json({ message: 'No existe un proyecto con este ID' });
    }
    await db.disconnect();
    return res.status(200).json({ message: 'Proyecto eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    await db.disconnect();
    return res.status(400).json({ message: 'Revisar la consola del servidor' });
  }
};
