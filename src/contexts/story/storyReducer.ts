import { IStory } from '@/interfaces';
import { StoryState } from '.';

type UiActionType =
  | { type: '[Story] - getById'; payload: IStory }
  | { type: '[Story] - clearData' };

export const storyReducer = (
  state: StoryState,
  action: UiActionType,
): StoryState => {
  switch (action.type) {
    case '[Story] - getById':
      return {
        ...state,
        story: action.payload,
      };
    case '[Story] - clearData':
      return {
        ...state,
        story: null,
      };
    default:
      return state;
  }
};
