import { useRef, useEffect } from 'react';
import { Box } from '@mui/material';

export interface VideoViewProps {
  url: string;
  width: number;
  pauseFrame?: 'start' | 'end' | 'middle';
  autoPlay?: boolean;
  mouseOverControls?: boolean;
  displayControls?: boolean;
}

export const VideoEntryView: React.FC<VideoViewProps> = (props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  /** Start the video at the begining */
  const handleStart: React.MouseEventHandler = () => {
    if (!videoRef.current || (props.mouseOverControls != undefined && !props.mouseOverControls)) {
      return;
    }
    videoRef.current.currentTime = 0;
    videoRef.current?.play();
  };

  /** Stop the video */
  const handleStop: React.MouseEventHandler = () => {
    if (!videoRef.current || (props.mouseOverControls != undefined && !props.mouseOverControls)) {
      return;
    }
    videoRef.current.pause();
    setPauseFrame();
  };

  /** Set the video to the middle frame */
  const setPauseFrame = async () => {
    if (!videoRef.current) {
      return;
    }

    if (!props.pauseFrame || props.pauseFrame === 'middle') {
      const duration = await getDuration();
      videoRef.current.currentTime = duration / 2;
    } else if (props.pauseFrame === 'start') {
      videoRef.current.currentTime = 0;
    }
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

  // Set the video to the middle frame when the video is loaded
  useEffect(() => {
    setPauseFrame();
  }, [videoRef.current]);

  return (
    <Box sx={{ maxWidth: props.width }}>
      <video
        width={props.width}
        onMouseEnter={handleStart}
        onMouseLeave={handleStop}
        ref={videoRef}
        autoPlay={props.autoPlay}
        controls={props.displayControls}
      >
        <source src={props.url} />
      </video>
    </Box>
  );
};

