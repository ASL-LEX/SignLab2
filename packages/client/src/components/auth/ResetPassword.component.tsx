import { useState, FC } from 'react';
import * as firebaseauth from '@firebase/auth';
import { TextField, Button, Typography, Dialog, DialogTitle, DialogActions, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FirebaseError } from '@firebase/util';

interface ResetPasswordComponentProps {
  auth: firebaseauth.Auth;
}

// Reset-Password Page Component
export const ResetPasswordComponent: FC<ResetPasswordComponentProps> = ({ auth }) => {
  const [email, setEmail] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const { t } = useTranslation();

  // Handle Reset-Password
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await firebaseauth.sendPasswordResetEmail(auth, email);
      setDialogMessage(t('Auth.resetPassword.confirmDialog'));
      setOpenDialog(true);
    } catch (error) {
      let errorMessage = '';
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = t('Auth.resetPassword.userNotFound');
            break;
          case 'auth/invalid-email':
            errorMessage = t('Auth.resetPassword.invalidEmail');
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
    <Stack component="form" onSubmit={handleResetPassword} spacing={1}>
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
      <Button type="submit" variant="contained">
        {t('Auth.submit')}
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
