import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Box } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import { PartialStudyCreate } from '../types/study';
import { ErrorObject } from 'ajv';

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
    tagsPerEntry: {
      type: 'number',
      default: 1
    }
  },
  required: ['name', 'description', 'instructions', 'tagsPerEntry']
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
      scope: '#/properties/tagsPerEntry'
    }
  ]
};

export interface NewStudyFormProps {
  newStudy: PartialStudyCreate | null;
  setNewStudy: Dispatch<SetStateAction<PartialStudyCreate | null>>;
}

export const NewStudyJsonForm: React.FC<NewStudyFormProps> = (props) => {
  const initialData = {
    tagsPerEntry: schema.properties.tagsPerEntry.default
  };

  const [data, setData] = useState<any>(initialData);

  const handleChange = (data: any, errors: ErrorObject[] | undefined) => {
    setData(data);
    if (!errors || errors.length === 0) {
      // TODO: Check for unique study name
      props.setNewStudy({ ...data });
    } else {
      props.setNewStudy(null);
    }
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
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={data}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ data, errors }) => handleChange(data, errors)}
      />
    </Box>
  );
};
