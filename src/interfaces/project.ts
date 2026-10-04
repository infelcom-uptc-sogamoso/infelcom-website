export interface IProject {
  _id?: string;
  en?: { title?: string; description?: string };
  code: string;
  title: string;
  description: string;
  image: string;
  url: string;
  category: IProjectCategory;
  group: IProjectGroup;
  /** Added by GET /api/project: the group's public data. */
  groupInfo?: { code: string; slug: string; name: string; en?: { name?: string } } | null;
}

export type IProjectCategory = 'undergraduate' | 'master' | 'doctoral';
/** A group code from the groups collection, or '' when the project is not in a group. */
export type IProjectGroup = string;
