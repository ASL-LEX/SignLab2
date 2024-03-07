import { createContext, FC, useContext, useEffect, useState, ReactNode } from 'react';
import jwt_decode from 'jwt-decode';
import * as firebaseui from 'firebaseui';
import * as firebase from '@firebase/app';
import * as firebaseauth from '@firebase/auth';
import { Organization } from '../graphql/graphql';
import { useGetOrganizationsQuery } from '../graphql/organization/organization';

import styles from './UIComponents/styles.component';
import LoginComponent from './UIComponents/Login.component';
import SignUpComponent from './UIComponents/Signup.component';
import ResetPasswordComponent from './UIComponents/ResetPassword.component';
import { Route, Link, Routes, useLocation } from 'react-router-dom';
import { Select, MenuItem } from '@mui/material';

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
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem(AUTH_TOKEN_STR));
  const [authenticated, setAuthenticated] = useState<boolean>(true);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [organizationList, setOrganizationList] = useState<Organization[] | null>(null);

  const getOrganizationResult = useGetOrganizationsQuery();

  useEffect(() => {
    // TODO: Handle multi-organization login
    if (getOrganizationResult.data && getOrganizationResult.data.getOrganizations.length > 0) {
      setOrganizationList(getOrganizationResult.data.getOrganizations);
      console.log('Here' + getOrganizationResult);
      setOrganization(getOrganizationResult.data.getOrganizations[0]);
    }
  }, [getOrganizationResult.data]);

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

  // Handle switch tab
  const [activeTab, setActiveTab] = useState<string>('login');
  const handleTabClick = (tab:string) => {
    setActiveTab(tab);
  };

  const location = useLocation();
  const isResetPassword = location.pathname === "/reset-password";   // determine if it is reset password page

  return (
    <div style={styles.container}>
      {!isResetPassword &&
      (<div style={styles.tabContainer}>
        <div style={{ ...styles.tab, ...(activeTab === 'login' && styles.activeTab) }} onClick={() => handleTabClick('login')}>Login</div>
        <div style={{ ...styles.tab, ...(activeTab === 'signup' && styles.activeTab) }} onClick={() => handleTabClick('signup')}>Signup</div>
      </div>)}
      
      {!isResetPassword && (<div className="options">
        <label style={{display: 'block', textAlign: 'center' as 'center', marginBottom: '5px'}}>Organization</label>
        <Select style={{ width: '300px', height: '40px', marginBottom: '20px'}}>
          {organizationList?.map((organization, index) => {
            return (
              <MenuItem key={index} value={10}>
                {organization.name}
              </MenuItem>
            );
          })}
        </Select>
      </div>)}
      <AuthContext.Provider value={{ token, authenticated, decodedToken, logout }}>
        {!authenticated && organization && (
          <FirebaseLoginWrapper setToken={handleAuthenticated} organization={organization} activeTab={activeTab} isResetPassword={isResetPassword}/>
        )}
        {authenticated && children}
      </AuthContext.Provider>

    </div>
  );
};

interface FirebaseLoginWrapperProps {
  setToken: (token: string) => void;
  organization: Organization;
  activeTab : string;
  isResetPassword: boolean;
}

const FirebaseLoginWrapper: FC<FirebaseLoginWrapperProps> = ({ setToken, organization, activeTab, isResetPassword }) => {
  firebase.initializeApp(firebaseConfig);

  // Handle multi-tenant login
  const auth = firebaseauth.getAuth();
  auth.tenantId = organization.tenantID;
  const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

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
      signInOptions: [firebaseauth.GoogleAuthProvider.PROVIDER_ID]
    });
  }, []);
  
  // return <div id="firebaseui-auth-container" />;
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={activeTab === 'login' ? <LoginComponent onLoginSuccess={setToken} auth={auth} /> : <SignUpComponent auth={auth} />} />
          <Route path="/reset-password" element={<ResetPasswordComponent auth={auth} />} />
        </Routes>
      {!isResetPassword && <Link to="/reset-password" style={{display: 'block', fontSize: '15px', textAlign: 'right' as 'right', margin: '10px'}}>Reset Password</Link>}
      </div>
      <hr />
      <div id="firebaseui-auth-container" />
    </>
  );
};
  

export const useAuth = () => useContext(AuthContext);
