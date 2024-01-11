import { Typography, Box, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../../context/Study.context';

export const ContributeLanding: React.FC = () => {
  const navigate = useNavigate();
  const { study } = useStudy();

  const enterTagging = () => {
    navigate('/contribute/tagging');
  };

  // TODO: Add in check for training completion
  return (
    <>
    {study && (
      <Box>
        <Typography variant="h2">Study: {study.name}</Typography>
        <Box sx={{ justifyContent: 'center' }}>
          <Stack spacing={3} direction="column" sx={{ maxWidth: 300 }}>
            <Typography variant="h3">{false ? 'Study Training' : 'Study Tagging'}</Typography>
            <Typography variant="body2">Study: {study.name}</Typography>
            <Typography variant="body2">Description: {study.description}</Typography>
            <Typography variant="body2">Instructions: {study.instructions}</Typography>
            <Button variant="outlined" onClick={enterTagging}>
              Enter tagging
            </Button>
          </Stack>
        </Box>
      </Box>
    )}
    </>
  );
};
