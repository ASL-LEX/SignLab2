import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import {
  CreateDatasetDocument,
  CreateDatasetMutation,
  CreateDatasetMutationVariables,
  useDatasetExistsLazyQuery
} from '../graphql/dataset/dataset';
import { Button } from '@mui/material';
import { ErrorObject } from 'ajv';
import { useSnackbar } from '../context/Snackbar.context';
import { useTranslation } from 'react-i18next';
import { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import ProjectListSelect, { projectListTester } from './ProjectListSelect.component';
import { useApolloClient } from '@apollo/client';
import {
  GrantProjectDatasetAccessDocument,
  GrantProjectDatasetAccessMutation,
  GrantProjectDatasetAccessMutationVariables
} from '../graphql/permission/permission';
import { useDataset } from '../context/Dataset.context';

interface ShowProps {
  show: boolean;
  toggleModal: (newDatasetCreated: boolean) => void;
}

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Please enter new dataset name'
    },
    description: {
      type: 'string',
      description: 'Please enter new dataset description'
    },
    projects: {
      description: 'Select project that will have access to the dataset',
      label: 'Project Access',
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },
  required: ['name', 'description']
};

const uischema = {
  type: 'Group',
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
      label: 'Projects with Access',
      scope: '#/properties/projects',
      options: {
        customType: 'projectList'
      }
    }
  ]
};

export const AddDataset: React.FC<ShowProps> = (props: ShowProps) => {
  const [error, setError] = useState(true);
  const [additionalErrors, setAdditionalErrors] = useState<ErrorObject[]>([]);
  const [datasetExistsQuery, datasetExistsResults] = useDatasetExistsLazyQuery();
  const { refetch: refetchDatasets } = useDataset();

  const initialData = {} as { name: string; description: string; projects: string[] };

  const [data, setData] = useState(initialData);

  const { t } = useTranslation();
  const { pushSnackbarMessage } = useSnackbar();

  const client = useApolloClient();

  useEffect(() => {
    if (datasetExistsResults.data?.datasetExists) {
      setAdditionalErrors([
        {
          instancePath: '/name',
          keyword: 'uniqueProjectName',
          message: 'A dataset with this name already exists',
          schemaPath: '#/properties/name/name',
          params: { keyword: 'uniqueProjectName' }
        }
      ]);
    } else {
      setAdditionalErrors([]);
    }
  }, [datasetExistsResults.data]);

  const handleChange = (data: any, errors: ErrorObject[] | undefined) => {
    setData(data);
    if (!errors || errors.length === 0) {
      datasetExistsQuery({ variables: { name: data.name } });
      setError(false);
    } else {
      setError(true);
    }
  };

  const onCreate = async () => {
    const datasetCreateResult = await client.mutate<CreateDatasetMutation, CreateDatasetMutationVariables>({
      mutation: CreateDatasetDocument,
      variables: { dataset: { name: data.name, description: data.description } }
    });

    // If the dataset failed to be created, stop
    if (datasetCreateResult.errors || !datasetCreateResult.data) {
      console.error(datasetCreateResult.errors);
      pushSnackbarMessage(t('errors.datasetCreate'), 'error');
      return;
    }

    refetchDatasets();

    // Now grant each project selected access to the dataset
    const datasetID = datasetCreateResult.data.createDataset._id;
    for (const projectID of data.projects) {
      await client.mutate<GrantProjectDatasetAccessMutation, GrantProjectDatasetAccessMutationVariables>({
        mutation: GrantProjectDatasetAccessDocument,
        variables: { project: projectID, dataset: datasetID, hasAccess: true }
      });
    }

    // Finally toggle the model
    props.toggleModal(true);
  };

  const renderers: JsonFormsRendererRegistryEntry[] = [
    ...materialRenderers,
    { tester: projectListTester, renderer: ProjectListSelect }
  ];

  return (
    <div>
      <Dialog open={props.show} onClose={props.toggleModal}>
        <DialogTitle>Create New Dataset</DialogTitle>
        <DialogContent>
          <JsonForms
            schema={schema}
            uischema={uischema}
            data={data}
            renderers={renderers}
            cells={materialCells}
            onChange={({ data, errors }) => handleChange(data, errors)}
            additionalErrors={additionalErrors}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.toggleModal(false)} type="submit">
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={error || datasetExistsResults.data?.datasetExists}
            onClick={onCreate}
            type="submit"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
