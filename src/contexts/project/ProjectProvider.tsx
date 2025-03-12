import { FC, PropsWithChildren, useReducer } from 'react';
import { ProjectContext, projectReducer } from '.';
import { IProject } from '@/interfaces';

export interface ProjectState {
  project: IProject | null;
}

const PROJECT_INITIAL_STATE: ProjectState = {
  project: {
    code: '',
    title: '',
    description: '',
    image: '',
    url: '',
    category: 'undergraduate',
    group: 'SCIECOM',
  },
};

export const ProjectProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, PROJECT_INITIAL_STATE);

  const sendData = (project: IProject) => {
    dispatch({ type: '[Project] - getById', payload: project });
  };

  const clearData = () => {
    dispatch({ type: '[Project] - clearData' });
  };

  return (
    <ProjectContext.Provider value={{ ...state, sendData, clearData }}>
      {children}
    </ProjectContext.Provider>
  );
};
