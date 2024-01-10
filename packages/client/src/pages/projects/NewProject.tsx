import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { useApolloClient } from '@apollo/client';
import { CreateProjectDocument } from '../../graphql/project/project';

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
  const apolloClient = useApolloClient();

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
  const handleSubmit = async (event: { preventDefault: () => void }) => {
    if (error) {
      setError(true);
      event.preventDefault();
      return;
    } else {
      const result = await apolloClient.mutate({
        mutation: CreateProjectDocument,
        variables: { project: data }
      });

      if (result.errors || !result.data) {
        console.error('Failed to create study');
        setError(true);
        return;
      }
      //redirect to next page
      setError(false);
      navigate('/successpage');
    }
  };

  return (
    <>
      {error && (
        <Typography color={'red'} variant="h6">
          Failed to create project! Try again.
        </Typography>
      )}
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={data}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ data }) => handleChange(data)}
      />
      <Button variant="contained" onClick={handleSubmit}>
        Submit
      </Button>
    </>
  );
};
