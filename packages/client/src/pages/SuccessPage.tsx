import { Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const SuccessPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Typography variant="h5">{t('components.successPage.succefullyCreated')}</Typography>
      <Button variant="outlined" href="/project/controls">
        {t('common.continue')}
      </Button>
    </div>
  );
};
