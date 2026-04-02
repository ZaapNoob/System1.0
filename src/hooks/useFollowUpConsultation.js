import { useState, useEffect } from "react";
import { getLatestConsultations } from "../api/consultation";

/**
 * Custom hook to fetch latest consultation and auto-fill follow-up data
 * Handles:
 * - Fetching the most recent consultation for a patient
 * - Auto-filling vital signs when "Follow-up Consultation" is selected
 * - Auto-filling chief complaint from previous consultation
 *
 * @param {object} patient - Patient object with id
 * @param {function} setFormData - State setter for form data
 * @param {string} nature - Current nature of visit (must be "Follow-up Consultation")
 *
 * @returns {object} { latestConsultation, loading, error }
 */
export const useFollowUpConsultation = (patient, setFormData, nature) => {
  const [latestConsultation, setLatestConsultation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch latest consultation and auto-fill form if follow-up
   */
  useEffect(() => {
    const fetchAndFillFollowUp = async () => {
      // Prioritize patient.patient_id (actual patient ID) over patient.id (queue ID)
      const patientId = patient?.patient_id || patient?.id;
      
      if (!patientId || nature !== "Follow-up Consultation") {
        console.log('🔍 useFollowUpConsultation - Skipping:', { patientId, nature });
        return;
      }

      try {
        console.log('🔍 useFollowUpConsultation - Fetching with patientId:', patientId);
        setLoading(true);
        setError(null);

        // Fetch all consultations
        const consultations = await getLatestConsultations(patientId);

        if (consultations && consultations.length > 0) {
          const latest = consultations[0]; // Most recent consultation
          setLatestConsultation(latest);
          console.log('✅ useFollowUpConsultation - Found latest:', latest);

          // Auto-fill form with latest consultation data
          setFormData((prev) => ({
            ...prev,
            // Vital Signs from previous consultation
            systolic: latest.systolic_bp || "",
            diastolic: latest.diastolic_bp || "",
            temperature: latest.temperature || "",
            pulse: latest.pulse_rate || "",
            respiratory: latest.respiratory_rate || "",
            oxygen: latest.oxygen_saturation || "",
            weight: latest.weight || "",
            height: latest.height || "",
            // Chief Complaint from previous consultation
            chiefComplaint: latest.chief_complaint || "",
          }));
        } else {
          console.warn('⚠️ useFollowUpConsultation - No consultations found for patientId:', patientId);
          setLatestConsultation(null);
          setError("No previous consultation found for this patient");
        }
      } catch (err) {
        console.error("❌ useFollowUpConsultation - Error:", err);
        setError(err.message || "Failed to load previous consultation data");
      } finally {
        setLoading(false);
      }
    };

    fetchAndFillFollowUp();
  }, [patient?.patient_id, patient?.id, nature, setFormData]);

  return {
    latestConsultation,
    loading,
    error,
  };
};