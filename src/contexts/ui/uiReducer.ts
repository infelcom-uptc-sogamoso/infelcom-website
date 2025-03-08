import { UiState } from '.';

type UiActionType =
  | { type: '[UI] - ToggleMenu' }
  | { type: '[UI] - ToggleSnackbar'; payload: string };

export const uiReducer = (state: UiState, action: UiActionType): UiState => {
  switch (action.type) {
    case '[UI] - ToggleMenu':
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen,
      };
    case '[UI] - ToggleSnackbar':
      return {
        ...state,
        isOpenSnackbar: !state.isOpenSnackbar,
        message: action.payload,
      };
    default:
      return state;
  }
};
