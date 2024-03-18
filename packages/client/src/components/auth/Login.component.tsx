import { useState, FC } from 'react';
import * as firebaseauth from '@firebase/auth';
import { TextField, Button, Box, Typography, Dialog, DialogTitle, DialogActions } from '@mui/material';

interface LoginComponentProps {
  onLoginSuccess: (token: string) => void;
  auth: firebaseauth.Auth;
}

// Login Page Component
export const LoginComponent: FC<LoginComponentProps> = ({ auth, onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  // Handle Login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await firebaseauth.signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      onLoginSuccess(token);
    } catch (error) {
      setDialogMessage((error as Error).message);
      setOpenDialog(true);
      setPassword('');
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        '& .MuiTextField-root': { m: 1, width: '30ch' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
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
      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 1, mb: -5, width: '30ch', display: 'flex', justifyContent: 'center' }}
      >
        Login
      </Button>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>{dialogMessage}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};