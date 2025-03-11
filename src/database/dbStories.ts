import Story from '@/models/story';
import { isValidObjectId } from 'mongoose';
import { IStory } from '@/interfaces';
import { db } from '.';

interface StoryCode {
  code: string;
}

export const getStoryById = async (_id: string): Promise<IStory | null> => {
  if (!isValidObjectId(_id)) return null;
  try {
    await db.connect();
    const story = await Story.findById(_id).select('-imageUrl').lean();
    await db.disconnect();
    if (!story) {
      return null;
    }
    return JSON.parse(JSON.stringify(story));
  } catch (error) {
    console.error(error);
    await db.disconnect();
    return null;
  }
};

export const getAllStoriesIds = async (): Promise<StoryCode[]> => {
  await db.connect();
  const code = await Story.find().lean();
  await db.disconnect();
  return code;
};

export const getAllStories = async (): Promise<IStory[]> => {
  await db.connect();
  const stories = await Story.find().lean();
  await db.disconnect();
  return JSON.parse(JSON.stringify(stories));
};
