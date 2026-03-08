import { useEffect, useRef, useState } from "react";

export default function useCameraStream(onClose) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraAvailable, setCameraAvailable] = useState(true);

  // -----------------------------
  // Function to stop camera
  // -----------------------------
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("Camera API not available");
      setCameraAvailable(false);

      alert(
        "Camera is not available. This may be due to:\n" +
        "- Running on HTTP\n" +
        "- Browser restrictions\n" +
        "- Missing camera hardware"
      );

      onClose();
      return;
    }

    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          streamRef.current = mediaStream;
          setCameraAvailable(true);
        }

      } catch (error) {
        console.error("Camera access error:", error);
        setCameraAvailable(false);

        let msg = "Camera access denied or not available";
        if (error.name === "NotAllowedError")
          msg = "Camera permission denied. Allow access in browser settings.";
        if (error.name === "NotFoundError")
          msg = "No camera device found.";
        if (error.name === "NotSupportedError")
          msg = "Camera not supported in this browser.";

        alert(msg);
        onClose();
      }
    }

    startCamera();

    // cleanup when component unmounts
    return () => {
      stopCamera();
    };

  }, [onClose]);

  return { videoRef, cameraAvailable, stopCamera };
}