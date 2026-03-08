import React from "react";
import useCameraStream from "../hooks/camera/useCameraStream";
import useCameraCapture from "../hooks/camera/useCameraCapture";

export default function Camera({ onClose, onUpload, onCapture }) {

  const { videoRef } = useCameraStream(onClose);
  const { canvasRef, captureImage } = useCameraCapture(onUpload, onCapture);

  return (
    <div className="camera-container">

      <video ref={videoRef} autoPlay playsInline />

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="camera-controls">
        <button onClick={() => captureImage(videoRef)}>
          Capture
        </button>

        <button onClick={onClose}>
          Close
        </button>
      </div>

    </div>
  );
}