import { Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useStudy } from '../../context/Study.context';
import { TagGridView } from '../../components/tag/view/TagGridView.component';

export const TagView: React.FC = () => {
  const { t } = useTranslation();
  const { study } = useStudy();

  return (
    <Container sx={{ position: 'center', display: 'flex', flexDirection: 'column', justifyContext: 'space-between' }}>
      <Typography variant="h3"> {t('menu.viewTags')}</Typography>
      {study && <TagGridView study={study} />}
    </Container>
  );
};
