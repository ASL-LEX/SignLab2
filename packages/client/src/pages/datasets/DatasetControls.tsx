import { Box, IconButton, Typography } from '@mui/material';
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';
import { AddDataset } from '../../components/AddDataset.component';
import { useEffect, useState } from 'react';
import { UploadEntries } from '../../components/UploadEntries.component';
import { Dataset } from '../../graphql/graphql';
import { useGetDatasetsByProjectLazyQuery, useGetDatasetsLazyQuery } from '../../graphql/dataset/dataset';
import { DatasetsView } from '../../components/DatasetsView.component';
import { useTranslation } from 'react-i18next';
import { usePermission } from '../../context/Permission.context';
import { useProject } from '../../context/Project.context';

export const DatasetControls: React.FC = () => {
  const [add, setAdd] = useState(false);
  const [upload, setUpload] = useState(false);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [getAllDatasets, getAllDatasetsResults] = useGetDatasetsLazyQuery();
  const [getProjectDatasets, getProjectDatasetsResults] = useGetDatasetsByProjectLazyQuery();
  const { project } = useProject();
  const { t } = useTranslation();
  const { permission } = usePermission();

  const fetchDatasets = () => {
    if (permission?.owner) {
      getAllDatasets({ fetchPolicy: 'network-only' });
    } else if (permission?.projectAdmin && project) {
      getProjectDatasets({ variables: { project: project._id } });
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, [permission]);

  useEffect(() => {
    if (getAllDatasetsResults.data) {
      setDatasets(getAllDatasetsResults.data.getDatasets);
    } else if (getProjectDatasetsResults.data) {
      setDatasets(getProjectDatasetsResults.data.getDatasetsByProject);
    }
  }, [getAllDatasetsResults.data, getProjectDatasetsResults.data]);

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
      fetchDatasets();
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
