import { useEffect, useRef, useState, useCallback } from 'react';

export interface VideoRecordInterfaceProps {
  activeBlob: Blob | null;
  recordVideo: (blob: Blob | null) => void;
  recording: boolean;
}

export const VideoRecordInterface: React.FC<VideoRecordInterfaceProps> = (props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [blobs, setBlobs] = useState<Blob[]>([]);

  // On data available, store the blob
  const handleOnDataAvailable = useCallback((event: BlobEvent) => {
    console.log('New Blob', event.data);
    blobs.push(event.data);
    setBlobs(blobs);
    if (!props.recording) {
      props.recordVideo(new Blob(blobs, { type: 'video/webm' }));
    }
  }, [setBlobs]);

  const startRecording = async () => {
    // Clear the blobs
    setBlobs([]);

    // Create the media recorder
    // TODO: In the future have audio be an option
    const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

    // Setup the preview
    videoRef.current!.srcObject = stream;
    videoRef.current!.play();

    // Set the encoding
    const options = { mimeType: 'video/webm; codecs=vp9' };

    // Create the media recorder
    let mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = handleOnDataAvailable;

    // Start recording
    mediaRecorder.start();
    setMediaRecorder(mediaRecorder);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  // Handle changes to the recording status
  useEffect(() => {
    console.log('Recording status changed to: ' + props.recording);
    if (props.recording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [props.recording]);

  // Control the display based on if an active blob is present
  useEffect(() => {
    console.log('Active blob changed to: ', props.activeBlob);
    // If there is no active blob, show the video preview
    if (!props.activeBlob) {
      videoRef.current!.style.display = 'block';
      videoRef.current!.src = '';
      return;
    }

    // Otherwise show the recording blobl
    const blobUrl = URL.createObjectURL(props.activeBlob);
    videoRef.current!.srcObject = null;
    videoRef.current!.src = blobUrl;
  }, [props]);

  return (
    <>
      <video width={'100%'} ref={videoRef} controls/>
    </>
  );
};
