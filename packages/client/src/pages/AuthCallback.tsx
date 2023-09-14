import { CircularProgress, Stack } from '@mui/material';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const AuthCallback: React.FC = () => {
  const { login } = useAuth();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      login(token);
    }
  }, []);

  return (
    <Stack
      spacing={4}
      sx={{
        mt: 10,
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <CircularProgress size={64} />
    </Stack>
  );
};
