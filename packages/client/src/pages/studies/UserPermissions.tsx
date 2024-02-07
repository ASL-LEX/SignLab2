import { Switch, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useStudy } from '../../context/Study.context';
import { Study, StudyPermissionModel } from '../../graphql/graphql';
import { DecodedToken, useAuth } from '../../context/Auth.context';
import {
  useGetStudyPermissionsQuery,
  useGrantStudyAdminMutation,
  useGrantContributorMutation,
  useGrantTrainedContributorMutation
} from '../../graphql/permission/permission';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const StudyUserPermissions: React.FC = () => {
  const { study } = useStudy();
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h3">{t('menu.userPermissions')}</Typography>
      {study && <UserPermissionTable study={study} />}
    </>
  );
};

interface EditSwitchProps {
  study: Study;
  permission: StudyPermissionModel;
  currentUser: DecodedToken;
  refetch: () => void;
}

const EditStudyAdminSwitch: React.FC<EditSwitchProps> = (props) => {
  const [grantStudyAdmin, grantStudyAdminResults] = useGrantStudyAdminMutation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    grantStudyAdmin({
      variables: {
        study: props.study._id,
        user: props.permission.user.id,
        isAdmin: event.target.checked
      }
    });
  };

  useEffect(() => {
    if (grantStudyAdminResults.data) {
      props.refetch();
    }
  }, [grantStudyAdminResults]);

  return (
    <Switch
      checked={props.permission.isStudyAdmin}
      disabled={!props.permission.isStudyAdminEditable || props.permission.user.id === props.currentUser.id}
      onChange={handleChange}
    />
  );
};

const EditContributorSwitch: React.FC<EditSwitchProps> = (props) => {
  const [grantContributor, grantContributorResults] = useGrantContributorMutation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    grantContributor({
      variables: {
        study: props.study._id,
        user: props.permission.user.id,
        isContributor: event.target.checked
      }
    });
  };

  useEffect(() => {
    if (grantContributorResults.data) {
      props.refetch();
    }
  }, [grantContributorResults]);

  return (
    <Switch
      checked={props.permission.isContributor}
      disabled={!props.permission.isContributorEditable || props.permission.user.id === props.currentUser.id}
      onChange={handleChange}
    />
  );
};

const EditTrainedSwitch: React.FC<EditSwitchProps> = (props) => {
  const [grantTrainedContributor, grantTrainedContributorResults] = useGrantTrainedContributorMutation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    grantTrainedContributor({
      variables: {
        study: props.study._id,
        user: props.permission.user.id,
        isTrained: event.target.checked
      }
    });
  };

  useEffect(() => {
    if (grantTrainedContributorResults.data) {
      props.refetch();
    }
  }, [grantTrainedContributorResults]);

  return (
    <Switch
      checked={props.permission.isTrained}
      disabled={!props.permission.isTrainedEditable}
      onChange={handleChange}
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
  const { t } = useTranslation();

  useEffect(() => {
    if (data) {
      setPermissions(data.getStudyPermissions);
    }
  }, [data]);

  const columns: GridColDef[] = [
    {
      field: 'email',
      headerName: t('common.email'),
      valueGetter: (params) => params.row.user.email,
      flex: 1.75,
      editable: false
    },
    {
      field: 'studyAdmin',
      type: 'boolean',
      headerName: t('components.userPermissions.studyAdmin'),
      valueGetter: (params) => params.row.isStudyAdmin,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <EditStudyAdminSwitch permission={params.row} currentUser={decodedToken!} study={study} refetch={refetch} />
        );
      },
      editable: false,
      flex: 1
    },
    {
      field: 'contributor',
      headerName: t('components.userPermissions.contributor'),
      valueGetter: (params) => params.row.isContributor,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <EditContributorSwitch permission={params.row} currentUser={decodedToken!} study={study} refetch={refetch} />
        );
      },
      editable: false,
      flex: 1
    },
    {
      field: 'trained',
      headerName: t('components.userPermissions.trained'),
      valueGetter: (params) => params.row.isTrained,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <EditTrainedSwitch permission={params.row} currentUser={decodedToken!} study={study} refetch={refetch} />
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
