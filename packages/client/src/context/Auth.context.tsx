import { createContext, FC, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import * as firebaseui from 'firebaseui';
import * as firebase from '@firebase/app';
import * as firebaseauth from '@firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_AUTH_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
};

export const AUTH_TOKEN_STR = 'token';

export interface DecodedToken {
  id: string;
  projectId: string;
  role: number;
  exp: number;
}

export interface AuthContextProps {
  authenticated: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem(AUTH_TOKEN_STR));
  const [authenticated, setAuthenticated] = useState<boolean>(true);

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

    return (
    <AuthContext.Provider value={{ token, authenticated }}>
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
        signInSuccessWithAuthResult: (authResult, _redirectUrl) => { signInSuccess(authResult); return true }
      },
      signInOptions: [
          firebaseauth.GoogleAuthProvider.PROVIDER_ID,
          firebaseauth.EmailAuthProvider.PROVIDER_ID
      ]
    });
  }, []);

  return (
    <div id="firebaseui-auth-container" />
  );
};

export const useAuth = () => useContext(AuthContext);
