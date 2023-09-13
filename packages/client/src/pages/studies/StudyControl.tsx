import { Box, Container } from '@mui/material';
import { ControlComponent } from '../../components/ControlComponent';

// currently hardcoded values, but eventully
// there will be a fetching function that retrieves project information
const rows = [
  {
    id: 1,
    name: 'Study Microsoft',
    description: ' It is considered one of the Big Five American information technology companies, alongside Alphabet, Amazon, Apple, and Meta Platforms.'
  },
  { id: 2, name: 'Study IBM', description: 'You can define the prefix for generated group names and the owner/superior group in step 1 of the ISFACR security migration process.' },
  {
    id: 3,
    name: 'Study APPLe',
    description: 'The company was founded by Steven Paul Jobs, Ronald Gerald Wayne, and Stephen G. Wozniak on April 1, 1976 and is headquartered in Cupertino, CA.'
  },
  { id: 4, name: 'Study SpaceX', description: 'Falcon 9’s first stage has landed on the Just Read the Instructions droneship' },
  { id: 5, name: 'Study Citadel', description: '5 Description of the object' },
  {
    id: 6,
    name: 'Study Alphabet & Co',
    description:
      'But as of December, Page and cofounder Sergey Brin have stepped down from Alphabet altogether, making way for Google CEO Sundar Pichai to take the reins of the whole company. (Page and Brin are remaining on as board members and still hold controlling shares.)'
  },
  { id: 7, name: 'Study Pavement', description: '7 Description of the object' },
  {
    id: 8,
    name: 'Study Blank Street',
    description:
      'The cappuccino (small, $3.75) is inoffensive. At every location, they’re made on identically programmed machines for consistency. I prefer a little more foam but what’s there is nice and velvety enough, if a little less compact than ideal, and it’s all fairly within the proportions of a cappuccino.'
  },
  {
    id: 9,
    name: 'Study Tatte',
    description:
      'The second floor features a beautiful coffee bar and event space with plenty of seats to take a baking class, enjoy nitro cold brew or coffee, enjoy breakfast or lunch with a friend or get work and homework done.'
  }
];

export const StudyControl: React.FC = () => {
  return (
    <Container sx={{ position: 'absolute', top: '75px', left: '1%', right: '1%' }}>
      <Container sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContext: 'space-between' }}>
        <h3 style={{ top: '10%', paddingBottom: '10px' }}>Study Control</h3>
        <Box sx={{ position: '-webkit-sticky' }}>
          <ControlComponent tableRows={rows} />
        </Box>
      </Container>
    </Container>
  );
};
