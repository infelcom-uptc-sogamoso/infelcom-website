import { IProject } from '@/interfaces';
import { createContext } from 'react';

interface ContextProps {
  project: IProject | null;
  sendData: (project: IProject) => void;
  clearData: () => void;
}

export const ProjectContext = createContext({} as ContextProps);
