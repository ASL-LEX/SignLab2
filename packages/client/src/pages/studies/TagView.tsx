import { Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const TagView: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container sx={{ position: 'center', display: 'flex', flexDirection: 'column', justifyContext: 'space-between' }}>
      <Typography variant="h3"> {t('menu.viewTags')}</Typography>
    </Container>
  );
};
