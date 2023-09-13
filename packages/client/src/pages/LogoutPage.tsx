import { CircularProgress, Stack } from '@mui/material';
import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LogoutPage: FC = () => {
  const navigate = useNavigate();
  const { token, setToken } = useAuth();

  useEffect(() => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  }, [token]);

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
