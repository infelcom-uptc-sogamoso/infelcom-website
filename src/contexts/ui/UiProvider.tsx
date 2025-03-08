import { FC, PropsWithChildren, useReducer } from 'react';
import { UiContext, uiReducer } from '.';

export interface UiState {
  isMenuOpen: boolean;
  isOpenSnackbar: boolean;
  message: string;
}

const UI_INITIAL_STATE: UiState = {
  isMenuOpen: false,
  isOpenSnackbar: false,
  message: '',
};

export const UiProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

  const toogleSideMenu = () => {
    dispatch({ type: '[UI] - ToggleMenu' });
  };

  const toogleSnackbar = (message: string) => {
    dispatch({ type: '[UI] - ToggleSnackbar', payload: message });
  };

  return (
    <UiContext.Provider value={{ ...state, toogleSideMenu, toogleSnackbar }}>
      {children}
    </UiContext.Provider>
  );
};
