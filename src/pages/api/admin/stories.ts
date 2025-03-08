import type { NextApiRequest, NextApiResponse } from 'next';
import { IStory } from '@/interfaces';
import { Story } from '@/models';
import { db } from '@/database';
import { isValidObjectId } from 'mongoose';
import { v4 as uuid } from 'uuid';

type Data = { message: string } | IStory[] | IStory;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getStories(req, res);
    case 'PUT':
      return updateStories(req, res);
    case 'POST':
      return createStory(req, res);
    case 'DELETE':
      return deleteStory(req, res);
    default:
      return res.status(400).json({ message: 'Bad Request' });
  }
}

const getStories = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const stories = await Story.find().sort({ title: 'asc' }).lean();
  await db.disconnect();

  const updatedStories = stories.map((story) => {
    return story;
  });
  res.status(200).json(updatedStories);
};

const updateStories = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { _id = '' } = req.body as IStory;
  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: 'El id de la noticia no es válido' });
  }
  try {
    await db.connect();
    const story = await Story.findById(_id);
    if (!story) {
      await db.disconnect();
      return res.status(400).json({ message: 'No existe una noticia con este ID' });
    }
    await story.updateOne(req.body);
    await db.disconnect();
    return res.status(200).json({ message: 'Noticia actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    await db.disconnect();
    return res.status(400).json({ message: 'Revisar la consola del servidor' });
  }
};

const createStory = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    await db.connect();
    const storyInDB = await Story.findOne({ code: req.body.code });
    if (storyInDB) {
      await db.disconnect();
      return res.status(400).json({ message: 'Ya existe una noticia con ese id' });
    }
    const { title, resume, content, imageUrl } = req.body;
    const story = new Story({
      code: uuid(),
      title,
      resume,
      content,
      imageUrl,
    });
    await story.save();
    await db.disconnect();
    return res.status(201).json({ message: 'Noticia creada exitosamente' });
  } catch (error) {
    await db.disconnect();
    console.error({ error });
    return res.status(400).json({ message: 'Revisar logs del servidor' });
  }
};

const deleteStory = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { id } = req.query;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'El id de la noticia no es válido' });
  }
  try {
    await db.connect();
    const story = await Story.findByIdAndDelete(id);
    if (!story) {
      await db.disconnect();
      return res.status(400).json({ message: 'No existe una noticia con este ID' });
    }
    await db.disconnect();
    return res.status(200).json({ message: 'Noticia eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    await db.disconnect();
    return res.status(400).json({ message: 'Revisar la consola del servidor' });
  }
};
