import { Typography, Box } from '@mui/material';
import { useStudy } from '../../context/Study.context';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { GridActionsCellItem } from '@mui/x-data-grid-pro';
import { Study } from '../../graphql/graphql';


export const StudyControl: React.FC = () => {
  const { studies } = useStudy();
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

  return (
    <>
      <Typography variant='h3'>Study Control</Typography>
      <Box sx={{ maxWidth: '1000px', margin: 'auto' }}>
        <DataGrid
          rows={studies || []}
          columns={columns}
          getRowId={(row: Study) => row._id}
        />
      </Box>
    </>
  );
};
