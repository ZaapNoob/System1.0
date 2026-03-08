
import { useState } from "react";
import { uploadPatientImage } from "../../api/camera";

export default function useCameraUpload(capturedImage, patientId, onUpload) {
  const [isLoading, setIsLoading] = useState(false);

  const uploadImage = async () => {
    if (!capturedImage) {
      alert("No image to upload");
      return;
    }
    if (!patientId) {
      alert("Patient ID missing. Save patient first.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await uploadPatientImage({ patient_id: patientId, file: capturedImage });

      if (res.success && res.imageUrl) {
        alert("Image uploaded successfully!");
        if (onUpload) onUpload(res.imageUrl);
      } else {
        alert("Upload failed: " + (res.error || "Unknown error"));
      }
    } catch (err) {
      alert("Upload error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, uploadImage };
}