import { useState, useEffect } from "react";
import { getVitalSigns } from "../api/consultation";

/**
 * Custom hook for fetching and auto-filling vital signs
 * Handles:
 * - Fetching vital signs from queue
 * - Auto-filling form with vital sign data
 * - Loading and error states
 *
 * @param {object} patient - Patient object with id
 * @param {function} setFormData - State setter for form data
 *
 * @returns {object} { loading, error, fetchAndFillVitalSigns }
 */
export const useFetchVitals = (patient, setFormData) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch vital signs from queue and auto-fill the form
   */
  const fetchAndFillVitalSigns = async () => {
    if (!patient?.id) return;

    try {
      setLoading(true);
      setError(null);
      const vitals = await getVitalSigns(patient.id);

      // Map API response to form fields
      setFormData((prev) => ({
        ...prev,
        systolic: vitals.systolic_bp || "",
        diastolic: vitals.diastolic_bp || "",
        temperature: vitals.temperature || "",
        pulse: vitals.heart_rate || "",
        respiratory: vitals.respiratory_rate || "",
        oxygen: vitals.oxygen_saturation || "",
        weight: vitals.weight || "",
        height: vitals.height || "",
      }));
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch vital signs:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Auto-fill vital signs when patient changes
   */
  useEffect(() => {
    if (patient?.id) {
      fetchAndFillVitalSigns();
    }
  }, [patient?.id]);

  return {
    loading,
    error,
    fetchAndFillVitalSigns,
  };
};
