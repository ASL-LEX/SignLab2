import { createContext, FC, useContext, useEffect, useState, ReactNode } from 'react';
import jwt_decode from 'jwt-decode';
import * as firebaseui from 'firebaseui';
import * as firebase from '@firebase/app';
import * as firebaseauth from '@firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_AUTH_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN
};

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
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem(AUTH_TOKEN_STR));
  const [authenticated, setAuthenticated] = useState<boolean>(true);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

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

  // Handle loading the login UI
  useEffect(() => {
    // Check local storage for token
    const token = localStorage.getItem(AUTH_TOKEN_STR);

    // If no token, need to login
    if (!token) {
      handleUnauthenticated();
      return;
    }

    // Decode the token
    const decodedToken = jwt_decode<DecodedToken>(token);

    // If token is expired, need to login
    if (decodedToken.exp * 1000 < Date.now()) {
      handleUnauthenticated();
      return;
    }

    // Otherwise, can set the token and authenticated state
    handleAuthenticated(token);
  }, []);

  const logout = () => {
    handleUnauthenticated();
  };

  return (
    <AuthContext.Provider value={{ token, authenticated, decodedToken, logout }}>
      {!authenticated && <FirebaseLoginWrapper setToken={handleAuthenticated} />}
      {authenticated && children}
    </AuthContext.Provider>
  );
};

interface FirebaseLoginWrapperProps {
  setToken: (token: string) => void;
}

const FirebaseLoginWrapper: FC<FirebaseLoginWrapperProps> = ({ setToken }) => {
  firebase.initializeApp(firebaseConfig);
  const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebaseauth.getAuth());

  const signInSuccess = async (authResult: any) => {
    setToken(await authResult.user.getIdToken());
  };

  useEffect(() => {
    ui.start('#firebaseui-auth-container', {
      callbacks: {
        signInSuccessWithAuthResult: (authResult, _redirectUrl) => {
          signInSuccess(authResult);
          return true;
        }
      },
      signInOptions: [firebaseauth.GoogleAuthProvider.PROVIDER_ID, firebaseauth.EmailAuthProvider.PROVIDER_ID]
    });
  }, []);

  return <div id="firebaseui-auth-container" />;
};

export const useAuth = () => useContext(AuthContext);
