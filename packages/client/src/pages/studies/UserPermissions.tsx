import { Switch, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useStudy } from '../../context/Study.context';
import { Study, StudyPermissionModel } from '../../graphql/graphql';
import { DecodedToken, useAuth } from '../../context/Auth.context';
import { useGetStudyPermissionsQuery } from '../../graphql/permission/permission';
import { useEffect, useState } from 'react';


export const StudyUserPermissions: React.FC = () => {
  const { study } = useStudy();

  return (
    <>
      <Typography variant="h3">User Permissions</Typography>
      {study && <UserPermissionTable study={study} />}
    </>
  );
};

interface EditStudyAdminSwitchProps {
  study: Study;
  permission: StudyPermissionModel;
  currentUser: DecodedToken;
}

const EditStudyAdminSwitch: React.FC<EditStudyAdminSwitchProps> = (props) => {

  return (
    <Switch
      checked={props.permission.isStudyAdmin}
      disabled={!props.permission.isStudyAdminEditable || props.permission.user.id === props.currentUser.id}
    />
  );
};

const EditContributorSwitch: React.FC<EditStudyAdminSwitchProps> = (props) => {

    return (
      <Switch
        checked={props.permission.isContributor}
        disabled={!props.permission.isContributorEditable || props.permission.user.id === props.currentUser.id}
      />
    );
};

const EditTrainedSwitch: React.FC<EditStudyAdminSwitchProps> = (props) => {

  return (
    <Switch
      checked={props.permission.isTrained}
      disabled={!props.permission.isTrainedEditable}
    />
  );
};


const UserPermissionTable: React.FC<{ study: Study }> = ({ study }) => {
  const { decodedToken } = useAuth();
  const { data, refetch } = useGetStudyPermissionsQuery({
    variables: {
      study: study._id
    }
  });

  const [permissions, setPermissions] = useState<StudyPermissionModel[]>([]);

  useEffect(() => {
    if (data) {
      setPermissions(data.getStudyPermissions);
    }
  }, [data]);

  const columns: GridColDef[] = [
    {
      field: 'email',
      headerName: 'Email',
      valueGetter: (params) => params.row.user.email,
      flex: 1.75,
      editable: false
    },
    {
      field: 'studyAdmin',
      type: 'boolean',
      headerName: 'Study Admin',
      valueGetter: (params) => params.row.isStudyAdmin,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <EditStudyAdminSwitch permission={params.row} currentUser={decodedToken!} study={study} />
        );
      },
      editable: false,
      flex: 1
    },
    {
      field: 'contributor',
      headerName: 'Contributor',
      valueGetter: (params) => params.row.isContributor,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <EditContributorSwitch permission={params.row} currentUser={decodedToken!} study={study} />
        );
      },
      editable: false,
      flex: 1
    },
    {
      field: 'trained',
      headerName: 'Trained',
      valueGetter: (params) => params.row.isTrained,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <EditTrainedSwitch permission={params.row} currentUser={decodedToken!} study={study} />
        );
      },
      editable: false,
      flex: 1
    }
  ];
  return (
    <DataGrid
      getRowHeight={() => 'auto'}
      rows={permissions}
      columns={columns}
      getRowId={(row) => row.user.id}
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
  );
};
