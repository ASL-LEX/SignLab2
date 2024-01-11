import { Stack, Typography } from '@mui/material';

export interface NoTagNotificationProps {
  studyName: string;
}

export const NoTagNotification: React.FC<NoTagNotificationProps> = ({ studyName }) => {
  return (
    <Stack direction='column' sx={{ margin: 'auto', maxWidth: 750, alignItems: 'center' }} spacing={2}>
      <Typography variant="h2">No tags Remaining</Typography>
      <Typography variant="body1">No tags left for "{studyName}", please check back later</Typography>
    </Stack>
  );
};
