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
    <DataGrid
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
  );
};
