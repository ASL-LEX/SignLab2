import { Typography, Box, Stack, Button } from '@mui/material';
import placeholder from './placeholder.png';
import { useNavigate } from 'react-router-dom';

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      default: 'foo'
    },
    name_noDefault: {
      type: 'string'
    },
    description: {
      type: 'string',
      default: 'bar'
    },
    done: {
      type: 'boolean',
      default: false
    },
    rating: {
      type: 'integer',
      default: 5
    },
    cost: {
      type: 'number',
      default: 5.5
    },
    dueDate: {
      type: 'string',
      format: 'date',
      default: '2019-04-01'
    }
  },
  required: ['name', 'name_noDefault']
};

const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/name'
    },
    {
      type: 'Control',
      scope: '#/properties/name_noDefault'
    },
    {
      type: 'Control',
      label: false,
      scope: '#/properties/done'
    },
    {
      type: 'Control',
      scope: '#/properties/description',
      options: {
        multi: true
      }
    },
    {
      type: 'Control',
      scope: '#/properties/rating'
    },
    {
      type: 'Control',
      scope: '#/properties/cost'
    },
    {
      type: 'Control',
      scope: '#/properties/dueDate'
    }
  ]
};

export const ContributePage: React.FC = () => {
  const initialData = {
    image: placeholder,
    name: 'Study 12',
    description: 'This study focuses on the verb conjugation',
    instructions: 'Analyze common verb conjugations and recognize a pattern',
    complete: false
  };
  const navigate = useNavigate();

  const handleSubmit = () => {
    //submit logic
    //redirect to next page
    navigate('/tagging', { state: { schema: schema, uischema: uischema } });
  };

  return (
    <Box>
      <Typography variant="h2">Study: {initialData.name}</Typography>
      <Box sx={{ justifyContent: 'center' }}>
        <Stack spacing={3} direction="column" sx={{ width: '30%' }}>
          <Typography variant="h3">{initialData.complete ? 'Study Training' : 'Study Tagging'}</Typography>
          <Typography variant="body2">Study: {initialData.name}</Typography>
          <Typography variant="body2">Description: {initialData.description}</Typography>
          <Typography variant="body2">Instructions: {initialData.instructions}</Typography>
          {initialData.complete ? (
            <Typography variant="body2">
              Training Complete! Reach out to your study administrator to get access to tagging
            </Typography>
          ) : (
            <Button variant="outlined" onClick={handleSubmit} sx={{ width: '100px' }}>
              Enter tagging
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
};
