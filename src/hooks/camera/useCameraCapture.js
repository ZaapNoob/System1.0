
import { useRef, useState } from "react";

export default function useCameraCapture(onUpload, onCapture) {
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadMode, setUploadMode] = useState(false);

  const captureImage = (videoRef) => {
    if (!videoRef.current || !canvasRef.current) {
      alert("Camera is not ready");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      alert("Cannot get canvas context");
      return;
    }

    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) {
        alert("Failed to capture image");
        return;
      }

      const previewUrl = URL.createObjectURL(blob);

      setCapturedImage(blob);
      setUploadMode(true);

      if (onUpload) onUpload(previewUrl);
      if (onCapture) onCapture(blob); // Pass blob to parent for auto-upload
    }, "image/jpeg", 0.85);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setUploadMode(false);
  };

  return { canvasRef, capturedImage, uploadMode, captureImage, handleRetake };
}