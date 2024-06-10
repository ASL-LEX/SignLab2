import { createContext, FC, useContext, useEffect, useState, ReactNode, SetStateAction, Dispatch } from 'react';
import jwt_decode from 'jwt-decode';
import { AuthComponent } from '../components/auth/Auth.component';

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
