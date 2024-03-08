import { Dataset, UploadSession, UploadStatus } from '../../graphql/graphql';
import { Dispatch, SetStateAction, ChangeEvent } from 'react';
import { StatusMessage } from '../../models/StatusMessage';
import {
  CreateUploadSessionDocument,
  GetCsvUploadUrlDocument,
  ValidateCsvDocument
} from '../../graphql/upload-session/upload-session';
import { useApolloClient } from '@apollo/client';
import axios from 'axios';
import { Box, Button } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { useSnackbar } from '../../context/Snackbar.context';
import { useTranslation } from 'react-i18next';

export interface CSVUploadProps {
  dataset: Dataset | null;
  uploadSession: UploadSession | null;
  setUploadSession: Dispatch<SetStateAction<UploadSession | null>>;
  setValidationMessage: Dispatch<SetStateAction<StatusMessage | null>>;
  setCsvValid: Dispatch<SetStateAction<boolean>>;
}

export const CSVUpload: React.FC<CSVUploadProps> = ({
  dataset,
  setUploadSession,
  setValidationMessage,
  setCsvValid
}) => {
  const apolloClient = useApolloClient();
  const { pushSnackbarMessage } = useSnackbar();
  const { t } = useTranslation();

  // Implemented with using the apollo client directly instead of the useMutation hook
  // to reduce the need for multiple use effects to handle each step change
  const handleCSVChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // First create an upload session
    const sessionCreation = await apolloClient.mutate({
      mutation: CreateUploadSessionDocument,
      variables: { dataset: dataset?._id }
    });

    if (!sessionCreation.data?.createUploadSession) {
      pushSnackbarMessage(t('errors.uploadSessionCreate'), 'error');
      console.error(sessionCreation.errors);
      return;
    }

    const uploadSession = sessionCreation.data.createUploadSession;
    setUploadSession(uploadSession);

    // Next get the upload url
    const uploadUrlQuery = await apolloClient.query({
      query: GetCsvUploadUrlDocument,
      variables: { session: uploadSession._id }
    });

    if (!uploadUrlQuery.data?.getCSVUploadURL) {
      pushSnackbarMessage(t('errors.csvUpload'), 'error');
      console.error(uploadUrlQuery.error);
      return;
    }

    const uploadUrl = uploadUrlQuery.data.getCSVUploadURL;

    // Upload the CSV to the url
    const upload = await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': 'text/csv'
      }
    });

    if (upload.status != 200) {
      pushSnackbarMessage(t('errors.csvUpload'), 'error');
      console.error(uploadUrlQuery.error);
      return;
    }

    // Trigger the CSV validation
    const validation = await apolloClient.query({
      query: ValidateCsvDocument,
      variables: { session: uploadSession._id }
    });

    // Share any validation results
    const result = validation.data!.validateCSV;
    if (result.status == UploadStatus.Success) {
      setValidationMessage({ severity: 'success', message: 'CSV validated successfully' });
      setCsvValid(true);
    } else {
      setValidationMessage({ severity: 'error', message: result.message });
      setCsvValid(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <Button component="label" variant="contained" color="primary" startIcon={<UploadIcon />} sx={{ m: 1 }}>
        Upload CSV
        <input type="file" hidden onChange={handleCSVChange} accept=".csv" />
      </Button>
    </Box>
  );
};
