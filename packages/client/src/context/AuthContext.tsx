import { createContext, FC, useContext, useEffect, useState, ReactNode } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export interface DecodedToken {
  id: string;
  projectId: string;
  role: number;
  exp: number;
}

export interface AuthContextProps {
  initialized: boolean;
  setInitialized: (initialized: boolean) => void;
  token?: string;
  decoded_token?: DecodedToken;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [token, setToken] = useState<string>();
  const [decoded_token, setDecodedToken] = useState<DecodedToken>();
  const navigate = useNavigate();

  useEffect(() => {
    const token = restoreToken();
    if (token) {
      const decoded_token: DecodedToken = jwt_decode(token);
      const current_time = new Date().getTime() / 1000;
      if (current_time > decoded_token.exp) {
        navigate('/logout');
      }
      setToken(token);
      setDecodedToken(decoded_token);
    } else {
      localStorage.removeItem('token');
    }
    setInitialized(true);
  }, [token]);

  useEffect(() => {
    if (token) {
      saveToken(token);
      setDecodedToken(jwt_decode(token));
    }
  }, [token]);

  return <AuthContext.Provider value={{ token, decoded_token, setToken, initialized, setInitialized }} {...props} />;
};

const saveToken = (token: string) => {
  localStorage.setItem('token', token);
};

const restoreToken = (): string | null => {
  return localStorage.getItem('token');
};

export const useAuth = () => useContext(AuthContext);
