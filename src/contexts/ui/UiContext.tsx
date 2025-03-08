import { createContext } from 'react';

interface ContextProps {
  isMenuOpen: boolean;
  isOpenSnackbar: boolean;
  message: string;
  toogleSideMenu: () => void;
  toogleSnackbar: (message: string) => void;
}

export const UiContext = createContext({} as ContextProps);
