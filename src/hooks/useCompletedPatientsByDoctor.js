import { useState, useEffect } from "react";

/**
 * Hook to fetch completed patients for a specific doctor
 * @param {number} doctorId - Doctor ID to filter by
 * @param {number} refreshTrigger - External trigger to refetch
 * @returns {Object} - { completedPatients, todayCompletedPatients, loadingCompleted, loadingToday }
 */
export const useCompletedPatientsByDoctor = (doctorId, refreshTrigger = 0) => {
  const [completedPatients, setCompletedPatients] = useState([]);
  const [todayCompletedPatients, setTodayCompletedPatients] = useState([]);
  const [loadingCompleted, setLoadingCompleted] = useState(false);
  const [loadingToday, setLoadingToday] = useState(false);

  useEffect(() => {
    if (!doctorId) return;

    // Fetch all completed patients
    setLoadingCompleted(true);
    fetch(`/api/Queue/get-completed-patients.php?doctor_id=${doctorId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCompletedPatients(data.data || []);
        }
      })
      .catch((err) => {
        console.error("❌ Error loading completed patients:", err);
        setCompletedPatients([]);
      })
      .finally(() => setLoadingCompleted(false));

    // Fetch today's completed patients
    setLoadingToday(true);
    fetch(`/api/Queue/get-completed-patients-today.php?doctor_id=${doctorId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTodayCompletedPatients(data.data || []);
        }
      })
      .catch((err) => {
        console.error("❌ Error loading today's completed patients:", err);
        setTodayCompletedPatients([]);
      })
      .finally(() => setLoadingToday(false));
  }, [doctorId, refreshTrigger]);

  return {
    completedPatients,
    todayCompletedPatients,
    loadingCompleted,
    loadingToday,
    completedCount: completedPatients.length,
    todayCompletedCount: todayCompletedPatients.length
  };
};
