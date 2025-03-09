import { isValidObjectId } from 'mongoose';
import { IResearcher } from '@/interfaces';
import { Researcher } from '@/models';
import { db } from '.';

interface ResearcherCode {
  code: string;
}

export const getResearcherById = async (_id: string): Promise<IResearcher | null> => {
  if (!isValidObjectId(_id)) return null;

  await db.connect();
  const researcher = await Researcher.findOne({ _id }).lean();
  await db.disconnect();

  if (!researcher) {
    return null;
  }

  return JSON.parse(JSON.stringify(researcher));
};

export const getAllResearchersIds = async (): Promise<ResearcherCode[]> => {
  await db.connect();
  const code = await Researcher.find().lean();
  await db.disconnect();
  return code;
};

export const getAllResearchers = async (): Promise<IResearcher[]> => {
  await db.connect();
  const researchers = await Researcher.find().lean();
  await db.disconnect();
  return JSON.parse(JSON.stringify(researchers));
};
