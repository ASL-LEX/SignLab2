import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Avatar, Box, Container, Link, Typography } from '@mui/material';

export const LoginPage = () => {
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
            href={'https://test-auth.sail.codes/?projectId=fe231d0b-5f01-4e52-9bc1-561e76b1e02d&redirectUrl=http%3A%2F%2Flocalhost%3A5173%2Fcallback'}
          >
            by following this link
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};
