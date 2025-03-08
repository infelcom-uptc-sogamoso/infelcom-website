import type { NextApiRequest, NextApiResponse } from 'next';
import { IResearcher } from '@/interfaces';
import { Researcher } from '@/models';
import { db } from '@/database';
import { isValidObjectId } from 'mongoose';
import { v4 as uuid } from 'uuid';

type Data = { message: string } | IResearcher[] | IResearcher;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getResearchers(req, res);
    case 'PUT':
      return updateResearchers(req, res);
    case 'POST':
      return createResearcher(req, res);
    case 'DELETE':
      return deleteResearcher(req, res);
    default:
      return res.status(400).json({ message: 'Bad Request' });
  }
}

const getResearchers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const researchers = await Researcher.find().sort({ title: 'asc' }).lean();
  await db.disconnect();

  const updatedResearchers = researchers.map((researcher) => {
    return researcher;
  });
  res.status(200).json(updatedResearchers);
};

const updateResearchers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { _id = '' } = req.body as IResearcher;
  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: 'El id del investigador no es válido' });
  }

  try {
    await db.connect();
    const researcher = await Researcher.findById(_id);
    if (!researcher) {
      await db.disconnect();
      return res.status(400).json({ message: 'No existe un investigador con este ID' });
    }
    await researcher.updateOne(req.body);
    await db.disconnect();
    return res.status(200).json({ message: 'Investigador actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    await db.disconnect();
    return res.status(400).json({ message: 'Revisar la consola del servidor' });
  }
};

const createResearcher = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    await db.connect();
    const researcherInDB = await Researcher.findOne({ code: req.body.code });
    if (researcherInDB) {
      await db.disconnect();
      return res.status(400).json({ message: 'Ya existe un investigador con ese id' });
    }
    const { imageUrl, name, lastName, type, email, cvlacUrl, isShowed, category, role } = req.body;
    const researcher = new Researcher({
      code: uuid(),
      imageUrl,
      name,
      lastName,
      type,
      email,
      cvlacUrl,
      isShowed,
      category,
      role,
    });
    await researcher.save();
    await db.disconnect();
    return res.status(201).json({ message: 'Investigador creado exitosamente' });
  } catch (error) {
    await db.disconnect();
    console.error({ error });
    return res.status(400).json({ message: 'Revisar logs del servidor' });
  }
};

const deleteResearcher = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { id } = req.query;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'El id del investigador no es válido' });
  }
  try {
    await db.connect();
    const researcher = await Researcher.findByIdAndDelete(id);
    if (!researcher) {
      await db.disconnect();
      return res.status(400).json({ message: 'No existe un investigador con este ID' });
    }
    await db.disconnect();
    return res.status(200).json({ message: 'Investigador eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    await db.disconnect();
    return res.status(400).json({ message: 'Revisar la consola del servidor' });
  }
};
