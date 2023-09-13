import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Box } from '@mui/material';
import { useState } from 'react';

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: '^[a-zA-Z 0-9]*$'
    },
    description: {
      type: 'string'
    },
    instructions: {
      type: 'string'
    },
    times: {
      type: 'number',
      default: 1
    }
  },
  required: ['name', 'description', 'instructions']
};

const uischema = {
  type: 'Group',
  label: 'Study Information',
  elements: [
    {
      type: 'Control',
      label: 'Name',
      scope: '#/properties/name'
    },
    {
      type: 'Control',
      label: 'Description',
      scope: '#/properties/description'
    },
    {
      type: 'Control',
      label: 'Instructions',
      scope: '#/properties/instructions'
    },
    {
      type: 'Control',
      label: 'Number of times each entry needs to be tagged (default 1)',
      scope: '#/properties/times'
    }
  ]
};

export const NewStudyJsonForm: React.FC = () => {
  const initialData = {
    name: '',
    description: '',
    instructions: ''
  };

  const [data, setData] = useState(initialData);

  const handleChange = (data: any) => {
    setData(data);
  };

  return (
    <Box
      sx={{
        '& .MuiTypography-h5': {
          fontSize: '20px',
          marginBottom: '-3%',
          color: '#414048'
        }
      }}
    >
      <JsonForms schema={schema} uischema={uischema} data={data} renderers={materialRenderers} cells={materialCells} onChange={({ data }) => handleChange(data)} />
    </Box>
  );
};
