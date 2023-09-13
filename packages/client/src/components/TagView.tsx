import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Container } from '@mui/material';
import { useState } from 'react';

export const TagView = () => {
  const { state } = useLocation();
  console.log(state);
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
    <Container sx={{ left: '5%', width: '90%', top: '100px', position: 'absolute' }}>
      {state ? (
        <Box>
          <JsonForms schema={state.schema} uischema={state.uischema} data={initialData} renderers={materialRenderers} cells={materialCells} />
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
          <h4>No Entries Tagged</h4>
          <Button variant="outlined" onClick={() => handleClick('')}>
            Navigate home
          </Button>
        </Box>
      )}
    </Container>
  );
};
