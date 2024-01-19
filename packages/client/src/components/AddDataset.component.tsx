import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { useCreateDatasetMutation, useDatasetExistsLazyQuery } from '../graphql/dataset/dataset';
import { Button } from '@mui/material';
import { ErrorObject } from 'ajv';

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
    }
  ]
};

export const AddDataset: React.FC<ShowProps> = (props: ShowProps) => {
  const [error, setError] = useState(true);
  const [additionalErrors, setAdditionalErrors] = useState<ErrorObject[]>([]);
  const [datasetExistsQuery, datasetExistsResults] = useDatasetExistsLazyQuery();

  const initialData = {} as { name: string; description: string };

  const [data, setData] = useState(initialData);
  const [createDataset, { data: createDatasetResults, loading }] = useCreateDatasetMutation();

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

  useEffect(() => {
    if (createDatasetResults?.createDataset) {
      props.toggleModal(true);
    }
    //TODO handle creation server error with snackbar
  }, [createDatasetResults]);

  const handleChange = (data: any, errors: ErrorObject[] | undefined) => {
    console.log('data', data);
    setData(data);
    if (!errors || errors.length === 0) {
      datasetExistsQuery({ variables: { name: data.name } });
      console.log('setting error to false');
      setError(false);
    } else {
      setError(true);
    }
  };

  const onCreate = () => {
    createDataset({ variables: { dataset: data } });
  };

  return (
    <div>
      <Dialog open={props.show} onClose={props.toggleModal}>
        <DialogTitle>Create New Dataset</DialogTitle>
        <DialogContent>
          <JsonForms
            schema={schema}
            uischema={uischema}
            data={data}
            renderers={materialRenderers}
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
            disabled={loading || error || datasetExistsResults.data?.datasetExists}
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
