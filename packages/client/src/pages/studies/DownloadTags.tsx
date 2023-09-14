import { Button, Container, Typography } from '@mui/material';

export const DownloadTags: React.FC = () => {
  return (
    <Container sx={{ position: 'center', display: 'flex', flexDirection: 'column', justifyContext: 'space-between' }}>
      <Typography variant='h3'>Download Tags</Typography>
      <Button variant="outlined" sx={{ marginLeft: 'auto', marginRight: 'auto', width: 200 }}>
        Download Tag CSV
      </Button>
    </Container>
  );
};
