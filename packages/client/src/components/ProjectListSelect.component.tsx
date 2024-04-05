import { ControlProps, rankWith, RankedTester } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { OutlinedInput, Select, Box, Chip, MenuItem, SelectChangeEvent, Checkbox, ListItemText, InputLabel } from '@mui/material';
import { useState, useEffect } from 'react';
import { Project } from '../graphql/graphql';
import { useGetProjectsQuery } from '../graphql/project/project';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../context/Snackbar.context';

const ProjectListSelect: React.FC<ControlProps> = (props) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<Project[]>([]);
  const getProjects = useGetProjectsQuery();

  const { t } = useTranslation();
  const { pushSnackbarMessage } = useSnackbar();

  const handleChange = (event: SelectChangeEvent<typeof selectedProjects>) => {
    setSelectedProjects(event.target.value as Project[]);
  };

  useEffect(() => {
    if (getProjects.data) {
      setProjects(getProjects.data.getProjects);
    } else if (getProjects.error) {
      pushSnackbarMessage(t('errors.projectQuery'), 'error');
    }
  }, [getProjects.data, getProjects.error]);

  return (
    <>
      <InputLabel>{props.label}</InputLabel>
      <Select
        multiple
        input={<OutlinedInput label={props.label} />}
        value={selectedProjects}
        onChange={handleChange}
        fullWidth
        renderValue={(selected) =>(
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value._id} label={value.name} />
            ))}
          </Box>
        )}
      >
        {projects.map(project => (
          <MenuItem key={project._id} value={project as any}>
            <Checkbox checked={selectedProjects.indexOf(project) > -1} />
            <ListItemText primary={project.name} />
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export const projectListTester: RankedTester = rankWith(10, (uischema, _schema, _rootSchema) => {
  return uischema.options != undefined && uischema.options && uischema.options.customType === 'projectList';
});

export default withJsonFormsControlProps(ProjectListSelect);
