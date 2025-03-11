import { IResearcher } from '@/interfaces';
import { createContext } from 'react';

interface ContextProps {
  researcher: IResearcher | null;
  sendData: (researcher: IResearcher) => void;
  clearData: () => void;
}

export const ResearcherContext = createContext({} as ContextProps);
