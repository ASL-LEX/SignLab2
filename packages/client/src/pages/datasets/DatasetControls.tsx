import { Accordion, AccordionDetails, AccordionSummary, Box, Container, IconButton, Typography } from '@mui/material';
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DatasetControlComponent } from '../../components/DatasetControlComponent';
import { AddDataset } from '../../components/AddDataset';
import { useState } from 'react';
import { UploadEntries } from '../../components/UploadEntries';
import { GridColDef } from '@mui/x-data-grid';

const controls = [
  { name: 'First', description: 'The description of the object' },
  { name: 'Second', description: 'Description of the second object' }
];

const rows = [
  {
    id: 1,
    view: '',
    entry: '',
    responder: '',
    access: true
  },
  {
    id: 2,
    view: '',
    entry: '',
    responder: '',
    access: true
  },
  {
    id: 3,
    view: '',
    entry: '',
    responder: '',
    access: true
  },
  {
    id: 4,
    view: '',
    entry: '',
    responder: '',
    access: false
  }
];

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 0.3 },
  {
    field: 'view',
    headerName: 'View',
    flex: 0.75,
    editable: true
  },
  {
    field: 'entry',
    headerName: 'Entry ID',
    flex: 1,
    editable: true
  },
  {
    field: 'responder',
    headerName: 'Responder ID',
    flex: 1,
    editable: true
  },
  {
    field: 'access',
    type: 'boolean',
    headerName: 'Access',
    flex: 0.75
  }
];

interface Control {
  name: string;
  description: string;
}

export const DatasetControls: React.FC = () => {
  const [add, setAdd] = useState(false);
  const [upload, setUpload] = useState(false);

  const handleClick = (type: string) => {
    if (type === 'add') {
      setAdd(true);
    } else {
      setUpload(true);
    }
  };

  const toggleAdd = () => {
    setAdd((add) => !add);
  };

  const toggleUpload = () => {
    setUpload((upload) => !upload);
  };

  return (
    <Box sx={{ position: 'absolute', top: '8%', left: '2.5%', right: '2.5%' }}>
      <h3 style={{ top: '10%', paddingBottom: '10px' }}>Dataset Controls</h3>
      <Box sx={{ display: 'flex', paddingBottom: '20px' }}>
        <Box sx={{ width: '22%', height: '10%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
          <IconButton sx={{ color: 'orange', right: '-3%' }} onClick={() => handleClick('add')}>
            <AddCircleOutlineTwoToneIcon />
          </IconButton>
          <AddDataset show={add} toggleModal={toggleAdd} />
          <Typography variant="body2" sx={{ paddingTop: '7px' }}>
            Add New Dataset
          </Typography>
        </Box>
        <Box sx={{ width: '20%', height: '10%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
          <IconButton sx={{ color: 'orange', right: '-4%' }} onClick={() => handleClick('upload')}>
            <AddCircleOutlineTwoToneIcon />
          </IconButton>
          <UploadEntries show={upload} toggleModal={toggleUpload} />
          <Typography variant="body2" sx={{ paddingTop: '7px' }}>
            Upload Entries
          </Typography>
        </Box>
      </Box>
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
      </Box>
    </Box>
  );
};
