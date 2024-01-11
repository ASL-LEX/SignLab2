import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Stack } from '@mui/material';
import { useState } from 'react';
import { useStudy } from '../../context/Study.context';

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
    <>
      {study ? (
        <Stack direction='column'>
          <JsonForms
            schema={study.tagSchema.dataSchema}
            uischema={study.tagSchema.uiSchema}
            data={initialData}
            renderers={materialRenderers}
            cells={materialCells}
          />
          <Stack direction='row' spacing={2}>
            <Button variant="outlined" onClick={handleNext}>
              Next
            </Button>
            <Button variant="outlined" onClick={() => handleClick('contribute')}>
              Exit Tagging
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Box>
          <Typography variant="h4">No Entries Tagged</Typography>
          <Button variant="outlined" onClick={() => handleClick('')}>
            Navigate home
          </Button>
        </Box>
      )}
    </>
  );
};
