import {Box} from '@mui/material';
import { Entry } from '../graphql/graphql';

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
  /** Start the video at the begining */
  const handleStart: React.MouseEventHandler<HTMLVideoElement> = (event) => {
    event.currentTarget.currentTime = 0;
    event.currentTarget.play();
  };

  /** Stop the video */
  const handleStop: React.MouseEventHandler<HTMLVideoElement> = (event) => {
    event.currentTarget.pause();
  };

  return (
    <video width={props.width} onMouseEnter={handleStart} onMouseLeave={handleStop}>
      <source src={props.entry.signedUrl} />
    </video>
  );
};

const ImageEntryView: React.FC<EntryViewProps> = (props) => {
  return (
    <img src={props.entry.signedUrl} width={props.width} />
  );
};
