import { useState, useEffect } from "react";
import { fetchQueueStats, fetchDoctorStats } from "../api/queue";

/**
 * useQueueStats Hook
 * Fetches dashboard statistics for the logged-in user
 * - If user is a doctor: fetches from doctor_patient_queue table
 * - Otherwise: fetches from patient_queue table (triage staff, etc)
 * Returns: overall completed, today completed, waiting, in progress
 */
export const useQueueStats = (user) => {
  const [stats, setStats] = useState({
    overallCompleted: 0,
    todayCompleted: 0,
    waiting: 0,
    inProgress: 0,
    cancelled: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch stats on component mount and when user changes
  useEffect(() => {
    if (!user?.id) return;

    const loadStats = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;

        // 🩺 If user is a doctor, fetch from doctor_patient_queue
        if (user?.role === "doctor") {
          console.log('📊 [useQueueStats] Fetching doctor stats for doctor_id:', user.id);
          response = await fetchDoctorStats(user.id);
        } else {
          // Otherwise fetch from patient_queue (for triage staff, etc)
          console.log('📊 [useQueueStats] Fetching triage stats for user_id:', user.id);
          response = await fetchQueueStats(user.id);
        }

        if (response?.success && response?.data) {
          setStats(response.data);
          console.log('✅ [useQueueStats] Stats loaded:', response.data);
        } else {
          setError("Failed to fetch statistics");
        }
      } catch (err) {
        console.error("❌ [useQueueStats] Error fetching stats:", err);
        setError(err.message || "Error loading stats");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user?.id, user?.role]);

  // Function to manually refresh stats (useful for real-time updates)
  const refreshStats = async () => {
    if (!user?.id) return;

    try {
      let response;

      if (user?.role === "doctor") {
        response = await fetchDoctorStats(user.id);
      } else {
        response = await fetchQueueStats(user.id);
      }

      if (response?.success && response?.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("❌ [useQueueStats] Error refreshing stats:", err);
    }
  };

  return {
    stats,
    loading,
    error,
    refreshStats
  };
};
