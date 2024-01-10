import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import { useState } from 'react';
import { useStudy } from '../context/Study.context';

export const TagView = () => {
  const { study } = useStudy();

  const [initialData, setData] = useState({
    name: '',
    name_noDefault: '',
    description: '',
    done: true,
    rating: 0,
    cost: 3.14,
    dueDate: '2019-05-01'
  });

  const navigate = useNavigate();

  const handleNext = () => {
    //first save tagged data by sending it to backend
    //then tag the next entry

    setData({ name: '', name_noDefault: '', description: '', done: false, rating: 0, cost: 0, dueDate: '2023-07-24' });
  };

  const handleClick = (route: string) => {
    navigate('/' + route);
  };

  return (
    <Container>
      {study ? (
        <Box>
          <JsonForms
            schema={study.tagSchema.dataSchema}
            uischema={study.tagSchema.uiSchema}
            data={initialData}
            renderers={materialRenderers}
            cells={materialCells}
          />
          <Box sx={{ height: '50px', padding: '30px' }}>
            <Button variant="outlined" sx={{ margin: '10px' }}>
              Back
            </Button>
            <Button variant="outlined" sx={{ margin: '10px' }} onClick={handleNext}>
              Next
            </Button>
          </Box>
          <Button variant="outlined" sx={{ marginTop: '35px' }} onClick={() => handleClick('contribute')}>
            Exit Tagging
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography variant="h4">No Entries Tagged</Typography>
          <Button variant="outlined" onClick={() => handleClick('')}>
            Navigate home
          </Button>
        </Box>
      )}
    </Container>
  );
};
