import { useState, useEffect } from "react";

/**
 * Hook to fetch completed patients for the current user
 * @param {number} userId - Current user ID
 * @param {number} refreshTrigger - External trigger to refetch
 * @returns {Object} - { completedPatients, loadingCompleted }
 */
export const useCompletedPatients = (userId, refreshTrigger = 0) => {
  const [completedPatients, setCompletedPatients] = useState([]);
  const [loadingCompleted, setLoadingCompleted] = useState(false);

  useEffect(() => {
    if (!userId) return;

    setLoadingCompleted(true);
    fetch(`/api/Queue/get-completed-patients.php?user_id=${userId}`)
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
  }, [userId, refreshTrigger]);

  return { completedPatients, loadingCompleted };
};
