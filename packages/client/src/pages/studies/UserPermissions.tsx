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
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      maxWidth: 100
    },
    {
      field: 'name',
      headerName: 'Name',
      editable: true,
      flex: 1,
      maxWidth: 300
    },
    {
      field: 'username',
      headerName: 'Username',
      editable: true,
      flex: 1,
      maxWidth: 300
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      maxWidth: 300,
      editable: true
    },
    {
      field: 'adminSwitch',
      type: 'boolean',
      editable: true,
      maxWidth: 200,
      flex: 1,
      headerName: 'Study Admin',
      renderCell: (params) => <Switch checked={params.value} />,
      renderEditCell: (params) => <SwitchEditInputCell {...params} />
    },
    {
      field: 'visibleSwitch',
      type: 'boolean',
      editable: true,
      headerName: 'Study Visible',
      renderCell: (params) => <Switch checked={params.value} />,
      maxWidth: 200,
      flex: 1,
      renderEditCell: (params) => <SwitchEditInputCell {...params} />
    },
    {
      field: 'switch',
      type: 'boolean',
      editable: true,
      maxWidth: 200,
      flex: 1,
      headerName: 'Contribute',
      renderCell: (params) => <Switch checked={params.value} />,
      renderEditCell: (params) => <SwitchEditInputCell {...params} />
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
