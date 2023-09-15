import { Select, MenuItem, FormControl, InputLabel, Stack, Paper, Typography } from '@mui/material';
import { useProject } from '../context/ProjectContext';
import { useStudy } from '../context/Study';
import { Dispatch, SetStateAction, FC } from 'react';

export const Environment: FC = () => {
  const { project, projects, setProject } = useProject();
  const { study, studies, setStudy } = useStudy();

  return (
    <Paper sx={{ padding: 1 }}>
      <Typography variant='body1' sx={{ paddingBottom: 1 }}>Environment</Typography>
      <Stack sx={{ width: '100%' }} spacing={2}>
        {/* Project Selection */}
        <FieldSelector
          value={project}
          setValue={setProject}
          label={'Project'}
          options={projects}
          getKey={(option) => option._id}
          display={(option) => option.name}
        />
        {/* Study Selection */}
        <FieldSelector
          value={study}
          setValue={setStudy}
          label={'Study'}
          options={studies}
          getKey={(option) => option._id}
          display={(option) => option.name}
        />
      </Stack>
    </Paper>
  );
};

interface FieldSelectorProps<T> {
  value: T | null,
  setValue: Dispatch<SetStateAction<T | null>>;
  label: string;
  options: T[];
  getKey: (option: T) => string;
  display: (option: T) => string;
}

function FieldSelector<T>(props: FieldSelectorProps<T>) {
  const handleChange = (newValue: string | T) => {
    if (typeof newValue == 'string') {
      props.setValue(null);
      return;
    }
    props.setValue(newValue);
  };

  return (
    <FormControl sx={{ minWidth: '200px' }}>
      <InputLabel>{props.label}</InputLabel>
      <Select value={props.value || ''} onChange={(event, _child) => handleChange(event.target.value)} renderValue={(option) => props.display(option)}>
        {props.options.map((option) => <MenuItem value={option as any} key={props.getKey(option)}>{props.display(option)}</MenuItem>)}
      </Select>
    </FormControl>
  );
};
