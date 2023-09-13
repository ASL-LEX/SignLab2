import { Typography, Button } from '@mui/material';

export const SuccessPage = () => {
  return (
    <div>
      <Typography variant="h5">Successfully created!</Typography>
      <Button variant="outlined" href="/projectcontrol">
        Continue
      </Button>
    </div>
  );
};
