import { Box, IconButton, Typography } from '@mui/material';
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';
import { AddDataset } from '../../components/AddDataset.component';
import { useEffect, useState } from 'react';
import { UploadEntries } from '../../components/UploadEntries.component';
import { Dataset } from '../../graphql/graphql';
import { useGetDatasetsLazyQuery } from '../../graphql/dataset/dataset';
import { DatasetsView } from '../../components/DatasetsView.component';
import { useTranslation } from 'react-i18next';

export const DatasetControls: React.FC = () => {
  const [add, setAdd] = useState(false);
  const [upload, setUpload] = useState(false);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [getDatasets, getDatasetsResults] = useGetDatasetsLazyQuery();
  const { t } = useTranslation();

  useEffect(() => {
    getDatasets();
  }, []);

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

  const toggleAdd = (newDatasetCreated: boolean) => {
    setAdd((add) => !add);
    if (newDatasetCreated) {
      getDatasets({ fetchPolicy: 'network-only' });
    }
  };

  const toggleUpload = () => {
    setUpload((upload) => !upload);
  };

  return (
    <>
      <Typography variant="h3">{t('menu.datasetControl')}</Typography>
      <Box sx={{ display: 'flex', paddingBottom: '20px' }}>
        <Box
          sx={{ width: '22%', height: '10%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}
        >
          <IconButton sx={{ color: 'orange', right: '-3%' }} onClick={() => handleClick('add')}>
            <AddCircleOutlineTwoToneIcon />
          </IconButton>
          <AddDataset show={add} toggleModal={toggleAdd} />
          <Typography variant="body2" sx={{ paddingTop: '7px' }}>
            {t('components.datasetControl.addDataset')}
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
            {t('components.datasetControl.uploadEntries')}
          </Typography>
        </Box>
      </Box>
      <DatasetsView datasets={datasets} supportEntryDelete={true} />
    </>
  );
};
