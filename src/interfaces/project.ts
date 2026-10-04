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
}

export type IProjectCategory = 'undergraduate' | 'master' | 'doctoral';
export type IProjectGroup = 'SEMTEL' | 'SCIECOM' | 'SEMVR';
