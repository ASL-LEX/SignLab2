import { Box, Container } from '@mui/material';
import { ControlComponent } from '../../components/ControlComponent';

// currently hardcoded values, but eventully
// there will be a fetching function that retrieves project information
const rows = [
  {
    id: 1,
    name: 'Project Flour',
    description:
      'Led by James Beard Award-winning pastry chef + co-owner Joanne Chang, Flour Bakery now has nine locations in Boston + Cambridge. We offer buttery breakfast pastries; soft + chewy cookies; luscious pies; gorgeous cakes; and fresh, made-to-order sandwiches, soups, and salads - all prepared daily by our dedicated team.'
  },
  {
    id: 2,
    name: 'Project Tesla',
    description:
      'The Energy Generation and Storage segment engages in the design, manufacture, installation, sale, and leasing of solar energy generation and energy storage products, and related services to residential, commercial, and industrial customers and utilities through its website, stores, and galleries, as well as through a network of channel partners'
  },
  {
    id: 3,
    name: 'Project Starbucks',
    description: 'The company was founded by Steven Paul Jobs, Ronald Gerald Wayne, and Stephen G. Wozniak on April 1, 1976 and is headquartered in Cupertino, CA.'
  },
  {
    id: 4,
    name: 'Project Charles',
    description: 'Investment, wealth and alternative managers, asset owners and insurers in over 30 countries rely on Charles River IMS to manage USD $48 Trillion in assets.'
  }
];

const ProjectControl: React.FC = () => {
  return (
    <Container sx={{ position: 'absolute', top: '75px', left: '1%', right: '1%' }}>
      <Container sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContext: 'space-between' }}>
        <h3 style={{ top: '10%', paddingBottom: '10px' }}>Project Control</h3>
        <Box>
          <ControlComponent tableRows={rows} />
        </Box>
      </Container>
    </Container>
  );
};

export { ProjectControl };
