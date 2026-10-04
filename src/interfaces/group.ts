import type { IProject } from './project';
import type { IResearcher } from './researcher';

/** Translatable fields: Spanish on the document, optional English under `en`. */
type GroupTexts = {
  name: string;
  description: string;
  objectives: string;
  /** One research line per text line. */
  lines: string;
  info: string;
};

export interface IGroup extends GroupTexts {
  _id?: string;
  /** Acronym (e.g. SCIECOM). Projects reference a group by this code; fixed after creation. */
  code: string;
  /** URL segment: /groups/<slug>. */
  slug: string;
  logo: string;
  isActive: boolean;
  director?: string | null;
  members: string[];
  en?: Partial<GroupTexts>;
}

/** GET /api/group?slug=… — the group with its people and projects resolved. */
export interface IGroupPage extends Omit<IGroup, 'director' | 'members'> {
  director: IResearcher | null;
  members: IResearcher[];
  projects: IProject[];
}
