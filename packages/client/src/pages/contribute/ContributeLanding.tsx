import { Typography, Box, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../../context/Study.context';
import { TagProvider, useTag } from '../../context/Tag.context';
import { useTranslation } from 'react-i18next';

const ContributeLandingInternal: React.FC = () => {
  const navigate = useNavigate();
  const { study } = useStudy();
  const { tag, training } = useTag();
  const { t } = useTranslation();

  const enterTagging = () => {
    navigate('/contribute/tagging');
  };

  // TODO: Add in check for training completion

  return (
    <>
      {study && (
        <Box>
          <Typography variant="h2">
            {t('common.study')}: {study.name}
          </Typography>
          <Box sx={{ justifyContent: 'center' }}>
            <Stack spacing={3} direction="column" sx={{ maxWidth: 300 }}>
              <Typography variant="h3">
                {training ? t('components.contribute.studyTraining') : t('components.contribute.studyTagging')}
              </Typography>
              <Typography variant="body2">
                {t('common.study')}: {study.name}
              </Typography>
              <Typography variant="body2">
                {t('common.description')}: {study.description}
              </Typography>
              <Typography variant="body2">
                {t('common.instruction')}: {study.instructions}
              </Typography>
            </Stack>
          </Box>
          <Button variant="outlined" onClick={enterTagging} disabled={tag == undefined}>
            {tag ? t('components.contribute.enterTagging') : t('components.contribute.noTaggingLeft')}
          </Button>
        </Box>
      )}
    </>
  );
};

export const ContributeLanding: React.FC = () => {
  return (
    <TagProvider>
      <ContributeLandingInternal />
    </TagProvider>
  );
};
