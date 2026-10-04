import { FC, PropsWithChildren, useReducer, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from '.';

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

/** Mirrors the NextAuth session (credentials login at /auth/login). */
export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
  const { data, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      dispatch({ type: '[Auth] - Login', payload: data.user as IUser });
    }
  }, [status, data]);

  const logout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <AuthContext.Provider value={{ ...state, logout }}>{children}</AuthContext.Provider>
  );
};
