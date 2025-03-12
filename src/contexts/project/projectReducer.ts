import { IProject } from '@/interfaces';
import { ProjectState } from '.';

type UiActionType =
  | { type: '[Project] - getById'; payload: IProject }
  | { type: '[Project] - clearData' };

export const projectReducer = (state: ProjectState, action: UiActionType): ProjectState => {
  switch (action.type) {
    case '[Project] - getById':
      return {
        ...state,
        project: action.payload,
      };
    case '[Project] - clearData':
      return {
        ...state,
        project: null,
      };
    default:
      return state;
  }
};
