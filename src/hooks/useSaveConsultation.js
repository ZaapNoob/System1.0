import { useState } from "react";
import { saveConsultation } from "../api/consultation";

/**
 * Custom hook for saving consultation data
 * Handles:
 * - Preparing consultation data
 * - Saving to database via API
 * - Loading and error states
 * - Success callback
 *
 * @param {function} onClose - Callback to close modal after successful save
 * @param {array} doctors - Array of doctor objects for lookup
 *
 * @returns {object} { loading, error, success, handleSaveConsultation, setSuccess }
 */
export const useSaveConsultation = (onClose, doctors = []) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Save consultation data to database
   * @param {object} patient - Patient object with id, patient_id, doctor_id
   * @param {object} formData - Form data to save
   */
  const handleSaveConsultation = async (patient, formData) => {
    try {
      setLoading(true);
      setError(null);

      // Prepare data for API
      const consultationData = {
        queue_id: patient.id,
        patient_id: patient.patient_id,
        physician: formData.physician || null,  // ✅ Use selected physician from form
        referral: formData.referral || null,
        referredTo: formData.referredTo || null,
        reasonForReferral: formData.reasonForReferral || null,
        referredBy: formData.referredBy || null,
        purpose: formData.purpose || null,
        nature: formData.nature || null,
        visitDate: formData.visitDate || null,
        systolic: formData.systolic || null,
        diastolic: formData.diastolic || null,
        temperature: formData.temperature || null,
        pulse: formData.pulse || null,
        respiratory: formData.respiratory || null,
        oxygen: formData.oxygen || null,
        weight: formData.weight || null,
        height: formData.height || null,
        chiefComplaint: formData.chiefComplaint || null,
      };

      // ✅ Save to database
      const response = await saveConsultation(consultationData);
      setSuccess(true);

      // ✅ Lookup physician name from ID
      const selectedDoctor = doctors.find(doc => doc.id === parseInt(formData.physician));
      const physicianName = selectedDoctor?.name || selectedDoctor?.full_name || formData.physician || "";

      // ✅ Prepare data for print page with all patient fields preserved
      const printData = {
        ...patient,
        ...consultationData,
        created_at: new Date().toISOString(),
        complaint: formData.chiefComplaint,
        systolic_bp: formData.systolic,
        diastolic_bp: formData.diastolic,
        heart_rate: formData.pulse,
        respiratory_rate: formData.respiratory,
        oxygen_saturation: formData.oxygen,
        attending_physician: physicianName,
        // ✅ Explicitly preserve address fields
        street: patient?.street || "",
        barangay_name: patient?.barangay_name || "",
        city_municipality: patient?.city_municipality || "",
        province: patient?.province || "",
        purok_name: patient?.purok_name || "",
        barangay_name_db: patient?.barangay_name_db || "",
        is_special: patient?.is_special || 0,
        old_health_record_no: patient?.old_health_record_no || "",
        patient_code: patient?.patient_code || "",
        autoprint: true,
      };

      // ✅ Store in sessionStorage
      sessionStorage.setItem("printPatient", JSON.stringify(printData));

      // ✅ Open print page
      window.open("/print-opd", "_blank");

      // Close modal
      onClose();
    } catch (err) {
      setError(err.message);
      console.error("Failed to save consultation:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    handleSaveConsultation,
    setSuccess,
  };
};
