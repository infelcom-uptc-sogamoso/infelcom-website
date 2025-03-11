import { FC, PropsWithChildren, useReducer } from 'react';
import { ResearcherContext, researcherReducer } from './';
import { IResearcher } from '@/interfaces';

export interface ResearcherState {
  researcher: IResearcher | null;
}

const RESEARCHER_INITIAL_STATE: ResearcherState = {
  researcher: {
    code: '',
    imageUrl: '',
    name: '',
    lastName: '',
    type: '',
    email: '',
    cvlacUrl: '',
    isShowed: false,
    category: 'undergraduate',
    role: 'student',
  },
};

export const ResearcherProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(researcherReducer, RESEARCHER_INITIAL_STATE);

  const sendData = (researcher: IResearcher) => {
    dispatch({ type: '[Researcher] - getById', payload: researcher });
  };

  const clearData = () => {
    dispatch({ type: '[Researcher] - clearData' });
  };

  return (
    <ResearcherContext.Provider value={{ ...state, sendData, clearData }}>
      {children}
    </ResearcherContext.Provider>
  );
};
