import { Accordion, Box, Container, Typography } from '@mui/material';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DatasetAccessComponent } from '../../components/DatasetAccessComponent';

const rows = [
  {
    id: 1,
    name: 'Project Flour',
    description:
      'Led by James Beard Award-winning pastry chef + co-owner Joanne Chang, Flour Bakery now has nine locations in Boston + Cambridge. We offer buttery breakfast pastries; soft + chewy cookies; luscious pies; gorgeous cakes; and fresh, made-to-order sandwiches, soups, and salads - all prepared daily by our dedicated team.',
    access: true
  },
  {
    id: 2,
    name: 'Project Tesla',
    description:
      'The Energy Generation and Storage segment engages in the design, manufacture, installation, sale, and leasing of solar energy generation and energy storage products, and related services to residential, commercial, and industrial customers and utilities through its website, stores, and galleries, as well as through a network of channel partners',
    access: true
  },
  {
    id: 3,
    name: 'Project Starbucks',
    description: 'The company was founded by Steven Paul Jobs, Ronald Gerald Wayne, and Stephen G. Wozniak on April 1, 1976 and is headquartered in Cupertino, CA.',
    access: true
  },
  {
    id: 4,
    name: 'Project Charles',
    description: 'Investment, wealth and alternative managers, asset owners and insurers in over 30 countries rely on Charles River IMS to manage USD $48 Trillion in assets.',
    access: false
  }
];

export const ProjectAccess: React.FC = () => {
  return (
    <Box sx={{ position: 'absolute', top: '8%', left: '2.5%', right: '2.5%' }}>
      <Typography variant="h5">Project Access</Typography>
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography sx={{ fontSize: '15px', position: 'absolute', top: '14px', left: '3%' }}>Dataset 1 name</Typography>
          <Typography sx={{ fontSize: '15px', position: 'absolute', top: '14px', right: '52%' }}>Dataset 1 description</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Container sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContext: 'space-between' }}>
            <Box sx={{ position: '-webkit-sticky' }}>
              <DatasetAccessComponent tableRows={rows} />
            </Box>
          </Container>
        </AccordionDetails>
      </Accordion>
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
          <Typography sx={{ fontSize: '15px', position: 'absolute', top: '14px', left: '3%' }}>Dataset 2 name</Typography>
          <Typography sx={{ fontSize: '15px', position: 'absolute', top: '14px', right: '52%' }}>Dataset2 description</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Container sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContext: 'space-between' }}>
            <Box sx={{ position: '-webkit-sticky' }}>
              <DatasetAccessComponent tableRows={rows} />
            </Box>
          </Container>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
