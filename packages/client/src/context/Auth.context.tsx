import { createContext, FC, useContext, useEffect, useState, ReactNode } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const AUTH_TOKEN_STR = 'token';

export interface DecodedToken {
  id: string;
  projectId: string;
  role: number;
  exp: number;
}

export interface AuthContextProps {
  authenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
  token: string | null;
  decodedToken: DecodedToken | null;
  setToken: (token: string) => void;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const navigate = useNavigate();

  const setUnautheticated = () => {
    clearToken();
    setAuthenticated(false);
    setToken(null);
    setDecodedToken(null);
  };

  const makeAuthenticated = (token: string, tokenPayload: DecodedToken) => {
    setAuthenticated(true);
    setToken(token);
    setDecodedToken(tokenPayload);
    saveToken(token);
  };

  const logout = () => {
    setUnautheticated();
    navigate('/loginpage');
  };

  const login = (token: string) => {
    makeAuthenticated(token, jwt_decode(token));
    navigate('/');
  };

  useEffect(() => {
    const token = restoreToken();

    // If not token present, redirect to login
    if (!token) {
      setUnautheticated();
      navigate('/loginpage');
      return;
    }

    // Decode the current token payload
    const decodedToken: DecodedToken = jwt_decode(token);
    const currentTime = new Date().getTime() / 1000;

    // Handle expired token
    if (currentTime > decodedToken.exp) {
      setUnautheticated();
      navigate('/loginpage');
      return;
    }

    // User is authenticated with presoent token
    makeAuthenticated(token, decodedToken);
  }, []);

  useEffect(() => {
    if (token) {
      makeAuthenticated(token, jwt_decode(token));
    }
  }, [token]);

  return <AuthContext.Provider value={{ token, decodedToken, setToken, authenticated, setAuthenticated, logout, login }}>{children}</AuthContext.Provider>;
};

const saveToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_STR, token);
};

const restoreToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_STR);
};

const clearToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_STR);
}

export const useAuth = () => useContext(AuthContext);
