import { createContext, FC, useContext, useState, ReactNode } from 'react';
import { AuthComponent } from '../components/auth/Auth.component';
import * as firebaseauth from '@firebase/auth';

export const AUTH_TOKEN_STR = 'token';

export interface DecodedToken {
  aud: string;
  auth_time: number;
  email: string;
  email_verified: boolean;
  exp: number;
  firebase: {
    identities: {
      email: string[];
      email_verified: boolean;
    };
    sign_in_provider: string;
    user_id: string;
    tenant: string;
  };
  iat: number;
  iss: string;
  sub: string;
  user_id: string;
}

export interface AuthContextProps {
  authenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(true);

  const auth = firebaseauth.getAuth();

  const handleAuthenticated = () => {
    setAuthenticated(true);
  };

  const logout = () => {
    auth.signOut();
    setAuthenticated(false);
  };

  return (
    <>
      {authenticated ? (
        <AuthContext.Provider value={{ authenticated, logout }}>{children}</AuthContext.Provider>
      ) : (
        <AuthComponent handleAuthenticated={handleAuthenticated} />
      )}
    </>
  );
};

export const useAuth = () => useContext(AuthContext);
