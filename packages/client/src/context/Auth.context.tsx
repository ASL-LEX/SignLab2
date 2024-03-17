import { createContext, FC, useContext, useEffect, useState, ReactNode } from 'react';
import jwt_decode from 'jwt-decode';
import * as firebaseui from 'firebaseui';
import * as firebase from '@firebase/app';
import * as firebaseauth from '@firebase/auth';
import { Organization } from '../graphql/graphql';
import { useGetOrganizationsQuery } from '../graphql/organization/organization';
import LoginComponent from '../components/auth/Login.component';
import SignUpComponent from '../components/auth/Signup.component';
import ResetPasswordComponent from '../components/auth/ResetPassword.component';
import NavigationSidebar from '../components/auth/NavigationSideBar.component';
import { Box, Tabs, Tab, Select, MenuItem, FormControl, Button, Typography, Container } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

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
  const [organizationList, setOrganizationList] = useState<Organization[]>([]);
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'reset'>('login');

  const getOrganizationResult = useGetOrganizationsQuery();

  useEffect(() => {
    // TODO: Handle multi-organization login
    if (getOrganizationResult.data && getOrganizationResult.data.getOrganizations.length > 0) {
      setOrganizationList(getOrganizationResult.data.getOrganizations);
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
  const handleTabChange = (_event: React.SyntheticEvent, tab: 'login' | 'signup' | 'reset') => {
    setActiveTab(tab);
  }; 

  // Handle organization select
  const handleOrganizationSelect = (event: SelectChangeEvent<string>) => {
    const selectedOrganization = organizationList.find(org => org.name === event.target.value);
    setOrganization(selectedOrganization || null);
  };

  return (          
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
    <NavigationSidebar />
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', maxWidth: '400px', width: '100%' }}>
              <Tabs value={activeTab} onChange={handleTabChange} aria-label="login signup tabs" variant="fullWidth">
                <Tab label="Login" value="login" />
                <Tab label="Signup" value="signup" />
              </Tabs>
            </Box>
        </Box>
        {activeTab !== 'reset' && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2, maxWidth: '300px', width: '100%' }}>
            <Typography variant="h5">
              Organization
            </Typography>
            <FormControl fullWidth>
              <Select
                value={organization ? organization.name : ''}
                onChange={handleOrganizationSelect}
                sx={{ mb: 2, width: '100%' }} >
                {organizationList.map((organization, index) => (
                  <MenuItem key={index} value={organization.name}>
                    {organization.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        )}
      <AuthContext.Provider value={{ token, authenticated, decodedToken, logout }}>
        {!authenticated && organization && (
          <FirebaseLoginWrapper setToken={handleAuthenticated} organization={organization} activeTab={activeTab} />
        )}
        {authenticated && children}
      </AuthContext.Provider>

      {activeTab !== 'reset' && (
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Button onClick={(event) => handleTabChange(event, 'reset')} variant="text" sx={{ color: 'blue', textTransform: 'none' }}>Reset Password</Button>
        </Box>
      )}
      </Box>
    </Container>
  );
};

interface FirebaseLoginWrapperProps {
  setToken: (token: string) => void;
  organization: Organization;
  activeTab: 'login' | 'signup' | 'reset';
}

const FirebaseLoginWrapper: FC<FirebaseLoginWrapperProps> = ({ setToken, organization, activeTab }) => {
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
  
  return (
    <Box>
      {activeTab === 'login' && <LoginComponent onLoginSuccess={setToken} auth={auth} />}
      {activeTab === 'signup' && <SignUpComponent auth={auth} />}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, mb: 4 }}>
        {activeTab === 'reset' && <ResetPasswordComponent auth={auth} />}
      </Box>
      <Box id="firebaseui-auth-container" style={{ display: activeTab === 'reset' ? 'none' : 'block' }} />
    </Box>
  );
};

export const useAuth = () => useContext(AuthContext);
