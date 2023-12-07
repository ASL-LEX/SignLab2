import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useProject } from '../../context/Project.context';
import { GridActionsCellItem } from '@mui/x-data-grid-pro';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Project } from '../../graphql/graphql';


const ProjectControl: React.FC = () => {
  const { projects } = useProject();

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
      getActions: () => {
        return [<GridActionsCellItem icon={<DeleteIcon />} label="Delete" />];
      }
    }
  ];

  // Make sure the lines between rows are visible
  const rowStyle = {
    borderBottom: '1px solid rgba(224, 224, 224, 1)'
  };

  return (
    <>
      <Typography variant='h3'>Project Control</Typography>
      <Box sx={{ maxWidth: '1000px', margin: 'auto' }}>
        <DataGrid
          rows={projects || []}
          columns={columns}
          getRowId={(row: Project) => row._id}
        />
      </Box>
    </>
  );
};

export { ProjectControl };
