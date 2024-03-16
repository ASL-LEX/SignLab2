import { useState, FC } from 'react';
import * as firebaseauth from '@firebase/auth';
import { TextField, Button, Box, Typography } from '@mui/material';

interface SignUpComponentProps {
  auth: firebaseauth.Auth;
}

// SignUp Page Component
const SignUpComponent: FC<SignUpComponentProps> = ({ auth }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await firebaseauth.createUserWithEmailAndPassword(auth, email, password);
      alert('Sign Up Successfully');
      setPassword('');
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSignUp} sx={{ '& .MuiTextField-root': { m: 1, width: '30ch' }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" sx={{ mt: -1, mb: -2 }}>
        Enter Username
      </Typography>
      <TextField
        label="Email"
        type="email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <Typography variant="h5" sx={{ mt: -1, mb: -2 }}>
        Enter Password
      </Typography>
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <Button type="submit" variant="contained" sx={{ mt: 1, mb: -5, width: '30ch', display: 'flex', justifyContent: 'center' }}>
        Sign Up
      </Button>
    </Box>
  );

};

export default SignUpComponent;
