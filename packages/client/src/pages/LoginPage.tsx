import { Box, Container, FormControl, MenuItem, Select, Button, SelectChangeEvent, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useAuth } from '../context/Auth.context';
import { useNavigate } from 'react-router-dom';
import { Organization } from '../graphql/graphql';
import { useGetOrganizationsQuery } from '../graphql/organization/organization';

export const LoginPage: FC = () => {
  // Construct the Auth URL
  const { authenticated } = useAuth();
  const navigate = useNavigate();

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [authURL, setAuthURL] = useState<string | null>(null);

  // Fetch organizations
  const getOrganizationsResults = useGetOrganizationsQuery();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  useEffect(() => {
    if (getOrganizationsResults.data) {
      setOrganizations(getOrganizationsResults.data.getOrganizations);
    }
  }, [getOrganizationsResults]);

  // Handle if the user is already authenticated
  useEffect(() => {
    if (authenticated) {
      navigate('/');
    }
  }, []);

  const handleOrganizationChange = (event: SelectChangeEvent) => {
    const organization = organizations.find((organization) => organization._id == event.target.value);
    if (!organization) {
      console.error(`Organization with id ${event.target.value} not found`);
      return;
    }

    setOrganization(organization);

    // Setup the redirect URL
    const redirectUrl = encodeURIComponent(window.location.origin + '/callback');
    setAuthURL(`${organization.authURL}&redirectUrl=${redirectUrl}`);
  };

  const loginRedirect = () => {
    if (!authURL) {
      console.error('Auth URL not set');
      return;
    }

    window.location.href = authURL;
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography variant="h2">Login</Typography>
        <FormControl sx={{ m: 1 }}>
          <Select
            sx={{ width: 300, m: 1 }}
            label="Organization"
            onChange={handleOrganizationChange}
            value={organization ? organization._id : ''}
          >
            {organizations.map((organization) => (
              <MenuItem key={organization._id} value={organization._id}>
                {organization.name}
              </MenuItem>
            ))}
          </Select>
          <Button disabled={organization == null} variant="contained" onClick={loginRedirect}>
            {organization ? 'Redirect to Organization Login' : 'Select an Organization to Login'}
          </Button>
        </FormControl>
      </Box>
    </Container>
  );
};
