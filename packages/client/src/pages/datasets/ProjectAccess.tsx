import { Typography, Switch } from '@mui/material';
import { useProject } from '../../context/Project.context';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useGetDatasetProjectPermissionsLazyQuery } from '../../graphql/permission/permission';
import { useEffect, useState } from 'react';
import { DatasetProjectPermission, Project } from '../../graphql/graphql';
import { useGrantProjectDatasetAccessMutation } from '../../graphql/permission/permission';

export const ProjectAccess: React.FC = () => {
  const { project } = useProject();
  const [getDatasetProjectPermissions, datasetProjectPermissionResults] = useGetDatasetProjectPermissionsLazyQuery();
  const [projectAccess, setProjectAccess] = useState<DatasetProjectPermission[]>([]);
  const [grantProjectDatasetAccess, grantProjectDatasetAccessResults] = useGrantProjectDatasetAccessMutation();

  // For querying for the permissions
  useEffect(() => {
    if (project) {
      getDatasetProjectPermissions({ variables: { project: project._id } });
    }
  }, [project]);

  // For setting the permissions
  useEffect(() => {
    if (datasetProjectPermissionResults.data) {
      setProjectAccess(datasetProjectPermissionResults.data.getDatasetProjectPermissions);
    }
  }, [datasetProjectPermissionResults]);

  // For updating the permissions
  useEffect(() => {
    if (grantProjectDatasetAccessResults.data) {
      datasetProjectPermissionResults.refetch();
    }
  }, [grantProjectDatasetAccessResults]);

  const handleAccessChange = (dataset: string, project: string, hasAccess: boolean) => {
    grantProjectDatasetAccess({ variables: { dataset, project, hasAccess } });
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Dataset Name', width: 200, valueGetter: (params) => params.row.dataset.name },
    {
      field: 'description',
      headerName: 'Description',
      width: 200,
      valueGetter: (params) => params.row.dataset.description
    },
    {
      field: 'access',
      headerName: 'Project Has Access',
      width: 200,
      renderCell: (params) => (
        <DatasetAccess permission={params.row} project={project!} changeAccess={handleAccessChange} />
      )
    }
  ];

  return (
    <>
      {project ? (
        <>
          <Typography variant="h5">Dataset Access for "{project.name}"</Typography>
          <DataGrid columns={columns} rows={projectAccess} getRowId={(row) => row.dataset._id} />
        </>
      ) : (
        <Typography variant="h5">Select a Project to Continue</Typography>
      )}
    </>
  );
};

interface DatasetAccessProps {
  permission: DatasetProjectPermission;
  project: Project;
  changeAccess: (dataset: string, project: string, access: boolean) => void;
}

const DatasetAccess: React.FC<DatasetAccessProps> = ({ permission, changeAccess, project }) => {
  return (
    <Switch
      checked={permission.projectHasAccess}
      onChange={(event) => changeAccess(permission.dataset._id, project._id, event.target.checked)}
    />
  );
};
