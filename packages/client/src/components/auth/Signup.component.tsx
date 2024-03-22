import { useState, FC } from 'react';
import * as firebaseauth from '@firebase/auth';
import { TextField, Button, Typography, Dialog, DialogTitle, DialogActions, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FirebaseError } from '@firebase/util';

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
  const { t } = useTranslation();

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Check if passwords match
    if (password !== confirmPassword) {
      setDialogMessage(t('Auth.signup.passwordNotMatch'));
      setOpenDialog(true);
      return;
    }
    try {
      await firebaseauth.createUserWithEmailAndPassword(auth, email, password);
      setDialogMessage(t('Auth.signup.success'));
      setOpenDialog(true);
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      let errorMessage = '';
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = t('Auth.signup.emailAlreadyInUse');
            break;
          case 'auth/weak-password':
            errorMessage = t('Auth.signup.weakPassword');
            break;
          case 'auth/invalid-email':
            errorMessage = t('Auth.signup.invalidEmail');
            break;
          default:
            errorMessage = t('Auth.errorUnexpected');
            break;
        }
      } else {
        errorMessage = t('Auth.errorUnexpected');
      }
      setDialogMessage(errorMessage);
      setOpenDialog(true);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <Stack component="form" onSubmit={handleSignUp} spacing={1}>
      <Typography variant="h5">{t('Auth.enterUsername')}</Typography>
      <TextField
        label={t('Auth.email')}
        type="email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('Auth.enterUsername')}
        required
      />
      <Typography variant="h5">{t('Auth.enterPassword')}</Typography>
      <TextField
        label={t('Auth.password')}
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t('Auth.enterPassword')}
        required
      />
      <Typography variant="h5">{t('Auth.signup.reEnterPassword')}</Typography>
      <TextField
        label={t('Auth.password')}
        type="password"
        variant="outlined"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder={t('Auth.signup.reEnterPassword')}
        required
      />
      <Button type="submit" variant="contained">
        {t('Auth.signup.signup')}
      </Button>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>{dialogMessage}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>{t('Auth.dialogClose')}</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
