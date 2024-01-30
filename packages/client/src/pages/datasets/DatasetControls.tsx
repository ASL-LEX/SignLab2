import { Box, IconButton, Typography } from '@mui/material';
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';
import { AddDataset } from '../../components/AddDataset.component';
import { useEffect, useState } from 'react';
import { UploadEntries } from '../../components/UploadEntries.component';
import { Dataset } from '../../graphql/graphql';
import { useGetDatasetsLazyQuery } from '../../graphql/dataset/dataset';
import { DatasetsView } from '../../components/DatasetsView.component';
import { GridColDef, GridActionsCellItem, GridRowId } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { useConfirmation } from '../../context/Confirmation.context';
import { useDeleteEntryMutation } from '../../graphql/entry/entry';

export const DatasetControls: React.FC = () => {
  const [add, setAdd] = useState(false);
  const [upload, setUpload] = useState(false);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [getDatasets, getDatasetsResults] = useGetDatasetsLazyQuery();
  const [deleteEntryMutation] = useDeleteEntryMutation();

  const confirmation = useConfirmation();

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

  const handleDelete = async (id: GridRowId) => {
    // Execute delete mutation
    confirmation.pushConfirmationRequest({
      title: 'Delete Entry',
      message: 'Are you sure you want to delete this project? Doing so will delete all associated tags',
      onConfirm: async () => {
        const res = await deleteEntryMutation({ variables: { entry: id.toString() } });
        if (res.errors) {
          //TODO show error with snackbar
        } else if (res.data) {
          // force rerender
          setDatasets([...datasets, {} as Dataset]);
        }
      },
      onCancel: () => {}
    });
  };

  const additionalColumns: GridColDef[] = [
    {
      field: 'delete',
      type: 'actions',
      headerName: 'Delete',
      width: 120,
      maxWidth: 120,
      cellClassName: 'delete',
      getActions: (params) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon color={'error'} />}
            label="Delete"
            onClick={() => handleDelete(params.id)}
          />
        ];
      }
    }
  ];

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
      <DatasetsView datasets={datasets} additionalColumns={additionalColumns} />
    </>
  );
};
