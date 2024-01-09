import { Box, IconButton, Typography } from '@mui/material';
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';
import { AddDataset } from '../../components/AddDataset.component';
import { useEffect, useState } from 'react';
import { UploadEntries } from '../../components/UploadEntries.component';
import { Dataset } from '../../graphql/graphql';
import { useGetDatasetsQuery } from '../../graphql/dataset/dataset';
import { DatasetsView } from '../../components/DatasetsView.component';

export const DatasetControls: React.FC = () => {
  const [add, setAdd] = useState(false);
  const [upload, setUpload] = useState(false);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const getDatasetsResults = useGetDatasetsQuery();

  useEffect(() => {
    if (getDatasetsResults.data) {
      setDatasets(getDatasetsResults.data.getDatasets);
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
      <DatasetsView datasets={datasets} />
    </>
  );
};
