import { useEffect, useRef } from 'react';

export const VideoRecordInterface: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current!.srcObject = stream;
      videoRef.current!.play();
    });
  }, []);

  return (
    <>
      <video width={'100%'} ref={videoRef} controls/>
    </>
  );
};
