import { Box, Tabs, Tab, Select, MenuItem, FormControl, Button, Typography, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import { Organization } from '../../graphql/graphql';
import { SelectChangeEvent } from '@mui/material';
import * as firebaseui from 'firebaseui';
import * as firebase from '@firebase/app';
import * as firebaseauth from '@firebase/auth';
import { LoginComponent } from './Login.component'
import { SignUpComponent } from './Signup.component';
import { ResetPasswordComponent } from './ResetPassword.component';
import { useGetOrganizationsQuery } from '../../graphql/organization/organization';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_AUTH_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN
};

export interface AuthComponentProps {
  handleAuthenticated: (token: string) => void;
}

export const AuthComponent: React.FC<AuthComponentProps> = ({ handleAuthenticated }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'reset'>('login');
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [organizationList, setOrganizationList] = useState<Organization[]>([]);

  const getOrganizationResult = useGetOrganizationsQuery();

  useEffect(() => {
    // TODO: Handle multi-organization login
    if (getOrganizationResult.data && getOrganizationResult.data.getOrganizations.length > 0) {
      setOrganizationList(getOrganizationResult.data.getOrganizations);
      setOrganization(getOrganizationResult.data.getOrganizations[0]);
    }
  }, [getOrganizationResult.data]);


  // Handle switch tab
  const handleTabChange = (_event: React.SyntheticEvent, tab: 'login' | 'signup' | 'reset') => {
    setActiveTab(tab);
  };

  // Handle organization select
  const handleOrganizationSelect = (event: SelectChangeEvent<string>) => {
    const selectedOrganization = organizationList.find((org) => org.name === event.target.value);
    setOrganization(selectedOrganization || null);
  };

  return (
    <Stack sx={{ justifyContent: 'center', maxWidth: 300 }}>
      <Box sx={{ borderBottom: 1 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="login signup tabs" variant="fullWidth">
          <Tab label="Login" value="login" />
          <Tab label="Signup" value="signup" />
        </Tabs>
      </Box>
      <Typography variant="h5">Organization</Typography>
      <FormControl fullWidth>
        <Select
          value={organization ? organization.name : ''}
          onChange={handleOrganizationSelect}
          sx={{ mb: 2, width: '100%' }}
        >
          {organizationList.map((organization, index) => (
            <MenuItem key={index} value={organization.name}>
              {organization.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
        {organization && (
          <FirebaseLoginWrapper setToken={handleAuthenticated} organization={organization} activeTab={activeTab} />
        )}
      {activeTab !== 'reset' && (
        <Button
          onClick={(event) => handleTabChange(event, 'reset')}
          variant="text"
          sx={{ color: 'blue', textTransform: 'none' }}
        >
          Reset Password
        </Button>
      )}
    </Stack>
  );
};

interface FirebaseLoginWrapperProps {
  setToken: (token: string) => void;
  organization: Organization;
  activeTab: 'login' | 'signup' | 'reset';
}

const FirebaseLoginWrapper: React.FC<FirebaseLoginWrapperProps> = ({ setToken, organization, activeTab }) => {
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
