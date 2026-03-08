import { useState } from "react";
import { saveConsultation } from "../api/consultation";

/**
 * Custom hook for saving consultation data without printing
 * Handles:
 * - Preparing consultation data
 * - Saving to database via API
 * - Loading and error states
 * - Success callback
 *
 * @param {function} onClose - Callback to close modal after successful save
 * @param {function} onConsultationSaved - Callback to trigger refresh
 *
 * @returns {object} { loading, error, success, handleSaveConsultation }
 */
export const useSaveConsultationOnly = (onClose, onConsultationSaved) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Save consultation data to database without printing
   * @param {object} patient - Patient object with id, patient_id
   * @param {object} formData - Form data to save
   */
  const handleSaveConsultationOnly = async (patient, formData) => {
    try {
      setLoading(true);
      setError(null);

      // Prepare data for API
      const consultationData = {
        queue_id: patient.id || null,
        patient_id: patient.patient_id || patient.id,
        physician: formData.physician || null,
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
        diagnosis: formData.diagnosis || null,
        treatment: formData.treatment || null,
        patientIllness: formData.patientIllness || null,
      };

      // ✅ Save to database
      const response = await saveConsultation(consultationData);
      
      if (response.success) {
        setSuccess(true);
        
        // Close modal after successful save
        setTimeout(() => {
          onClose();
          if (onConsultationSaved) onConsultationSaved();
        }, 1000);
      } else {
        throw new Error(response.message || "Failed to save consultation");
      }
    } catch (err) {
      setError(err.message || "Failed to save consultation");
      console.error("Failed to save consultation:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    handleSaveConsultationOnly,
  };
};
