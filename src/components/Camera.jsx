
import { useRef, useState, useEffect } from "react";

import useCameraStream from "../hooks/camera/useCameraStream";
import useCameraCapture from "../hooks/camera/useCameraCapture";
import useCameraUpload from "../hooks/camera/useCameraUpload";
import "./camera.css";


export default function Camera({ patientId, onClose, onUpload, onCapture }) {

  // -----------------------------
  // Lifecycle log
  // -----------------------------
  useEffect(() => {
    console.log("📷 [Camera] Component mounted");
    return () => {
      console.log("📷 [Camera] Component unmounting - cleanup running");
    };
  }, []);

  // -----------------------------
  // Camera stream hook
  // -----------------------------
  const { videoRef, cameraAvailable, stopCamera } = useCameraStream(onClose);

  // -----------------------------
  // Capture image hook
  // -----------------------------
  const {
    canvasRef,
    capturedImage,
    uploadMode,
    captureImage,
    handleRetake,
  } = useCameraCapture(onUpload, onCapture);

  // -----------------------------
  // Upload captured image hook
  // -----------------------------
  const { isLoading, uploadImage } = useCameraUpload(
    capturedImage,
    patientId,
    onUpload
  );

  // URL Upload State
  const [imageUrl, setImageUrl] = useState("");
  const [urlPreview, setUrlPreview] = useState(null);

  // File picker reference for local uploads
  const fileInputRef = useRef(null);

  // Helper: Convert image URL to Blob
  const urlToBlob = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      console.log("✅ Image converted to blob, size:", blob.size, "bytes");
      return blob;
    } catch (err) {
      console.error("❌ Error converting URL to blob:", err);
      throw err;
    }
  };

  // Handle file selection from local folder
  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        alert('❌ Only JPG and PNG files allowed');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('❌ File size must be under 5MB');
        return;
      }
      
      console.log('📤 Processing file:', file.name);
      
      // Convert file to blob (same as camera capture flow)
      const blob = new Blob([file], { type: file.type });
      const fileUrl = URL.createObjectURL(blob);
      
      console.log('✅ File converted to blob, ready for patient save');
      
      // Store blob via onCapture (same as camera capture flow)
      if (onCapture) {
        onCapture(blob);
      }
      
      // Pass file URL via onUpload (for preview/display)
      if (onUpload) {
        onUpload(fileUrl);
      }
      
      // Close camera - patient form will handle the save
      handleClose();
      
    } catch (err) {
      console.error('❌ File processing error:', err);
      alert('Failed to process file: ' + err.message);
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // -----------------------------
  // Close handler
  // -----------------------------
  const handleClose = () => {
    console.log("📷 [Camera] Closing camera");
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
  // Upload captured image
  // -----------------------------
  const handleUpload = async () => {
    await uploadImage();
    stopCamera();
    onClose();
  };

  // -----------------------------
  // Preview URL image
  // -----------------------------
  const handlePreviewUrl = () => {
    if (!imageUrl) {
      alert("Please paste an image URL or base64 data URL first");
      return;
    }

    console.log("📸 Preview URL:", imageUrl.substring(0, 50) + "...");
    
    // Load the image to verify it's valid
    const img = new Image();
    
    img.onload = () => {
      console.log("✅ Image loaded successfully");
      setUrlPreview(imageUrl);
    };
    
    img.onerror = () => {
      console.error("❌ Failed to load image");
      alert("Failed to load image. Check the URL or try a different image.");
    };
    
    // Try to load the image
    img.src = imageUrl;
  };

  // -----------------------------
  // Upload image from URL - Convert to blob and pass to parent
  // -----------------------------
  const handleUploadUrl = async () => {
    if (!imageUrl) {
      alert("Please paste an image URL first");
      return;
    }

    if (!urlPreview) {
      alert("Please preview the image first to confirm it loads");
      return;
    }

    try {
      console.log("📤 Converting image URL to blob...");
      
      // Convert URL to blob
      const imageBlob = await urlToBlob(imageUrl);
      
      console.log("📤 Image blob created, passing to parent via onCapture");
      
      // Call onCapture with the blob - this stores it in capturedImageBlob
      // Same as camera capture flow
      if (onCapture) {
        onCapture(imageBlob);
      }
      
      // Call onUpload to display the image
      if (onUpload) {
        onUpload(imageUrl);
      }

      // Close camera modal
      handleClose();
      
    } catch (err) {
      console.error("❌ Failed to upload URL image:", err);
      alert("Failed to process image: " + err.message);
    }
  };

  // -----------------------------
  // Camera not available
  // -----------------------------
  if (!cameraAvailable) {
    return (
      <div className="camera-container">
        <div style={{
          padding: "20px",
          textAlign: "center",
          color: "#dc2626"
        }}>
          <p><strong>❌ Camera Not Available</strong></p>

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
if (uploadMode && capturedImage) {
  return (
    <div className="camera-wrapper">

      <div className="camera-header">
        <h3>📸 Photo Preview</h3>
      </div>

      <div className="preview-container">
        <img
          src={URL.createObjectURL(capturedImage)}
          alt="Captured"
          className="preview-image"
        />
      </div>

      <div className="camera-controls">

        {patientId ? (
          <>
            <button
              className="btn-success"
              onClick={handleUpload}
              disabled={isLoading}
            >
              {isLoading ? "⏳ Uploading..." : "✅ Upload Photo"}
            </button>

            <button
              className="btn-secondary"
              onClick={handleRetake}
              disabled={isLoading}
            >
              📷 Retake
            </button>
          </>
        ) : (
          <>
            <div className="warning-box">
              ⚠️ Save patient first to upload photo
            </div>

            <button
              className="btn-secondary full"
              onClick={handleRetake}
            >
              📷 Retake
            </button>
          </>
        )}

        <button className="btn-close" onClick={handleClose}>
          ✕ Close
        </button>

      </div>
    </div>
  );
}


// -----------------------------
// Main camera screen
// -----------------------------
return (
  <div className="camera-wrapper">

    <div className="camera-header">
      <h3>📷 Capture Patient Photo</h3>
    </div>

    {/* Upload Section */}
    <div className="upload-section">

      <input
        type="text"
        placeholder="Paste image URL (example: http://192.168.1.200/photo.jpg)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="url-input"
      />

      <div className="upload-buttons">

        <button onClick={handlePreviewUrl}>
          🔍 Preview
        </button>

        <button onClick={handleUploadUrl}>
          ⬆ Upload URL
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        <button onClick={() => fileInputRef.current?.click()}>
          📁 Upload Files
        </button>

      </div>

      {urlPreview && (
        <div className="preview-container">
          <img src={urlPreview} alt="URL Preview" className="preview-image" />
        </div>
      )}

    </div>

    {/* Camera */}
    <div className="camera-preview">
      <video
        ref={videoRef}
        autoPlay
        playsInline
      />
    </div>

    <canvas ref={canvasRef} style={{ display: "none" }} />

    <div className="camera-controls">
      <button
        className="btn-primary"
        onClick={handleCapture}
      >
        📸 Capture
      </button>

      <button
        className="btn-close"
        onClick={handleClose}
      >
        ✕ Close
      </button>
    </div>

  </div>
);
}
