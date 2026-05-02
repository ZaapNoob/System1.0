import { useState, useEffect } from "react";
import API from "../config/api";

/**
 * useEncoderStats Hook
 * Fetches statistics for encoders - counts consultations by encoded_by
 * Returns:
 * - overallEncoded: Total consultations encoded by this encoder
 * - todayEncoded: Consultations encoded today
 */
export const useEncoderStats = (encoderId) => {
  const [stats, setStats] = useState({
    overallEncoded: 0,
    todayEncoded: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!encoderId) {
      setStats({ overallEncoded: 0, todayEncoded: 0 });
      return;
    }

    const fetchEncoderStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API}/consultation/encoder-stats.php?encoded_by=${encoderId}`
        );
        const data = await response.json();

        if (data.success) {
          setStats({
            overallEncoded: data.data?.overallEncoded || 0,
            todayEncoded: data.data?.todayEncoded || 0
          });
        } else {
          console.error("❌ [EncoderStats] API Error:", data.message);
          setError(data.message);
        }
      } catch (err) {
        console.error("❌ [EncoderStats] Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEncoderStats();
  }, [encoderId]);

  return { stats, loading, error };
};
