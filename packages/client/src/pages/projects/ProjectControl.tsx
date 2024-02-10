import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
import { useProject } from '../../context/Project.context';
import { GridActionsCellItem } from '@mui/x-data-grid-pro';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Project } from '../../graphql/graphql';
import { useDeleteProjectMutation } from '../../graphql/project/project';
import { useConfirmation } from '../../context/Confirmation.context';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ProjectControl: React.FC = () => {
  const { projects, updateProjectList } = useProject();

  const [deleteProjectMutation, deleteProjectResults] = useDeleteProjectMutation();
  const confirmation = useConfirmation();
  const { t } = useTranslation();

  const handleDelete = async (id: GridRowId) => {
    // Execute delete mutation
    confirmation.pushConfirmationRequest({
      title: t('components.projectControl.deleteStudy'),
      message: t('components.projectControl.deleteDescription'),
      onConfirm: () => {
        deleteProjectMutation({ variables: { project: id.toString() } });
      },
      onCancel: () => {}
    });
  };

  // TODO: Add error message
  useEffect(() => {
    if (deleteProjectResults.called && deleteProjectResults.data) {
      updateProjectList();
    }
  }, [deleteProjectResults.data, deleteProjectResults.called]);

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('common.name'),
      width: 200,
      editable: false
    },
    {
      field: 'description',
      headerName: t('common.description'),
      width: 500,
      editable: false
    },
    {
      field: 'delete',
      type: 'actions',
      headerName: t('common.delete'),
      width: 120,
      maxWidth: 120,
      cellClassName: 'delete',
      getActions: (params) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label={t('common.delete')}
            onClick={() => handleDelete(params.id)}
          />
        ];
      }
    }
  ];

  return (
    <>
      <Typography variant="h3">{t('menu.projectControl')}</Typography>
      <Box sx={{ maxWidth: '1000px', margin: 'auto' }}>
        <DataGrid rows={projects || []} columns={columns} getRowId={(row: Project) => row._id} />
      </Box>
    </>
  );
};

export { ProjectControl };
