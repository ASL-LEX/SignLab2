import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { GridRowModesModel, GridActionsCellItem, GridRowId } from '@mui/x-data-grid-pro';
import { useState } from 'react';

interface Row {
  id: number;
  name: string;
  description: string;
}

interface Table {
  tableRows: Row[];
}

export const ControlComponent: React.FC<Table> = ({ tableRows }: Table) => {
  const [rows, setRows] = useState(tableRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row: any) => row.id !== id));
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 55 },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      editable: true
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 575,
      editable: true
    },
    {
      field: 'delete',
      type: 'actions',
      headerName: 'Delete',
      width: 120,
      cellClassName: 'delete',
      getActions: ({ id }) => {
        return [<GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={handleDeleteClick(id)} />];
      }
    }
  ];

  return (
    <Box sx={{ height: 800, width: '100%' }}>
      <DataGrid
        sx={{
          '& .MuiDataGrid-cell': {
            whiteSpce: 'initial !important',
            lineHeight: '16px !important',
            paddingTop: '10px !important',
            paddingBottom: '10px !important'
          }
        }}
        getRowHeight={() => 'auto'}
        rows={rows}
        columns={columns}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 8
            }
          }
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
};
