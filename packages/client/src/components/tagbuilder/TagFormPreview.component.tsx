import { JsonForms } from '@jsonforms/react';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { useState } from 'react';
import { TagSchema } from '../../graphql/graphql';
import { materialRenderers } from '@jsonforms/material-renderers';
import AslLexSearchControl from '../tag/asllex/AslLexSearchControl';
import AslLexSearchControlTester from '../tag/asllex/aslLexSearchControlTester';

interface DialogProps {
  schema: TagSchema;
  clicked: boolean;
  toggleModal: () => void;
}

const renderers = [...materialRenderers, { tester: AslLexSearchControlTester, renderer: AslLexSearchControl }];

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
                schema={props.schema.dataSchema}
                uischema={props.schema.uiSchema}
                renderers={renderers}
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
