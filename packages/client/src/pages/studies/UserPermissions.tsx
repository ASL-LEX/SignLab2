import { Box, Switch } from '@mui/material';
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
    name: 'Prof Appavoo',
    username: 'appavoo',
    email: 'appavoo@bread.com',
    adminSwitch: true,
    visibleSwitch: false,
    switch: true
  },
  {
    id: 2,
    name: 'Heather',
    username: 'Heather82',
    email: 'heather@hotmail.com',
    adminSwitch: false,
    visibleSwitch: true,
    switch: true
  },
  {
    id: 3,
    name: 'Kamila',
    username: 'kamila0509',
    email: 'kamila@gmail.com'
  },
  {
    id: 4,
    name: 'Mr Ronaldinho',
    username: 'ron12345',
    email: 'ron@bu.edu',
    adminSwitch: true,
    visibleSwitch: false,
    switch: true
  }
];

export const StudyUserPermissions: React.FC = () => {
  const [rows] = useState(tableRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.3 },
    {
      field: 'name',
      headerName: 'Name',
      flex: 0.9,
      editable: true
    },
    {
      field: 'username',
      headerName: 'Username',
      flex: 0.9,
      editable: true
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.1,
      editable: true
    },
    {
      field: 'adminSwitch',
      type: 'boolean',
      editable: true,
      headerName: 'Study Admin',
      renderCell: (params) => <Switch checked={params.value} />,
      renderEditCell: (params) => <SwitchEditInputCell {...params} />,
      flex: 0.75
    },
    {
      field: 'visibleSwitch',
      type: 'boolean',
      editable: true,
      headerName: 'Study Visible',
      renderCell: (params) => <Switch checked={params.value} />,
      renderEditCell: (params) => <SwitchEditInputCell {...params} />,
      flex: 0.75
    },
    {
      field: 'switch',
      type: 'boolean',
      editable: true,
      headerName: 'Contribute',
      renderCell: (params) => <Switch checked={params.value} />,
      renderEditCell: (params) => <SwitchEditInputCell {...params} />,
      flex: 0.75
    }
  ];

  return (
    <Box sx={{ height: 800, width: '100%', position: 'absolute', top: '75px', left: '1%', right: '1%' }}>
      <h3 style={{ top: '10%', paddingBottom: '10px' }}>User Permissions</h3>
      <DataGrid
        sx={{
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
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
};
