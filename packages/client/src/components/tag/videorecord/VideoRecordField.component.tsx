import { ControlProps, RankedTester, rankWith } from '@jsonforms/core';
import { ArrowLeft, ArrowRight, ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Typography, Stack, Button, IconButton } from '@mui/material';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { StatusProcessCircles } from './StatusCircles.component';
import { VideoRecordInterface } from './VideoRecordInterface.component';
import { useEffect, useState, useRef } from 'react';
import { useApolloClient } from '@apollo/client';
import {
  SaveVideoFieldDocument,
  SaveVideoFieldMutation,
  SaveVideoFieldMutationVariables
} from '../../../graphql/tag/tag';
import { useTag } from '../../../context/Tag.context';
import axios from 'axios';

const VideoRecordField: React.FC<ControlProps> = (props) => {
  const [maxVideos, setMaxVideos] = useState<number>(0);
  const [minimumVideos, setMinimumVideos] = useState<number>(0);
  const [validVideos, setValidVideos] = useState<boolean[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [blobs, setBlobs] = useState<(Blob | null)[]>([]);
  const [recording, setRecording] = useState<boolean>(false);
  const [videoFragmentID, setVideoFragmentID] = useState<string[]>([]);
  const stateRef = useRef<{
    validVideos: boolean[];
    blobs: (Blob | null)[];
    activeIndex: number;
    videoFragmentID: string[];
  }>();
  stateRef.current = { validVideos, blobs, activeIndex, videoFragmentID };
  const client = useApolloClient();
  const { tag } = useTag();

  useEffect(() => {
    if (!props.uischema.options?.minimumRequired) {
      console.error('Minimum number of videos required not specified');
      return;
    }
    const minimumVideos = props.uischema.options.minimumRequired;

    let maxVideos = minimumVideos;
    if (props.uischema.options?.maximumOptional) {
      maxVideos = props.uischema.options.maximumOptional;
    }

    setValidVideos(Array.from({ length: maxVideos }, (_, _i) => false));
    setMinimumVideos(minimumVideos);
    setMaxVideos(maxVideos);
    setBlobs(Array.from({ length: maxVideos }, (_, _i) => null));
  }, [props.uischema]);

  /** Handles saving the video fragment to the database and updating the JSON Forms representation of the data */
  const saveVideoFragment = async (blob: Blob) => {
    // Save the video fragment
    const result = await client.mutate<SaveVideoFieldMutation, SaveVideoFieldMutationVariables>({
      mutation: SaveVideoFieldDocument,
      variables: {
        tag: tag!._id,
        field: props.path,
        index: stateRef.current!.activeIndex
      }
    });

    if (!result.data?.saveVideoField) {
      console.error('Failed to save video fragment');
      return;
    }

    // Upload the video to the provided URL
    await axios.put(result.data.saveVideoField.uploadURL, blob, {
      headers: {
        'Content-Type': 'video/webm'
      }
    });

    // Update the JSON Forms representation of the data to be the ID of the video fragment

    // If the index is longer than the current videoFragmentID array, then add the new ID to the end
    if (stateRef.current!.activeIndex >= stateRef.current!.videoFragmentID.length) {
      const updatedVideoFragmentID = [...stateRef.current!.videoFragmentID, result.data!.saveVideoField._id];
      setVideoFragmentID(updatedVideoFragmentID);
      props.handleChange(props.path, updatedVideoFragmentID);
    } else {
      const updatedVideoFragmentID = stateRef.current!.videoFragmentID.map((id, index) => {
        if (index === stateRef.current!.activeIndex) {
          return result.data!.saveVideoField._id;
        }
        return id;
      });
      setVideoFragmentID(updatedVideoFragmentID);
      props.handleChange(props.path, updatedVideoFragmentID);
    }
  };

  /** Store the blob and check if the video needs to be saved */
  const handleVideoRecord = (video: Blob | null) => {
    const updatedBlobs = stateRef.current!.blobs.map((blob, index) => {
      if (index === stateRef.current!.activeIndex) {
        return video;
      }
      return blob;
    });
    const updateValidVideos = stateRef.current!.validVideos.map((valid, index) => {
      if (index === stateRef.current!.activeIndex) {
        return video !== null;
      }
      return valid;
    });

    if (video !== null) {
      saveVideoFragment(video);
    }
    setBlobs(updatedBlobs);
    setValidVideos(updateValidVideos);
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography sx={{ width: '33%' }}>{props.label}</Typography>
        <Typography>{props.description}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="column" spacing={2} sx={{ width: '50%', margin: 'auto' }}>
          <Typography variant="h5">
            Required: {minimumVideos}, Optional Max: {maxVideos}
          </Typography>
          <StatusProcessCircles isComplete={validVideos} setState={() => {}} activeIndex={activeIndex} />

          <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
            {/* Left navigation button */}
            <IconButton size="large" disabled={activeIndex == 0} onClick={() => setActiveIndex(activeIndex - 1)}>
              <ArrowLeft fontSize="large" />
            </IconButton>

            <VideoRecordInterface
              activeBlob={blobs[activeIndex]}
              recordVideo={(blob) => handleVideoRecord(blob)}
              recording={recording}
            />

            {/* Right navigation button */}
            <IconButton
              size="large"
              disabled={activeIndex == validVideos.length - 1 || validVideos[activeIndex] === false}
              onClick={() => setActiveIndex(activeIndex + 1)}
            >
              <ArrowRight fontSize="large" />
            </IconButton>
          </Stack>
          <Button variant={recording ? 'contained' : 'outlined'} onClick={() => setRecording(!recording)}>
            {recording ? 'Stop' : 'Start'} Recording
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export const videoFieldTester: RankedTester = rankWith(10, (uischema, _schema, _rootSchema) => {
  return uischema.options != undefined && uischema.options && uischema.options.customType === 'video';
});

export default withJsonFormsControlProps(VideoRecordField);
