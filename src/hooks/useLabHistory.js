import { useState, useEffect } from "react";
import { getLabHistory } from "../api/laboratory";

/**
 * Custom hook to fetch laboratory request history for a patient
 * @param {number} patient_id - Patient ID
 * @param {number} refreshTrigger - External trigger to refetch (optional)
 * @returns {Object} - { labHistory, loadingHistory }
 */
export const useLabHistory = (patient_id, refreshTrigger = 0) => {
  const [labHistory, setLabHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (patient_id) {
      setLoadingHistory(true);
      getLabHistory(patient_id)
        .then((data) => {
          setLabHistory(data || []);
        })
        .catch((err) => {
          console.error("Error loading lab history:", err);
          setLabHistory([]);
        })
        .finally(() => setLoadingHistory(false));
    } else {
      setLabHistory([]);
    }
  }, [patient_id, refreshTrigger]);

  return { labHistory, loadingHistory };
};
