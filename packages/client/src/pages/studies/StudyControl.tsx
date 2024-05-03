import { Typography, Box, IconButton } from '@mui/material';
import { useStudy } from '../../context/Study.context';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { GridActionsCellItem } from '@mui/x-data-grid-pro';
import { Study } from '../../graphql/graphql';
import { useCreateStudyDownloadMutation, useDeleteStudyMutation } from '../../graphql/study/study';
import { useEffect } from 'react';
import { useConfirmation } from '../../context/Confirmation.context';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../../context/Snackbar.context';
import { Download } from '@mui/icons-material';

export const StudyControl: React.FC = () => {
  const { studies, updateStudies } = useStudy();

  const [deleteStudyMutation, deleteStudyResults] = useDeleteStudyMutation();
  const confirmation = useConfirmation();
  const { t } = useTranslation();
  const { pushSnackbarMessage } = useSnackbar();

  const [createDownloadMutation, createDownloadResults] = useCreateStudyDownloadMutation();

  const handleDelete = async (id: GridRowId) => {
    // Execute delete mutation
    confirmation.pushConfirmationRequest({
      title: t('components.studyControl.deleteStudy'),
      message: t('components.studyControl.deleteDescription'),
      onConfirm: () => {
        deleteStudyMutation({ variables: { study: id.toString() } });
      },
      onCancel: () => {}
    });
  };

  // TODO: Add error message
  useEffect(() => {
    if (deleteStudyResults.called && deleteStudyResults.data) {
      updateStudies();
    } else if (deleteStudyResults.error) {
      pushSnackbarMessage(t('errors.studyDelete'), 'error');
      console.error(deleteStudyResults.error);
    }
  }, [deleteStudyResults.called, deleteStudyResults.data, deleteStudyResults.error]);

  const handleDownloadRequest = (study: Study) => {
    confirmation.pushConfirmationRequest({
      title: t('components.studyDownload.downloadTitle'),
      message: t('components.studyDownload.downloadDescription'),
      onConfirm: () => {
        createDownloadMutation({
          variables: {
            downloadRequest: {
              study: study._id
            }
          }
        });
      },
      onCancel: () => {}
    });
  };

  // Share the results with the user
  useEffect(() => {
    if (createDownloadResults.data) {
      pushSnackbarMessage(t('components.studyDownload.downloadStartedSuccess'), 'success');
    } else if (createDownloadResults.error) {
      pushSnackbarMessage(t('components.studyDownload.downloadFailed'), 'error');
    }
  }, [createDownloadResults.data, createDownloadResults.error]);

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
      field: 'download',
      headerName: t('common.download'),
      width: 200,
      renderCell: (params) => (
        <IconButton onClick={() => handleDownloadRequest(params.row)}>
          <Download />
        </IconButton>
      )
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
      <Typography variant="h3">{t('menu.studyControl')}</Typography>
      <Box sx={{ maxWidth: '1000px', margin: 'auto' }}>
        <DataGrid rows={studies || []} columns={columns} getRowId={(row: Study) => row._id} />
      </Box>
    </>
  );
};
