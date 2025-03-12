import { IStory } from '@/interfaces';
import { createContext } from 'react';

interface ContextProps {
  story: IStory | null;
  sendData: (story: IStory) => void;
  clearData: () => void;
}

export const StoryContext = createContext({} as ContextProps);
