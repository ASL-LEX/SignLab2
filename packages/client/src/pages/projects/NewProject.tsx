import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { useCreateProjectMutation, useProjectExistsLazyQuery } from '../../graphql/project/project';
import { ErrorObject } from 'ajv';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../../context/Snackbar.context';
import { useProject } from '../../context/Project.context';
import { ProjectCreate } from '../../graphql/graphql';


export const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ProjectCreate>({} as any);
  const [createProject, { error, data: createProjectResults, loading }] = useCreateProjectMutation({
    variables: { project: data }
  });
  const [projectExistsQuery, projectExistsResults] = useProjectExistsLazyQuery();
  const [additionalErrors, setAdditionalErrors] = useState<ErrorObject[]>([]);
  const { t } = useTranslation();
  const { pushSnackbarMessage } = useSnackbar();
  const { updateProjectList } = useProject();
  const [valid, setValid] = useState<boolean>(false);

  const schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z 0-9]*$',
        description: t('components.newProject.nameDescription')
      },
      description: {
        type: 'string',
        description: t('components.newProject.descriptionDescription')
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
    label: t('components.newProject.formLabel'),
    elements: [
      {
        type: 'Control',
        label: t('common.name'),
        scope: '#/properties/name'
      },
      {
        type: 'Control',
        label: t('common.description'),
        scope: '#/properties/description'
      }
    ]
  };

  useEffect(() => {
    if (projectExistsResults.data?.projectExists) {
      setAdditionalErrors([
        {
          instancePath: '/name',
          keyword: 'uniqueProjectName',
          message: t('components.newProject.projectExists'),
          schemaPath: '#/properties/name/name',
          params: { keyword: 'uniqueProjectName' }
        }
      ]);
      setValid(false);
    } else {
      setAdditionalErrors([]);
      setValid(true);
    }
  }, [projectExistsResults.data]);

  useEffect(() => {
    if (createProjectResults) {
      updateProjectList();
      navigate('/successpage');
    }
  }, [createProjectResults]);

  useEffect(() => {
    if (error) {
      pushSnackbarMessage(t('errors.projectCreate'), 'error');
      console.error(error);
      setValid(false);
    }
  }, [error]);

  const handleChange = (data: any, errors: ErrorObject[] | undefined) => {
    setData(data);
    if (!errors || errors.length === 0) {
      projectExistsQuery({ variables: { name: data.name } });
    } else {
      setValid(false);
    }
  };

  const handleSubmit = async () => {
    createProject();
  };

  return (
    <>
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={data}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ data, errors }) => handleChange(data, errors)}
        additionalErrors={additionalErrors}
      />
      <Button variant="contained" onClick={handleSubmit} disabled={loading || !valid}>
        {t('common.submit')}
      </Button>
    </>
  );
};
