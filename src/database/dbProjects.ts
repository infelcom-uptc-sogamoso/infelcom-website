import { db } from '.';
import { IProject } from '@/interfaces';
import { Project } from '@/models';
import { isValidObjectId } from 'mongoose';

interface ProjectCode {
  code: string;
}

export const getProjectById = async (code: string): Promise<IProject | null> => {
  if (!isValidObjectId) return null;

  await db.connect();
  const project = await Project.findOne({ code }).lean();
  await db.disconnect();

  if (!project) {
    return null;
  }

  return JSON.parse(JSON.stringify(project));
};

export const getAllProjectsIds = async (): Promise<ProjectCode[]> => {
  await db.connect();
  const code = await Project.find().lean();
  await db.disconnect();
  return code;
};

export const getAllProjects = async (): Promise<IProject[]> => {
  await db.connect();
  const projects = await Project.find().lean();
  await db.disconnect();
  return JSON.parse(JSON.stringify(projects));
};
