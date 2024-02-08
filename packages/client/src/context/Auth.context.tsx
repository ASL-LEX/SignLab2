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

}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const uiRef = useRef<HTMLDivElement>(null);
  firebase.initializeApp(firebaseConfig);
  const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebaseauth.getAuth());

  const signInSuccess = (authResult: any, redirectUrl?: string | null): boolean => {

    return true;
  };

  const uiShown = () => {
    if (uiRef.current) {
      uiRef.current.style.display = 'none';
    }
  };

  useEffect(() => {
    ui.start('#firebaseui-auth-container', {
      callbacks: {
        signInSuccessWithAuthResult: signInSuccess,
        uiShown
      },
      signInOptions: [
          firebaseauth.GoogleAuthProvider.PROVIDER_ID,
          firebaseauth.EmailAuthProvider.PROVIDER_ID
      ]
    });

  }, []);

    return (
    <AuthContext.Provider value={{ }}>
      <div id="firebaseui-auth-container"/>
      <div id="main-container" ref={uiRef}>
        {children}
      </div>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
