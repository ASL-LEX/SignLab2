import { Typography, Box } from '@mui/material';
import { useStudy } from '../../context/Study.context';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { GridActionsCellItem } from '@mui/x-data-grid-pro';
import { Study } from '../../graphql/graphql';
import { useDeleteStudyMutation } from '../../graphql/study/study';
import { useEffect } from 'react';
import { useConfirmation } from '../../context/Confirmation.context';

export const StudyControl: React.FC = () => {
  const { studies, updateStudies } = useStudy();

  const [deleteStudyMutation, deleteStudyResults] = useDeleteStudyMutation();
  const confirmation = useConfirmation();

  const handleDelete = async (id: GridRowId) => {
    // Execute delete mutation
    confirmation.pushConfirmationRequest({
      title: 'Delete Study',
      message: 'Are you sure you want to delete this study? Doing so will delete all contained tags',
      onConfirm: () => {
        deleteStudyMutation({ variables: { study: id.toString() } });
      },
      onCancel: () => {}
    });
  };

  // TODO: Add error message
  useEffect(() => {
    if (deleteStudyResults.called && deleteStudyResults.data) {
      updateStudies();
    }
  }, [deleteStudyResults.called, deleteStudyResults.data]);

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      editable: false
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 500,
      editable: false
    },
    {
      field: 'delete',
      type: 'actions',
      headerName: 'Delete',
      width: 120,
      maxWidth: 120,
      cellClassName: 'delete',
      getActions: (params) => {
        return [<GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDelete(params.id)} />];
      }
    }
  ];

  return (
    <>
      <Typography variant="h3">Study Control</Typography>
      <Box sx={{ maxWidth: '1000px', margin: 'auto' }}>
        <DataGrid rows={studies || []} columns={columns} getRowId={(row: Study) => row._id} />
      </Box>
    </>
  );
};
