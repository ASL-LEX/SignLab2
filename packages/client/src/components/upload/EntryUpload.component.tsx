import { Button, Box, LinearProgress, Stack } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { useApolloClient } from '@apollo/client';
import { GetEntryUploadUrlDocument, CompleteUploadSessionDocument } from '../../graphql/upload-session/upload-session';
import { UploadSession, UploadStatus } from '../../graphql/graphql';
import axios from 'axios';
import { Dispatch, SetStateAction, useState  } from 'react';
import { StatusMessage } from '../../models/StatusMessage';

export interface EntryUploadProps {
  uploadSession: UploadSession | null;
  setValidationMessage: Dispatch<SetStateAction<StatusMessage | null>>;
  setEntryUploadComplete: Dispatch<SetStateAction<boolean>>;
}

export const EntryUpload: React.FC<EntryUploadProps> = ({ uploadSession, setValidationMessage, setEntryUploadComplete }) => {
  const apolloClient = useApolloClient();

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);


  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!uploadSession) {
      console.error('No upload session');
      return;
    }

    const files = event.target.files;
    if (!files) {
      return;
    }

    // Filter out non-video files
    const videos = Array.from(files).filter((file) => file.type.startsWith('video') || file.type.startsWith('image'));

    setIsUploading(true);
    let numUploaded = 0;
    for (const video of videos) {
      const uploadUrlQuery = await apolloClient.query({
        query: GetEntryUploadUrlDocument,
        variables: { session: uploadSession._id, filename: video.name, contentType: video.type }
      });

      if (!uploadUrlQuery.data?.getEntryUploadURL) {
        console.error('Failed to get upload url');
        return;
      }

      const uploadUrl = uploadUrlQuery.data.getEntryUploadURL;

      // Upload the CSV to the url
      await axios.put(uploadUrl, video, {
        headers: {
          'Content-Type': video.type
        }
      });

      numUploaded++;
      setUploadProgress((numUploaded / videos.length) * 100);
    }

    const completionResult = await apolloClient.mutate({
      mutation: CompleteUploadSessionDocument,
      variables: { session: uploadSession._id }
    });

    const completionData = completionResult.data?.completeUploadSession;
    if (!completionData) {
      console.error('Failed to complete upload session');
      return;
    }

    if (completionData.status == UploadStatus.Warning) {
      setValidationMessage({ severity: 'warning', message: completionData.message });
    }

    setIsUploading(false);
    setUploadComplete(true);
    setEntryUploadComplete(true);
    setValidationMessage({ message: 'Upload complete', severity: 'success' });
  };

  return (
    <Stack sx={{ display: 'flex' }}>
      <Button component="label" variant="contained" color="primary" startIcon={<UploadIcon />} sx={{ m: 1 }}>
        Upload Videos
        {/* @ts-expect-error */}
        <input type="file" hidden onChange={handleChange} webkitdirectory="true" mozdirectory="true" accept="image/*" />
      </Button>
      <Box sx={{ width: '100%' }}>
        {isUploading && <LinearProgress value={uploadProgress} variant='determinate' color={uploadComplete ? 'primary' : 'success' }/>}
      </Box>
    </Stack>
  );
};
