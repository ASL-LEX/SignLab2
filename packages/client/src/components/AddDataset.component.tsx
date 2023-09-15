import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';

interface ShowProps {
  show: boolean;
  toggleModal: () => void;
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
  const initialData = {
    name: '',
    description: ''
  };

  const [data, setData] = useState(initialData);

  const handleChange = (data: any) => {
    setData(data);
    if (data.name.length > 1 && data.description.length > 1) {
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div>
      <Dialog open={props.show} onClose={props.toggleModal}>
        <DialogTitle>Create New Dataset</DialogTitle>
        <DialogContent>
          <JsonForms schema={schema} uischema={uischema} data={data} renderers={materialRenderers} cells={materialCells} onChange={({ data }) => handleChange(data)} />
        </DialogContent>
        <DialogActions>
          <button onClick={props.toggleModal} type="submit">
            Cancel
          </button>
          <button disabled={error} onClick={props.toggleModal} type="submit">
            Create
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
