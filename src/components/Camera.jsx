import { useRef, useState } from "react";

import useCameraStream from "../hooks/camera/useCameraStream";
import useCameraCapture from "../hooks/camera/useCameraCapture";
import useCameraUpload from "../hooks/camera/useCameraUpload";

export default function Camera({ patientId, onClose, onUpload, onCapture }) {

  // -----------------------------
  // Hook: Stream camera to video
  // -----------------------------
  const { videoRef, cameraAvailable, stopCamera } = useCameraStream(onClose);

  // -----------------------------
  // Hook: Capture image from video
  // -----------------------------
  const {
    canvasRef,
    capturedImage,
    uploadMode,
    captureImage,
    handleRetake,
  } = useCameraCapture(onUpload, onCapture);

  // -----------------------------
  // Hook: Upload captured image
  // -----------------------------
  const { isLoading, uploadImage } = useCameraUpload(
    capturedImage,
    patientId,
    onUpload
  );

  // -----------------------------
  // Safe close handler
  // -----------------------------
  const handleClose = () => {
    stopCamera();
    onClose();
  };

  // -----------------------------
  // Capture handler
  // -----------------------------
  const handleCapture = () => {
    captureImage(videoRef);
  };

  // -----------------------------
  // Upload handler
  // -----------------------------
  const handleUpload = async () => {
    await uploadImage();

    // stop camera after upload
    stopCamera();
    onClose();
  };



  if (!cameraAvailable) {
    return (
      <div className="camera-container">
        <div style={{ 
          padding: "20px",
          textAlign: "center",
          color: "#dc2626"
        }}>
          <p><strong>❌ Camera Not Available</strong></p>
          <p>This may be due to:</p>
          <ul style={{ textAlign: "left", marginTop: "10px" }}>
            <li>Running on HTTP instead of HTTPS</li>
            <li>Browser camera permissions denied</li>
            <li>No camera hardware detected</li>
            <li>Unsupported browser</li>
          </ul>
          <button 
            onClick={handleClose}
            style={{
              marginTop: "15px",
              padding: "8px 16px",
              backgroundColor: "#e5e7eb",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Show captured image preview
  // -----------------------------
  if (uploadMode && capturedImage) {
    return (
      <div className="camera-container">
        <h3 style={{ marginBottom: "12px" }}>📸 Photo Preview</h3>

        <img 
          src={URL.createObjectURL(capturedImage)}
          style={{
            width: "100%",
            maxWidth: "400px",
            borderRadius: "6px",
            background: "#f3f4f6"
          }}
          alt="Captured"
        />

        <div className="camera-controls" style={{ marginTop: "12px" }}>
          {patientId ? (
            <>
              <button 
                onClick={handleUpload}
                disabled={isLoading}
                style={{ 
                  opacity: isLoading ? 0.6 : 1,
                  backgroundColor: "#10b981"
                }}
              >
                {isLoading ? "⏳ Uploading..." : "✅ Upload Photo"}
              </button>

              <button 
                onClick={handleRetake}
                disabled={isLoading}
              >
                📷 Retake
              </button>
            </>
          ) : (
            <>
              <div style={{ 
                padding: "10px", 
                backgroundColor: "#fef3c7", 
                borderRadius: "4px",
                marginBottom: "10px",
                fontSize: "12px",
                color: "#92400e"
              }}>
                ⚠️ Save patient first to upload photo
              </div>

              <button 
                onClick={handleRetake}
                style={{ width: "100%" }}
              >
                📷 Retake
              </button>
            </>
          )}

          <button onClick={handleClose} disabled={isLoading}>
            ✕ Close
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Show camera capture screen
  // -----------------------------
  return (
    <div className="camera-container">
      <h3 style={{ marginBottom: "12px" }}>📷 Capture Patient Photo</h3>

      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "6px",
          background: "#000"
        }}
      />

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="camera-controls">
        <button 
          onClick={handleCapture}
          style={{ backgroundColor: "#3b82f6" }}
        >
          📸 Capture
        </button>

        <button onClick={handleClose}>
          ✕ Close
        </button>
      </div>
    </div>
  );
}