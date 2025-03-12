import { FC, PropsWithChildren, useReducer } from 'react';
import { StoryContext, storyReducer } from '.';
import { IStory } from '@/interfaces';

export interface StoryState {
  story: IStory | null;
}

const STORY_INITIAL_STATE: StoryState = {
  story: {
    code: '',
    imageUrl: '',
    title: '',
    resume: '',
    content: '',
    createdAt: '',
    updatedAt: ''
  },
};

export const StoryProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(storyReducer, STORY_INITIAL_STATE);

  const sendData = (story: IStory) => {
    dispatch({ type: '[Story] - getById', payload: story });
  };

  const clearData = () => {
    dispatch({ type: '[Story] - clearData' });
  };

  return (
    <StoryContext.Provider value={{ ...state, sendData, clearData }}>
      {children}
    </StoryContext.Provider>
  );
};
