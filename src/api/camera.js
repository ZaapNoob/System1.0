import API from "../config/api";
import { apiFetch } from "../utils/api";

export const uploadPatientImage = async ({ patient_id, file }) => {
  // Create FormData for multipart/form-data
  const formData = new FormData();
  formData.append("patient_id", patient_id);
  formData.append("file", file, `patient_${patient_id}_${Date.now()}.jpg`);

  // apiFetch wrapper for multipart/form-data
  return apiFetch(`${API}/camera/upload.php`, {
    method: "POST",
    body: formData,
  });
};