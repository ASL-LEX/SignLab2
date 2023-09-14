import { Select, MenuItem, FormControl, InputLabel, Stack, Paper, Typography } from '@mui/material';
import { useProject } from '../context/ProjectContext';
import { Project } from '../graphql/graphql';

export const Environment: React.FC = () => {
  const { project, projects, setProject } = useProject();

  const handleChange = (newValue: string | Project) => {
    if (typeof newValue == 'string') {
      setProject(null);
      return;
    }
    setProject(newValue);
  };

  return (
    <Paper sx={{ padding: 1 }}>
      <Typography variant='body1' sx={{ paddingBottom: 1 }}>Environment</Typography>
      <Stack sx={{ width: '100%' }} spacing={2}>
        <FormControl sx={{ minWidth: '200px' }}>
          <InputLabel>Project Select</InputLabel>
          <Select value={project || ''} onChange={(event, _child) => handleChange(event.target.value)} renderValue={(value) => value.name}>
            {projects.map((project) => <MenuItem value={project as any} key={project._id} >{project.name}</MenuItem>)}
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
