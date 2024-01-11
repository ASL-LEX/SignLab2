import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { useCreateProjectMutation, useProjectExistsLazyQuery } from '../../graphql/project/project';
import { ErrorObject } from 'ajv';

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

const initialData = {
  name: '',
  description: ''
};

export const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(initialData);
  const [createProject, { error, data: createProjectResults, loading }] = useCreateProjectMutation({
    variables: { project: data }
  });
  const [projectExistsQuery, projectExistsResults] = useProjectExistsLazyQuery();
  const [additionalErrors, setAdditionalErrors] = useState<ErrorObject[]>([]);

  useEffect(() => {
    if (projectExistsResults.data?.projectExists) {
      setAdditionalErrors([
        {
          instancePath: '/name',
          keyword: 'uniqueProjectName',
          message: 'A project with this name already exists',
          schemaPath: '#/properties/name/name',
          params: { keyword: 'uniqueProjectName' }
        }
      ]);
    } else {
      setAdditionalErrors([]);
    }
  }, [projectExistsResults.data]);

  useEffect(() => {
    if (createProjectResults) {
      console.log('succesfully created');
      navigate('/successpage');
    }
  }, [createProjectResults]);

  useEffect(() => {
    if (error) {
      //handle server side error here. For now a simple text is displayed
    }
  }, [error]);

  const handleChange = (data: any, errors: ErrorObject[] | undefined) => {
    setData(data);
    if (!errors || errors.length === 0) {
      projectExistsQuery({ variables: { name: data.name } });
    }
  };

  const handleSubmit = async () => {
    createProject();
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
        onChange={({ data, errors }) => handleChange(data, errors)}
        additionalErrors={additionalErrors}
      />
      <Button variant="contained" onClick={handleSubmit} disabled={loading}>
        Submit
      </Button>
    </>
  );
};
