import { createContext, FC, useContext, useEffect, useState, ReactNode, SetStateAction, Dispatch } from 'react';
import jwt_decode from 'jwt-decode';
import { AuthComponent } from '../components/auth/Auth.component';
import * as firebaseauth from '@firebase/auth';
import * as firebase from '@firebase/app';

export const AUTH_TOKEN_STR = 'token';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_AUTH_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN
};

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
  token: string | null;
  decodedToken: DecodedToken | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export interface AuthProviderProps {
  hasUnauthenticatedError: boolean;
  setHasUnauthenticatedError: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({
  children,
  hasUnauthenticatedError,
  setHasUnauthenticatedError
}) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem(AUTH_TOKEN_STR));
  const [authenticated, setAuthenticated] = useState<boolean>(true);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [user, setUser] = useState<firebaseauth.User | null>(null);

  firebase.initializeApp(firebaseConfig);
  const auth = firebaseauth.getAuth();

  auth.onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
    }
  });

  const handleUnauthenticated = () => {
    // Clear the token and authenticated state
    setToken(null);
    setAuthenticated(false);
    localStorage.removeItem(AUTH_TOKEN_STR);
  };

  const handleAuthenticated = (token: string) => {
    setToken(token);
    setAuthenticated(true);
    localStorage.setItem(AUTH_TOKEN_STR, token);

    const decodedToken = jwt_decode<DecodedToken>(token);
    setDecodedToken(decodedToken);
  };

  /** Handles when changes to the user is detected by Firebase Auth */
  const handleUserChange = async (user: firebaseauth.User | null) => {
    if (!user) {
      handleUnauthenticated();
      return;
    }

    const token = await user.getIdToken(true);
    handleAuthenticated(token);
  };

  // Handle when the auth context is notified that an unauthenticated error
  // has taken place
  //
  // NOTE: This will explicitly not handle if the token is valid but the
  // user is making an unauthorized request, that is to make it easier to
  // debug cases where the UI allows the user to navigate to pages where
  // they should/shouldn't have access to
  useEffect(() => {
    if (!hasUnauthenticatedError) {
      return;
    }

    // Check the state of the token, if its no longer valid (not found, expired,
    // etc), then need to re-login
    if (!decodedToken || !token || decodedToken.exp * 1000 < Date.now()) {
      handleUnauthenticated();
    }

    // Reset the flag
    setHasUnauthenticatedError(false);
  }, [hasUnauthenticatedError]);

  // Handle initial loading, check for current auth
  useEffect(() => {
    handleUserChange(user);
  }, [user]);

  const logout = () => {
    handleUnauthenticated();
    auth.signOut();
  };

  return (
    <>
      {authenticated ? (
        <AuthContext.Provider value={{ token, authenticated, decodedToken, logout }}>{children}</AuthContext.Provider>
      ) : (
        <AuthComponent handleAuthenticated={handleAuthenticated} />
      )}
    </>
  );
};

export const useAuth = () => useContext(AuthContext);
