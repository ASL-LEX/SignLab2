import { JsonForms } from '@jsonforms/react';
import { Study } from '../../graphql/graphql';
import { materialRenderers } from '@jsonforms/material-renderers';
import { SetStateAction, useState, Dispatch } from 'react';
import { Box, Stack, Button } from '@mui/material';
import { ErrorObject } from 'ajv';

export interface TagFormProps {
  study: Study;
  setTagData: Dispatch<SetStateAction<any>>;
}

export const TagForm: React.FC<TagFormProps> = (props) => {
  const [data, setData] = useState<any>({});
  const [dataValid, setDataValid] = useState<boolean>(false);

  const handleFormChange = (data: any, errors: ErrorObject[] | undefined) => {
    setData(data);

    // No errors, data could be submitted
    if (!errors || errors.length === 0) {
      setDataValid(true);
    } else {
      setDataValid(false);
    }
  };

  const handleSubmit = () => {
    // Ideally should not get here
    if (!dataValid) {
      return;
    }
    props.setTagData(data);

    // Get ready for the next tag
    handleClear();
  };

  const handleClear = () => {
    setData({});
  };

  return (
    <Box sx={{ maxWidth: 500 }}>
      <Stack direction="column" spacing={2}>
        <JsonForms
          schema={props.study.tagSchema.dataSchema}
          uischema={props.study.tagSchema.uiSchema}
          data={data}
          onChange={({ data, errors }) => handleFormChange(data, errors)}
          renderers={materialRenderers}
        />
        <Stack direction="row">
          <Button variant="outlined" onClick={handleSubmit} disabled={!dataValid}>
            Submit
          </Button>
          <Button variant="outlined" onClick={handleClear}>
            Clear
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
