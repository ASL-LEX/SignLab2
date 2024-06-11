import { useState, FC } from 'react';
import * as firebaseauth from '@firebase/auth';
import { TextField, Button, Typography, Dialog, DialogTitle, DialogActions, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FirebaseError } from '@firebase/util';

interface LoginComponentProps {
  auth: firebaseauth.Auth;
}

// Login Page Component
export const LoginComponent: FC<LoginComponentProps> = ({ auth }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const { t } = useTranslation();

  // Handle Login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // NOTE: Signing in with Firebase will automatically update the
      // internal client object causing the rest of the UI to update
      await firebaseauth.signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      let errorMessage = '';
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/wrong-password':
            errorMessage = t('Auth.login.wrongPassword');
            break;
          case 'auth/user-not-found':
            errorMessage = t('Auth.login.userNotFound');
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
      setPassword('');
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <Stack component="form" onSubmit={handleLogin} spacing={1}>
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
      <Button type="submit" variant="contained">
        {t('Auth.login.login')}
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
