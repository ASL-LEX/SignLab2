import { useState, FC } from 'react';
import * as firebaseauth from '@firebase/auth';
import { TextField, Button, Box, Typography, Dialog, DialogTitle, DialogActions } from '@mui/material';

interface ResetPasswordComponentProps {
  auth: firebaseauth.Auth;
}

// Reset-Password Page Component
const ResetPasswordComponent: FC<ResetPasswordComponentProps> = ({ auth }) => {
  const [email, setEmail] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  // Handle Reset-Password
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await firebaseauth.sendPasswordResetEmail(auth, email);
      setDialogMessage(
        'An email for reset password has been sent to your email. Please check and follow the instructions.'
      );
      setOpenDialog(true);
    } catch (error) {
      setDialogMessage((error as Error).message);
      setOpenDialog(true);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleResetPassword}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& .MuiTextField-root': { m: 1, width: '30ch' }
      }}
    >
      <Typography variant="h5" sx={{ mt: -1, mb: -1 }}>
        Enter Your Email
      </Typography>
      <TextField
        label="Enter Email to Reset Password"
        type="email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        sx={{ mb: 2 }}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 2, mb: 2, width: '30ch', display: 'flex', justifyContent: 'center' }}
      >
        Submit
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

export default ResetPasswordComponent;
