import { Button } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { useApolloClient } from '@apollo/client';
import { GetEntryUploadUrlDocument } from '../../graphql/upload-session/upload-session';
import { UploadSession } from '../../graphql/graphql';
import axios from 'axios';

export interface EntryUploadProps {
  uploadSession: UploadSession | null;
}

export const EntryUpload: React.FC<EntryUploadProps> = ({ uploadSession }) => {
  const apolloClient = useApolloClient();


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
    const videos = Array.from(files).filter((file) => file.type.startsWith('video'));

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
      console.log(uploadUrl);

      // Upload the CSV to the url
      await axios.put(uploadUrl, video, {
        headers: {
          'Content-Type': video.type
        }
      });
    }
  };

  return (
    <Button variant="outlined" sx={{ margin: '10px' }}>
      <Button component="label" variant="contained" color="primary" startIcon={<UploadIcon />} sx={{ m: 1 }}>
        Upload Videos
        {/* @ts-expect-error */}
        <input type="file" hidden onChange={handleChange} webkitdirectory="true" mozdirectory="true" accept="image/*" />
      </Button>
    </Button>
  );
};
