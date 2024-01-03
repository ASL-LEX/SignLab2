import { Switch, Typography } from '@mui/material';
import useEnhancedEffect from '@mui/material/utils/useEnhancedEffect';
import { DataGrid, GridColDef, GridRenderCellParams, useGridApiContext } from '@mui/x-data-grid';
import { GridRowModesModel } from '@mui/x-data-grid-pro';
import { useRef, useState } from 'react';

const SwitchEditInputCell: React.FC<GridRenderCellParams> = (props: GridRenderCellParams<any, boolean>) => {
  const { id, value, field, hasFocus } = props;
  const apiRef = useGridApiContext();
  const ref = useRef<HTMLElement>();

  const handleChange = (newValue: boolean | false) => {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  useEnhancedEffect(() => {
    if (hasFocus && ref.current) {
      const input = ref.current.querySelector<HTMLInputElement>(`input[value="${value}"]`);
      input?.focus();
    }
  }, [hasFocus, value]);

  return <Switch disabled defaultChecked value={value} onChange={() => handleChange} />;
};

const tableRows = [
  {
    id: 1,
    name: 'Professor Flour',
    username: 'flour123',
    email: 'bread@bread.com',
    switch: true
  },
  {
    id: 2,
    name: 'Elon',
    username: 'elon1012',
    email: 'elonmusk@hotmail.com',
    switch: true
  },
  {
    id: 3,
    name: 'Chrishell Stausse',
    username: 'chrishell123',
    email: 'chrishell@gmail.com',
    switch: false
  },
  {
    id: 4,
    name: 'Project Charles',
    username: 'charlie',
    email: '111@hotmail.com',
    switch: false
  }
];

export const ProjectUserPermissions: React.FC = () => {
  const [rows] = useState(tableRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1.25,
      editable: true
    },
    {
      field: 'username',
      headerName: 'Username',
      flex: 1.75,
      editable: true
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.75,
      editable: true
    },
    {
      field: 'switch',
      type: 'boolean',
      headerName: 'Switch',
      renderCell: (params) => <Switch defaultChecked value={params.value} />,
      renderEditCell: (params) => <SwitchEditInputCell {...params} />,
      editable: true,
      flex: 1
    }
  ];

  return (
    <>
      <Typography variant="h3">User Permissions</Typography>
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
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </>
  );
};
