import { createContext, FC, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthComponent } from '../components/auth/Auth.component';
import { User, getAuth } from '@firebase/auth';

export interface AuthContextProps {
  authenticated: boolean;
  logout: () => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export interface AuthProviderProps {
  children: ReactNode;
  user: User | null;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children, user }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(true);

  const auth = getAuth();

  useEffect(() => {
    setAuthenticated(!!user);
  }, [user]);

  const logout = async () => {
    await auth.signOut();
    setAuthenticated(false);
  };

  return (
    <>
      {authenticated ? (
        <AuthContext.Provider value={{ authenticated, logout, user }}>{children}</AuthContext.Provider>
      ) : (
        <AuthComponent />
      )}
    </>
  );
};

export const useAuth = () => useContext(AuthContext);
