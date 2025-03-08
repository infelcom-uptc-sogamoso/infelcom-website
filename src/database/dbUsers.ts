import bcrypt from 'bcryptjs';
import { User } from '../models';
import { db } from '.';

export const checkUserEmailPassword = async (email: string, password: string) => {
  await db.connect();
  const user = await User.findOne({ email });
  await db.disconnect();

  if (!user) {
    return null;
  }

  if (!bcrypt.compareSync(password, user.password!)) {
    return null;
  }

  const { role, nickname, _id } = user;
  return {
    _id,
    email: email.toLowerCase(),
    role,
    nickname,
  };
};

export const oAUthToDbUser = async (oAuthEmail: string, oAuthName: string) => {
  await db.connect();
  const user = await User.findOne({ email: oAuthEmail });

  if (user) {
    await db.disconnect();
    const { _id, nickname, email, role } = user;
    return { _id, nickname, email, role };
  }

  const newUser = new User({
    email: oAuthEmail,
    nickname: oAuthName,
    password: '@',
    role: 'client',
  });
  await newUser.save();
  await db.disconnect();

  const { _id, nickname, email, role } = newUser;
  return { _id, nickname, email, role };
};
