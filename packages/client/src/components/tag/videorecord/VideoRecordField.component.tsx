import { ControlProps, RankedTester, rankWith } from '@jsonforms/core';
import { ArrowLeft, ArrowRight, ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Typography, Stack, Button, IconButton } from '@mui/material';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { StatusProcessCircles } from './StatusCircles.component';
import { VideoRecordInterface } from './VideoRecordInterface.component';
import { useEffect, useState, useCallback, useRef } from 'react';

const VideoRecordField: React.FC<ControlProps> = (props) => {
  const [maxVideos, setMaxVideos] = useState<number>(0);
  const [minimumVideos, setMinimumVideos] = useState<number>(0);
  const [validVideos, setValidVideos] = useState<boolean[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [blobs, setBlobs] = useState<(Blob | null)[]>([]);
  const [recording, setRecording] = useState<boolean>(false);
  const stateRef = useRef<{ validVideos: boolean[], blobs: (Blob | null)[]}>();
  stateRef.current = { validVideos, blobs };

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

    console.log('Minimum videos', minimumVideos, maxVideos);

    setValidVideos(Array.from({ length: maxVideos }, (_, _i) => false));
    setMinimumVideos(minimumVideos);
    setMaxVideos(maxVideos);
    setBlobs(Array.from({ length: maxVideos }, (_, _i) => null));
  }, [props.uischema]);

  const handleVideoRecord = (video: Blob | null, blobs: (Blob | null)[], validVideos: boolean[]) => {
    console.log('Video', video);
    console.log('Original, blobs', stateRef.current!.blobs);
    const updatedBlobs = stateRef.current!.blobs.map((blob, index) => {
      if (index === activeIndex) {
        return video;
      }
      return blob;
    });
    const updateValidVideos = stateRef.current!.validVideos.map((valid, index) => {
      if (index === activeIndex) {
        return video !== null;
      }
      return valid;
    });

    console.log('Updated blobs', updatedBlobs);

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
          <Typography variant="h5">Required: {minimumVideos}, Optional Max: {maxVideos}</Typography>
          <StatusProcessCircles isComplete={validVideos} setState={() => {}} activeIndex={activeIndex} />

          <Stack direction='row' spacing={2} sx={{ justifyContent: 'center' }}>
            {/* Left navigation button */}
            <IconButton size='large'><ArrowLeft fontSize='large'/></IconButton>

            <VideoRecordInterface activeBlob={blobs[activeIndex]} recordVideo={(blob) => handleVideoRecord(blob, blobs, validVideos)} recording={recording} />

            {/* Right navigation button */}
            <IconButton size='large'><ArrowRight fontSize='large' /></IconButton>
          </Stack>
          <Button variant="outlined" onClick={() => setRecording(!recording)}>{recording ? 'Stop' : 'Start' } Recording</Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export const videoFieldTester: RankedTester = rankWith(10, (uischema, _schema, _rootSchema) => {
  return uischema.options != undefined && uischema.options && uischema.options.customType === 'video';
});

export default withJsonFormsControlProps(VideoRecordField);
