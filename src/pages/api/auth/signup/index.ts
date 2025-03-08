import type { NextApiRequest, NextApiResponse } from 'next';
import { IUser } from '@/interfaces';
import { User } from '@/models';
import bcrypt from 'bcryptjs';
import { db } from '@/database';

type Data = { message: string } | IUser[] | IUser;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return registerNewUser(req, res);
    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const registerNewUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { nickname, email, password, role } = req.body;
  if (!password || password.length < 6) {
    return res.json({
      message: 'La contraseña debe tener una longitud mínima de 6 carácteres',
    });
  }
  try {
    await db.connect();
    const userInDB = await User.findOne({ email });
    if (userInDB) {
      await db.disconnect();
      return res.status(400).json({ message: 'Ya existe un usuario con ese email' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ nickname, email, password: hashedPassword, role });
    const savedUSer = await newUser.save();
    await db.disconnect();
    return res.status(201).json(savedUSer);
  } catch (error) {
    await db.disconnect();
    console.error({ error });
    return res.status(400).json({ message: 'Revisar logs del servidor' });
  }
};
