import { useState, useEffect } from "react";
import { getLatestConsultations } from "../api/consultation";

/**
 * Custom hook to fetch consultation history for a patient
 * @param {number} patient_id - Patient ID
 * @param {number} refreshTrigger - External trigger to refetch (optional). Increment to trigger refresh
 * @returns {Object} - { consultHistory, loadingHistory }
 * 
 * @example
 * const { consultHistory, loadingHistory } = useConsultationHistory(patientId, refreshTrigger);
 */
export const useConsultationHistory = (patient_id, refreshTrigger = 0) => {
  const [consultHistory, setConsultHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    console.log('🎣 useConsultationHistory - Hook triggered with patient_id:', patient_id, 'Type:', typeof patient_id);
    if (patient_id) {
      setLoadingHistory(true);
      getLatestConsultations(patient_id)
        .then((data) => {
          console.log('✅ useConsultationHistory - Data received:', data);
          console.log('📊 Total consultations loaded:', data?.length || 0);
          setConsultHistory(data || []);
        })
        .catch((err) => {
          console.error("❌ Error loading consultation history:", err);
          console.error("Patient ID that failed:", patient_id);
          setConsultHistory([]);
        })
        .finally(() => setLoadingHistory(false));
    } else {
      console.warn('⚠️  useConsultationHistory - patient_id is missing or falsy:', patient_id);
      setConsultHistory([]);
    }
  }, [patient_id, refreshTrigger]);

  return { consultHistory, loadingHistory };
};
