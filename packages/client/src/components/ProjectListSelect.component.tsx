import { ControlProps, rankWith, RankedTester } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { OutlinedInput, Select, Box, Chip, MenuItem, SelectChangeEvent, Checkbox, ListItemText, InputLabel } from '@mui/material';
import { useState } from 'react';

const ProjectListSelect: React.FC<ControlProps> = (props) => {
  const [projectIds, setProjectIds] = useState<string[]>([]);

  const names = [
    'First',
    'Second',
    'Third'
  ];

  const handleChange = (event: SelectChangeEvent<typeof projectIds>) => {
    setProjectIds(typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value);
  };

  return (
    <>
      <InputLabel>{props.label}</InputLabel>
      <Select
        multiple
        input={<OutlinedInput label={props.label} />}
        value={projectIds}
        onChange={handleChange}
        fullWidth
        renderValue={(selected) =>(
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
      >
        {names.map(name => (
          <MenuItem key={name} value={name}>
            <Checkbox checked={projectIds.indexOf(name) > -1} />
            <ListItemText primary={name} />
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
