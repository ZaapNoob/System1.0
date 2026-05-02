import { useState, useEffect } from "react";

/**
 * Hook to fetch doctor statistics
 * @param {number} doctorId - Doctor ID
 * @param {number} refreshTrigger - External trigger to refetch
 * @returns {Object} - { stats, loading, error }
 */
export const useDoctorStats = (doctorId, refreshTrigger = 0) => {
  const [stats, setStats] = useState({
    overallCompleted: 0,
    todayCompleted: 0,
    waiting: 0,
    inProgress: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!doctorId) return;

    setLoading(true);
    setError(null);

    fetch(`/api/Queue/doctor-stats.php?doctor_id=${doctorId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.data);
        } else {
          setError(data.message || "Failed to fetch stats");
        }
      })
      .catch((err) => {
        console.error("❌ Error loading doctor stats:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [doctorId, refreshTrigger]);

  return { stats, loading, error };
};
