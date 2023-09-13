import { JsonFormsRendererRegistryEntry, JsonSchema, UISchemaElement } from '@jsonforms/core';
import { JsonForms } from '@jsonforms/react';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { useState } from 'react';

type TagPreviewInformation = {
  previewDataSchema: JsonSchema;
  previewUiSchema: UISchemaElement;
  renderers: JsonFormsRendererRegistryEntry[];
};
interface DialogProps {
  data: TagPreviewInformation;
  clicked: boolean;
  toggleModal: () => void;
}

export const TagFormPreviewDialog: React.FC<DialogProps> = (props: DialogProps) => {
  const [data, setData] = useState('');

  return (
    <Container>
      <Dialog open={props.clicked} onClose={props.toggleModal} maxWidth="md">
        <DialogContent>
          <Container sx={{ display: 'flex', flexDirection: 'row' }}>
            <Container sx={{ background: 'black', width: '30rem', height: '25rem', marginRight: '40px' }}>
              <Typography variant="body2" sx={{ color: ' white !important' }}>
                Your Video Will Appear Here
              </Typography>
            </Container>
            <Box sx={{ width: '200px' }}>
              <JsonForms
                data={data}
                onChange={(event) => setData(event.data)}
                schema={props.data.previewDataSchema}
                uischema={props.data.previewUiSchema}
                renderers={props.data.renderers}
              />
            </Box>
          </Container>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.toggleModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
