import { Box, Accordion, AccordionSummary, Typography, AccordionDetails, Container } from '@mui/material';
import { DatasetControlComponent } from './DatasetControlComponent';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { GridColDef } from '@mui/x-data-grid';

interface Control {
  name: string;
  description: string;
}

const rows = [
  {
    id: 1,
    view: '12',
    entry: '41',
    responder: '0',
    partOf: true,
    available: true
  },
  {
    id: 2,
    view: '5',
    entry: '9',
    responder: '0',
    partOf: true,
    available: true
  },
  {
    id: 3,
    view: '11',
    entry: '9',
    responder: '2',
    partOf: true,
    available: true
  },
  {
    id: 4,
    view: '0',
    entry: '10',
    responder: '5',
    partOf: true,
    available: true
  }
];

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 0.2 },
  {
    field: 'view',
    headerName: 'View',
    flex: 0.3,
    editable: true
  },
  {
    field: 'entry',
    headerName: 'Entry ID',
    flex: 0.3,
    editable: true
  },
  {
    field: 'responder',
    headerName: 'Responder ID',
    flex: 0.5,
    editable: true
  },
  {
    field: 'partOf',
    headerName: 'Is Part of Training Set',
    flex: 0.75,
    editable: true
  },
  {
    field: 'available',
    headerName: 'Available for Tagging',
    flex: 0.75,
    editable: true
  }
];

export const TagTrainingComponent = () => {
  const controls = [
    { name: 'First', description: 'The description of the object' },
    { name: 'Second', description: 'Description of the second object' }
  ];
  return (
    <Box sx={{ width: '100%' }}>
      {controls.map((item: Control) => (
        <Accordion key={item.name} disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography sx={{ fontWeight: 'normal', position: 'absolute', top: '14px', left: '3%' }}>{item.name}</Typography>
            <Typography sx={{ fontWeight: 'normal', position: 'absolute', top: '14px', left: '20%' }}>{item.description}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Container sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContext: 'space-between' }}>
              <Box sx={{ position: '-webkit-sticky' }}>
                <DatasetControlComponent tableRows={rows} columns={columns} />
              </Box>
            </Container>
          </AccordionDetails>
        </Accordion>
      ))}
      <br />
    </Box>
  );
};
