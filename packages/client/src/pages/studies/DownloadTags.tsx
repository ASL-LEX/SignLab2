import { Button, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const DownloadTags: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container sx={{ position: 'center', display: 'flex', flexDirection: 'column', justifyContext: 'space-between' }}>
      <Typography variant="h3"> {t('menu.downloadTags')}</Typography>
      <Button variant="outlined" sx={{ marginLeft: 'auto', marginRight: 'auto', width: 200 }}>
        {t('menu.downloadTags')}
      </Button>
    </Container>
  );
};
