import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { GridRowModesModel } from '@mui/x-data-grid-pro';
import { useState } from 'react';

interface Row {
  id: number;
  view: string;
  entry: string;
  responder: string;
  access?: boolean;
  partOf?: boolean;
  available?: boolean;
}

interface Table {
  tableRows: Row[];
  columns: GridColDef[];
}

export const DatasetControlComponent: React.FC<Table> = ({ tableRows, columns }: Table) => {
  const [rows] = useState(tableRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <Box sx={{ height: 350, width: '100%', boxShadow: '1px 9px 15px darkgrey' }}>
      <DataGrid
        sx={{
          '&.MuiDataGrid-root': {
            fontWeight: 'normal'
          },
          '& .MuiDataGrid-cell': {
            overflow: 'auto',
            paddingTop: '8px !important',
            paddingBottom: '8px !important'
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
              pageSize: 5
            }
          }
        }}
        pageSizeOptions={[5, 10, 15]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
};
