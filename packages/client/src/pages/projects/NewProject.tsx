import { useNavigate } from 'react-router-dom';
import { Button, Container } from '@mui/material';
import { useState } from 'react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: '^[a-zA-Z 0-9]*$',
      description: 'Please enter project name'
    },
    description: {
      type: 'string',
      description: 'Please enter project description'
    }
  },
  required: ['name', 'description'],
  errorMessage: {
    type: 'data should be an object',
    properties: { name: 'Project name should be ...' },
    _: 'data should ...'
  }
};

const uischema = {
  type: 'Group',
  label: 'Create New Project',
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
    }
  ]
};

export const NewProject: React.FC = () => {
  const [error, setError] = useState(true);
  const navigate = useNavigate();

  const initialData = {
    name: '',
    description: ''
  };

  const [data, setData] = useState(initialData);

  const handleChange = (data: any) => {
    setData(data);
    if (data) {
      setError(false);
    }
  };
  const handleSubmit = (event: { preventDefault: () => void }) => {
    if (error) {
      setError(true);
      event.preventDefault();
      return;
    } else {
      //submit logic
      //redirect to next page
      setError(false);
      navigate('/successpage');
    }
  };

  return (
    <Container sx={{ left: '2%', width: '96%', top: '100px', position: 'absolute' }}>
      <JsonForms schema={schema} uischema={uischema} data={data} renderers={materialRenderers} cells={materialCells} onChange={({ data }) => handleChange(data)} />
      <Button disabled={error} sx={{ marginTop: '35px', position: 'absolute', right: '5%' }} variant="contained" onClick={handleSubmit}>
        Submit
      </Button>
    </Container>
  );
};
