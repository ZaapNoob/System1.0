import { useState, useEffect } from "react";
import { getMedicalHistory } from "../api/patients";

export const useMedicalHistory = (patient_id, refreshTrigger = 0) => {

  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {

    if (!patient_id) {
      setMedicalHistory([]);
      return;
    }

    setLoadingHistory(true);

    getMedicalHistory(patient_id)
      .then((res) => {
        if (res?.success) {
          setMedicalHistory(res.data || []);
        } else {
          setMedicalHistory([]);
        }
      })
      .catch((err) => {
        console.error("❌ Error loading medical history:", err);
        setMedicalHistory([]);
      })
      .finally(() => setLoadingHistory(false));

  }, [patient_id, refreshTrigger]);

  return { medicalHistory, loadingHistory };
};