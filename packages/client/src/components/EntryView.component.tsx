import { Box } from '@mui/material';
import { Entry } from '../graphql/graphql';
import { useEffect, useRef } from 'react';

export interface EntryViewProps {
  entry: Entry;
  width: number;
}

export const EntryView: React.FC<EntryViewProps> = (props) => {
  return (
    <Box sx={{ width: props.width }}>
      {getEntryView(props.entry)}
    </Box>
  );
};

const getEntryView = (entry: Entry) => {
  if (entry.contentType.startsWith('video/')) {
    return <VideoEntryView entry={entry} width={150} />;
  }
  if (entry.contentType.startsWith('image/')) {
    return <ImageEntryView entry={entry} width={150} />;
  }
  console.error('Unknown entry type');
  return <p>Placeholder</p>;
};

const VideoEntryView: React.FC<EntryViewProps> = (props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  /** Start the video at the begining */
  const handleStart: React.MouseEventHandler = () => {
    if (!videoRef.current) {
      return;
    }
    videoRef.current.currentTime = 0;
    videoRef.current?.play();
  };

  /** Stop the video */
  const handleStop: React.MouseEventHandler = () => {
    if (!videoRef.current) {
      return;
    }
    videoRef.current.pause();
    setMiddleFrame();
  };

  /** Set the video to the middle frame */
  const setMiddleFrame = async () => {
    if (!videoRef.current) {
      return;
    }
    const duration = await getDuration();
    videoRef.current.currentTime = duration / 2;
  };

  /** Get the duration, there is a known issue on Chrome with some audio/video durations */
  const getDuration = async () => {
    if (!videoRef.current) {
      return 0;
    }

    const video = videoRef.current!;

    // If the duration is infinity, this is part of a Chrome bug that causes
    // some durations to not load for audio and video. The StackOverflow
    // link below discusses the issues and possible solutions
    // Then, wait for the update event to be triggered
    await new Promise<void>((resolve, _reject) => {
      video.ontimeupdate = () => {
        // Remove the callback
        video.ontimeupdate = () => {};
        // Reset the time
        video.currentTime = 0;
        resolve();
      };

      video.currentTime = 1e101;
    });

    // Now try to get the duration again
    return video.duration;
  };


  useEffect(() => {
    setMiddleFrame();
  }, [videoRef.current]);

  return (
    <video width={props.width} onMouseEnter={handleStart} onMouseLeave={handleStop} ref={videoRef}>
      <source src={props.entry.signedUrl} />
    </video>
  );
};

const ImageEntryView: React.FC<EntryViewProps> = (props) => {
  return (
    <img src={props.entry.signedUrl} width={props.width} />
  );
};
