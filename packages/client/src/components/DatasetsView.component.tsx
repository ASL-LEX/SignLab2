import { Accordion, AccordionSummary, Typography, Stack, AccordionDetails, IconButton } from '@mui/material';
import { Dataset } from '../graphql/graphql';
import { DatasetTable } from './DatasetTable.component';
import { Download, ExpandMore } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import { useConfirmation } from '../context/Confirmation.context';
import { useTranslation } from 'react-i18next';
import { useCreateDatasetDownloadMutation } from '../graphql/dataset/dataset';
import { useEffect } from 'react';
import { useSnackbar } from '../context/Snackbar.context';

export interface DatasetsViewProps {
  datasets: Dataset[];
  additionalColumns?: GridColDef[];
  supportEntryDelete?: boolean;
}

// TODO: Implement lazy loading on accordion open to prevent loading all datasets at once
export const DatasetsView: React.FC<DatasetsViewProps> = ({ datasets, additionalColumns, supportEntryDelete }) => {
  const confirmation = useConfirmation();
  const { t } = useTranslation();
  const [createDownloadMutation, createDownloadResults] = useCreateDatasetDownloadMutation();
  const { pushSnackbarMessage } = useSnackbar();

  // Gets confirmation from the user they want to download the whole dataset
  // TODO: Add cool down in case the user does not read the confirmation
  const handleDatasetDownloadRequest = (dataset: Dataset) => {
    confirmation.pushConfirmationRequest({
      title: t('components.datasetControl.downloadTitle'),
      message: t('components.datasetControl.downloadDescription'),
      onConfirm: () => {
        createDownloadMutation({
          variables: {
            downloadRequest: {
              dataset: dataset._id
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
      pushSnackbarMessage(t('components.datasetControl.downloadStartedSuccess'), 'success');
    } else if (createDownloadResults.error) {
      pushSnackbarMessage(t('components.datasetControl.downloadFailed'), 'error');
    }
  }, [createDownloadResults.data, createDownloadResults.error]);

  return (
    <>
      {datasets.map((dataset: Dataset) => (
        <Accordion key={dataset._id} disableGutters>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Stack direction="row" spacing={6}>
              <Typography>{dataset.name}</Typography>
              <Typography>{dataset.description}</Typography>
              <IconButton onClick={() => handleDatasetDownloadRequest(dataset)}>
                <Download />
              </IconButton>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            {/* provide new dataset object to allow DatasetTable to refetch entries after entries are updated */}
            <DatasetTable
              dataset={{ ...dataset }}
              additionalColumns={additionalColumns}
              supportEntryDelete={supportEntryDelete}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};
