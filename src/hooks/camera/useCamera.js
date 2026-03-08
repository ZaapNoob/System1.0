import { useState } from "react";
import { uploadPatientImage } from "../../api/camera";

export default function useCamera(newPatient, handleSavePatient) {
  const [showCamera, setShowCamera] = useState(false);
  const [patientImage, setPatientImage] = useState(null);
  const [currentPatientId, setCurrentPatientId] = useState(null);
  const [capturedImageBlob, setCapturedImageBlob] = useState(null); // Store the blob for upload

  // =======================
  // CAMERA HANDLERS
  // =======================
  const handleOpenCamera = () => {
    console.log("🎥 handleOpenCamera() called from Parent");
    if (!newPatient.first_name || !newPatient.last_name) {
      alert("Please fill in patient details before capturing photo");
      return;
    }

    // Fix #3: Clear previous image when opening camera again
    setPatientImage(null);
    setCapturedImageBlob(null);
    setShowCamera(true);
    console.log("🎥 Camera modal opened");
  };

  const handleCloseCamera = () => {
    console.log("🚪 handleCloseCamera() called from Parent");
    setShowCamera(false);
    console.log("✅ showCamera set to false");
  };

  // =======================
  // CLEAR IMAGE STATE (Fix #4)
  // =======================
  const clearPatientImage = () => {
    setPatientImage(null);
    setCapturedImageBlob(null);
    setCurrentPatientId(null);
    setShowCamera(false);
    console.log("🧹 Patient image state cleared");
  };

  const handleImageUpload = (imageUrl) => {
    setPatientImage(imageUrl);
    setShowCamera(false);
    alert("Photo saved successfully!");
  };

  // =======================
  // CAPTURE IMAGE (store blob for later upload)
  // =======================
  const handleCaptureImage = (blob) => {
    // Store the blob for automatic upload after patient is created
    setCapturedImageBlob(blob);
    console.log("📸 Image blob stored for upload");
  };

  // =======================
  // SAVE + CAMERA + AUTO UPLOAD
  // =======================
  const handleSavePatientWithCamera = async () => {
    try {
      // Get the patient ID from the return value (avoids closure issue)
      const patientId = await handleSavePatient();

      if (!patientId) {
        console.error("❌ Patient creation failed - no ID returned");
        return;
      }

      setCurrentPatientId(patientId);

      // ✅ AUTO-UPLOAD IMAGE IF CAPTURED
      if (capturedImageBlob) {
        try {
          console.log("📤 Auto-uploading captured image for patient:", patientId);
          const res = await uploadPatientImage({
            patient_id: patientId,
            file: capturedImageBlob
          });

        if (res.success && res.imageUrl) {
  console.log("✅ Image uploaded automatically:", res.imageUrl);

  setPatientImage(null); // clear preview
  setCapturedImageBlob(null);
  setShowCamera(false);

  alert("Patient created and photo saved successfully!");
} else {
            console.error("❌ Auto-upload failed:", res.error);
            // Ask user if they want to retry
            const retry = window.confirm(
              "Photo upload failed. Would you like to try again?"
            );
            if (retry) {
              // Clear states before reopening camera
              setPatientImage(null);
              setCapturedImageBlob(null);
              setShowCamera(true);
            }
          }
        } catch (err) {
          console.error("❌ Auto-upload error:", err);
          alert("Photo upload failed: " + err.message);
        }
      } else {
        // Fix #1: No image captured - clear preview and show confirmation
        alert("Patient created successfully!");
        setPatientImage(null);
        setCapturedImageBlob(null);
        setShowCamera(false);
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  return {
    showCamera,
    patientImage,
    currentPatientId,

    handleOpenCamera,
    handleCloseCamera,
    handleImageUpload,
    handleCaptureImage,
    handleSavePatientWithCamera,
    clearPatientImage // Expose for form reset
  };
}