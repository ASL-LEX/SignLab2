import { useEffect, useRef } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';

const mimeType = 'video/webm; codecs=vp9';

export interface VideoRecordInterfaceProps {
  activeBlob: Blob | null;
  handleVideoRecordCompletion: (blob: Blob | null) => void;
  recording: boolean;
}

export const VideoRecordInterface: React.FC<VideoRecordInterfaceProps> = ({ recording, handleVideoRecordCompletion }) => {
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const recorder = useReactMediaRecorder({
    video: true,
    audio: false,
    mediaRecorderOptions: {
      mimeType
    },
    onStop: (_mediaBlobUrl, blob) => handleVideoRecordCompletion(blob),
    blobPropertyBag: {
      type: mimeType
    }
  });

  // Handles switching between live preview and video playback
  useEffect(() => {
    // If in recording mode, show the user the preview
    if (videoPreviewRef.current && recorder.previewStream && recorder.status == 'recording') {
      videoPreviewRef.current.srcObject = recorder.previewStream;
    }
    // Otherwise, show the user the recording video
    else if (videoPreviewRef.current && recorder.mediaBlobUrl) {
      videoPreviewRef.current.src = recorder.mediaBlobUrl;
      videoPreviewRef.current.srcObject = null;
    }
  }, [recorder.status, recorder.previewStream, recorder.mediaBlobUrl]);

  // Handle toggling between recording and not recording
  useEffect(() => {
    if (recording) {
      recorder.startRecording();
    } else {
      recorder.stopRecording();
    }
  }, [recording]);

  return (
    <>
      <video style={{ minWidth: 500 }} ref={videoPreviewRef} src={recorder.mediaBlobUrl} controls autoPlay loop />
    </>
  );
};
