import type { NextApiRequest, NextApiResponse } from 'next';
import { isValidObjectId } from 'mongoose';
import { db, dbGroups } from '@/database';
import { Group, Project } from '@/models';
import { requireAdmin } from '@/utils/requireAdmin';
import { pick } from '@/utils';

/** The only fields an admin request may write. `code` is set on creation only (projects use it). */
const FIELDS = [
  'slug',
  'name',
  'description',
  'objectives',
  'lines',
  'info',
  'logo',
  'isActive',
  'director',
  'members',
  'en',
];

const ids = (value: unknown): string[] =>
  Array.isArray(value)
    ? Array.from(new Set(value.filter((v) => isValidObjectId(v)).map(String)))
    : [];

/** Normalizes the writable fields; slug falls back to the name. */
const clean = (body: Record<string, unknown>) => {
  const data = pick(body, FIELDS);
  if ('members' in data) data.members = ids(data.members);
  if ('director' in data) data.director = isValidObjectId(data.director) ? data.director : null;
  if ('slug' in data || 'name' in data) {
    data.slug = dbGroups.slugify(String(data.slug || '') || String(body.name || ''));
  }
  return data;
};

/**
 * `projects` (ids) is the full list of projects that belong to the group: listed projects are
 * moved into it, projects no longer listed are detached (their `group` emptied, never deleted).
 */
const syncProjects = async (code: string, projects: unknown) => {
  if (!Array.isArray(projects)) return;
  const list = ids(projects);
  await Project.updateMany({ _id: { $in: list } }, { group: code });
  await Project.updateMany({ group: code, _id: { $nin: list } }, { group: '' });
};

const isDuplicate = (error: unknown) => (error as { code?: number })?.code === 11000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await requireAdmin(req, res))) return;
  try {
    await db.connect();
    switch (req.method) {
      case 'GET':
        return await getGroups(req, res);
      case 'POST':
        return await createGroup(req, res);
      case 'PUT':
        return await updateGroup(req, res);
      case 'DELETE':
        return await deleteGroup(req, res);
      default:
        return res.status(400).json({ message: 'Bad Request' });
    }
  } catch (error) {
    if (isDuplicate(error)) return res.status(409).json({ message: 'Duplicate code or slug' });
    console.error(error);
    return res.status(400).json({ message: 'Revisar la consola del servidor' });
  }
}

/** Without `_id`: the list. With `_id`: one group plus the ids of its projects (edit form). */
const getGroups = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbGroups.ensureSeeded();
  const { _id } = req.query;
  if (_id === undefined) {
    return res.status(200).json(await Group.find().sort({ code: 'asc' }).lean());
  }
  if (!isValidObjectId(_id)) return res.status(400).json({ message: 'Invalid id' });
  const group = await Group.findById(_id).lean();
  if (!group) return res.status(404).json({ message: 'Not found' });
  const projects = await Project.find({ group: group.code }).distinct('_id');
  return res.status(200).json({ ...group, projects });
};

const createGroup = async (req: NextApiRequest, res: NextApiResponse) => {
  const code = String(req.body?.code ?? '')
    .trim()
    .toUpperCase();
  if (!/^[A-Z0-9_-]{2,20}$/.test(code) || !String(req.body?.name ?? '').trim()) {
    return res.status(400).json({ message: 'Invalid code or name' });
  }
  const group = await Group.create({ ...clean(req.body), code });
  await syncProjects(code, req.body.projects);
  return res.status(201).json({ message: 'Semillero creado exitosamente', _id: group._id });
};

const updateGroup = async (req: NextApiRequest, res: NextApiResponse) => {
  const { _id } = req.body ?? {};
  if (!isValidObjectId(_id)) return res.status(400).json({ message: 'Invalid id' });
  const group = await Group.findByIdAndUpdate(_id, clean(req.body), { runValidators: true });
  if (!group) return res.status(400).json({ message: 'No existe un semillero con este ID' });
  await syncProjects(group.code, req.body.projects);
  return res.status(200).json({ message: 'Semillero actualizado exitosamente' });
};

/** Deletes the group only: its projects stay (detached) and its people are untouched. */
const deleteGroup = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
  const group = await Group.findByIdAndDelete(id);
  if (!group) return res.status(400).json({ message: 'No existe un semillero con este ID' });
  await Project.updateMany({ group: group.code }, { group: '' });
  return res.status(200).json({ message: 'Semillero eliminado exitosamente' });
};
