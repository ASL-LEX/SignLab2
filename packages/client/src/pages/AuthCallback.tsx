import { CircularProgress, Stack } from '@mui/material';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const AuthCallback: React.FC = () => {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      console.log('we got token: ', token);
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (token) {
      navigate('/');
    }
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
