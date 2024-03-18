import { useState, FC } from 'react';
import * as firebaseauth from '@firebase/auth';
import { TextField, Button, Typography, Dialog, DialogTitle, DialogActions, Stack } from '@mui/material';

interface SignUpComponentProps {
  auth: firebaseauth.Auth;
}

// SignUp Page Component
export const SignUpComponent: FC<SignUpComponentProps> = ({ auth }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Check if passwords match
    if (password !== confirmPassword) {
      setDialogMessage('Passwords do not match');
      setOpenDialog(true);
      return;
    }
    try {
      await firebaseauth.createUserWithEmailAndPassword(auth, email, password);
      setDialogMessage('Sign Up Successfully');
      setOpenDialog(true);
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setDialogMessage((error as Error).message);
      setOpenDialog(true);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <Stack
      component="form"
      onSubmit={handleSignUp}
      spacing={1}
    >
      <Typography variant="h5">
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
      <Typography variant="h5">
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
      <Typography variant="h5">
        Re-enter Password
      </Typography>
      <TextField
        label="Confirm Password"
        type="password"
        variant="outlined"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Re-enter Password"
        required
      />
      <Button
        type="submit"
        variant="contained"
      >
        Sign Up
      </Button>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>{dialogMessage}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
