import { IResearcher } from '@/interfaces';
import { ResearcherState } from '.';

type UiActionType =
  | { type: '[Researcher] - getById'; payload: IResearcher }
  | { type: '[Researcher] - clearData' };

export const researcherReducer = (
  state: ResearcherState,
  action: UiActionType,
): ResearcherState => {
  switch (action.type) {
    case '[Researcher] - getById':
      return {
        ...state,
        researcher: action.payload,
      };
    case '[Researcher] - clearData':
      return {
        ...state,
        researcher: null,
      };
    default:
      return state;
  }
};
