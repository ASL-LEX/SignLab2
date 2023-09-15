import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Avatar, Box, Container, Link, Typography } from '@mui/material';
import { FC, useEffect } from 'react';
import { useAuth } from '../context/Auth.context';
import {useNavigate} from 'react-router-dom';

export const LoginPage: FC = () => {
  // Construct the Auth URL
  const authUrlBase = import.meta.env.VITE_AUTH_LOGIN_URL;
  const projectId = import.meta.env.VITE_AUTH_PROJECT_ID;
  const redirectUrl = encodeURIComponent(window.location.origin + '/callback');
  const authUrl = `${authUrlBase}/?projectId=${projectId}&redirectUrl=${redirectUrl}`;

  const { authenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) {
      navigate('/');
    } else {
      window.location.href = authUrl;
    }
  }, []);

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
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In or Sign Up
        </Typography>
        <Typography>
          <Link
            sx={{ fontStyle: 'italic', color: 'skyblue' }}
            href={authUrl}
          >
            by following this link
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};
