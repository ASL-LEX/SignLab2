import { Box, Tabs, Tab, Select, MenuItem, FormControl, Button, Typography, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import { Organization } from '../../graphql/graphql';
import { SelectChangeEvent } from '@mui/material';
import * as firebaseauth from '@firebase/auth';
import { LoginComponent } from './Login.component';
import { SignUpComponent } from './Signup.component';
import { ResetPasswordComponent } from './ResetPassword.component';
import { useGetOrganizationsQuery } from '../../graphql/organization/organization';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../LanguageSelector';

export const AuthComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'reset'>('login');
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [organizationList, setOrganizationList] = useState<Organization[]>([]);
  const { t } = useTranslation();

  const getOrganizationResult = useGetOrganizationsQuery();

  useEffect(() => {
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
    <Box sx={{ width: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
      <Stack sx={{ justifyContent: 'center', maxWidth: 450 }}>
        <LanguageSelector />
        <Box sx={{ borderBottom: 1 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="login signup tabs" variant="fullWidth">
            <Tab label={t('Auth.login.login')} value="login" />
            <Tab label={t('Auth.signup.signup')} value="signup" />
          </Tabs>
        </Box>
        <Typography variant="h5">{t('Auth.organization')}</Typography>
        <FormControl fullWidth>
          <Select value={organization ? organization.name : ''} onChange={handleOrganizationSelect}>
            {organizationList.map((organization, index) => (
              <MenuItem key={index} value={organization.name}>
                {organization.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {organization && (
          <FirebaseLoginWrapper organization={organization} activeTab={activeTab} />
        )}
        {activeTab !== 'reset' && (
          <Button
            onClick={(event) => handleTabChange(event, 'reset')}
            variant="text"
            sx={{ color: 'blue', textTransform: 'none' }}
          >
            {t('Auth.resetPassword.resetPassword')}
          </Button>
        )}
      </Stack>
    </Box>
  );
};

interface FirebaseLoginWrapperProps {
  organization: Organization;
  activeTab: 'login' | 'signup' | 'reset';
}

const FirebaseLoginWrapper: React.FC<FirebaseLoginWrapperProps> = ({ organization, activeTab }) => {
  // Handle multi-tenant login
  const auth = firebaseauth.getAuth();
  auth.tenantId = organization.tenantID;

  return (
    <Box>
      {activeTab === 'login' && <LoginComponent auth={auth} />}
      {activeTab === 'signup' && <SignUpComponent auth={auth} />}
      {activeTab === 'reset' && <ResetPasswordComponent auth={auth} />}
      <Box id="firebaseui-auth-container" style={{ display: activeTab === 'reset' ? 'none' : 'block' }} />
    </Box>
  );
};
