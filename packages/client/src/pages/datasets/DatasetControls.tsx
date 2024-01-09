import { Accordion, AccordionDetails, AccordionSummary, Box, Container, IconButton, Typography } from '@mui/material';
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DatasetTable } from '../../components/DatasetTable.component';
import { AddDataset } from '../../components/AddDataset.component';
import { useEffect, useState } from 'react';
import { UploadEntries } from '../../components/UploadEntries.component';
import { Dataset } from '../../graphql/graphql';
import { useGetDatasetsQuery } from '../../graphql/dataset/dataset';

export const DatasetControls: React.FC = () => {
  const [add, setAdd] = useState(false);
  const [upload, setUpload] = useState(false);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const getDatasetsResults = useGetDatasetsQuery();

  useEffect(() => {
    if (getDatasetsResults.data) {
      setDatasets(getDatasetsResults.data.getDatasets);
      console.log(getDatasetsResults.data.getDatasets);
    }
  }, [getDatasetsResults.data]);

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

  // TODO: Implement lazy loading on accordion open to prevent loading all datasets at once
  return (
    <>
      <Typography variant="h3">Dataset Controls</Typography>
      <Box sx={{ display: 'flex', paddingBottom: '20px' }}>
        <Box
          sx={{ width: '22%', height: '10%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}
        >
          <IconButton sx={{ color: 'orange', right: '-3%' }} onClick={() => handleClick('add')}>
            <AddCircleOutlineTwoToneIcon />
          </IconButton>
          <AddDataset show={add} toggleModal={toggleAdd} />
          <Typography variant="body2" sx={{ paddingTop: '7px' }}>
            Add New Dataset
          </Typography>
        </Box>
        <Box
          sx={{ width: '20%', height: '10%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}
        >
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
        {datasets.map((dataset: Dataset) => (
          <Accordion key={dataset._id} disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography sx={{ fontWeight: 'normal', position: 'absolute', top: '14px', left: '3%' }}>
                {dataset.name}
              </Typography>
              <Typography sx={{ fontWeight: 'normal', position: 'absolute', top: '14px', left: '20%' }}>
                {dataset.description}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <DatasetTable dataset={dataset} />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </>
  );
};
