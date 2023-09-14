import { Select, MenuItem, FormControl, InputLabel, Stack, Paper, Typography } from '@mui/material';

export const Environment: React.FC = () => {
  return (
    <Paper sx={{ padding: 1 }}>
      <Typography variant='body1' sx={{ paddingBottom: 1 }}>Environment</Typography>
      <Stack sx={{ width: '100%' }} spacing={2}>
        <FormControl sx={{ minWidth: '200px' }}>
          <InputLabel>Project Select</InputLabel>
          <Select>
            <MenuItem>Study 1</MenuItem>
            <MenuItem>Study 2</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: '200px' }}>
          <InputLabel>Study Select</InputLabel>
          <Select>
            <MenuItem>Study 1</MenuItem>
            <MenuItem>Study 2</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  );
};
