import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
import { useProject } from '../../context/Project.context';
import { GridActionsCellItem } from '@mui/x-data-grid-pro';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Project } from '../../graphql/graphql';
import { useDeleteProjectMutation } from '../../graphql/project/project';
import { useConfirmation } from '../../context/Confirmation.context';
import { useEffect } from 'react';

const EntryControl: React.FC = () => {
  const { projects, updateProjectList } = useProject();

  const [deleteProjectMutation, deleteProjectResults] = useDeleteProjectMutation();
  const confirmation = useConfirmation();

  const handleDelete = async (id: GridRowId) => {
    // Execute delete mutation
    confirmation.pushConfirmationRequest({
      title: 'Delete Study',
      message: 'Are you sure you want to delete this project? Doing so will delete all contained studies and tags',
      onConfirm: () => {
        deleteProjectMutation({ variables: { project: id.toString() } });
      },
      onCancel: () => {}
    });
  };

  // TODO: Add error message
  useEffect(() => {
    if (deleteProjectResults.called && deleteProjectResults.data) {
      updateProjectList();
    }
  }, [deleteProjectResults.data, deleteProjectResults.called]);

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
      <Typography variant="h3">Project Control</Typography>
      <Box sx={{ maxWidth: '1000px', margin: 'auto' }}>
        <DataGrid rows={projects || []} columns={columns} getRowId={(row: Project) => row._id} />
      </Box>
    </>
  );
};

export { EntryControl as ProjectControl };
