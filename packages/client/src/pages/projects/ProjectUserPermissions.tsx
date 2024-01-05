import { Switch, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { ChangeEvent, useEffect, useState } from 'react';
import { useProject } from '../../context/Project.context';
import { ProjectPermissionModel, Project } from '../../graphql/graphql';
import { useGetProjectPermissionsQuery } from '../../graphql/permission/permission';
import { DecodedToken, useAuth } from '../../context/Auth.context';
import { useGrantProjectPermissionsMutation } from '../../graphql/permission/permission';

export const ProjectUserPermissions: React.FC = () => {
  const { project } = useProject();

  return (
    <>
      <Typography variant="h3">User Permissions</Typography>
      {project && <UserPermissionTable project={project} />}
    </>
  );
};

interface EditAdminSwitchProps {
  permission: ProjectPermissionModel;
  currentUser: DecodedToken;
  project: Project;
  refetch: () => void;
}

const EditAdminSwitch: React.FC<EditAdminSwitchProps> = (props) => {
  const [grantProjectPermissions, grantProjectPermissionsResults] = useGrantProjectPermissionsMutation();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    grantProjectPermissions({
      variables: {
        project: props.project._id,
        user: props.permission.user.id,
        isAdmin: event.target.checked
      }
    });
  };

  useEffect(() => {
    if (grantProjectPermissionsResults.data) {
      props.refetch();
    }
  }, [grantProjectPermissionsResults]);

  return (
    <Switch
      checked={props.permission.isProjectAdmin}
      onChange={handleChange}
      disabled={!props.permission.editable || props.permission.user.id === props.currentUser.id}
    />
  );
};

const UserPermissionTable: React.FC<{ project: Project }> = ({ project }) => {
  const { data, refetch } = useGetProjectPermissionsQuery({
    variables: {
      project: project._id
    }
  });

  const [rows, setRows] = useState<ProjectPermissionModel[]>([]);
  const { decodedToken } = useAuth();

  useEffect(() => {
    if (data?.getProjectPermissions) {
      setRows(data.getProjectPermissions);
    }
  }, [data]);

  const columns: GridColDef[] = [
    /* For now, only email is populated, this will change in the future
    {
      field: 'name',
      headerName: 'Name',
      valueGetter: (params) => params.row.user.fullname,
      flex: 1.25,
      editable: false,
    },
    {
      field: 'username',
      headerName: 'Username',
      valueGetter: (params) => params.row.user.username,
      flex: 1.75,
      editable: false
    },
    */
    {
      field: 'email',
      headerName: 'Email',
      valueGetter: (params) => params.row.user.email,
      flex: 1.75,
      editable: false
    },
    {
      field: 'projectAdmin',
      type: 'boolean',
      headerName: 'Project Admin',
      valueGetter: (params) => params.row.hasRole,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <EditAdminSwitch permission={params.row} currentUser={decodedToken!} project={project} refetch={refetch} />
        );
      },
      editable: false,
      flex: 1
    }
  ];

  return (
    <DataGrid
      getRowHeight={() => 'auto'}
      rows={rows}
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
      disableRowSelectionOnClick
    />
  );
};
