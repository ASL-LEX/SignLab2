import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export interface NoTagNotificationProps {
  studyName: string;
}

export const NoTagNotification: React.FC<NoTagNotificationProps> = ({ studyName }) => {
  const { t } = useTranslation();

  return (
    <Stack direction="column" sx={{ margin: 'auto', maxWidth: 750, alignItems: 'center' }} spacing={2}>
      <Typography variant="h2">{t('tag.noTagsRemaining')}</Typography>
      <Typography variant="body1">{t('tag.noneLeftExplaination', { studyName })}</Typography>
    </Stack>
  );
};
