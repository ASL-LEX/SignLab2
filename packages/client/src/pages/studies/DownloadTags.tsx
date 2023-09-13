import { Button, Container } from '@mui/material';

export const DownloadTags: React.FC = () => {
  return (
    <Container sx={{ position: 'center', display: 'flex', flexDirection: 'column', justifyContext: 'space-between' }}>
      <h3 style={{ marginLeft: 'auto', marginRight: 'auto', top: '10%', paddingBottom: '10px' }}>Download Tags</h3>
      <Button variant="outlined" sx={{ marginLeft: 'auto', marginRight: 'auto', width: 200 }}>
        Download Tag CSV
      </Button>
    </Container>
  );
};
