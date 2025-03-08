export interface IResearcher {
  _id?: string;
  code: string;
  imageUrl: string;
  name: string;
  lastName: string;
  type: string;
  email: string;
  cvlacUrl: string;
  isShowed: boolean;
  category: IResearcherCategory;
  role: IResearcherRole;
}

export type IResearcherCategory = 'undergraduate' | 'master' | 'doctoral';
export type IResearcherRole = 'professor' | 'student';
