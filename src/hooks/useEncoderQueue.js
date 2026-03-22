import { useState, useEffect } from "react";
import API from "../config/api";

/**
 * Custom hook for fetching encoder queue with date filtering
 * Fetches DONE patients for the selected date from API only
 * Bypasses WebSocket to allow proper date filtering
 *
 * @param {string} initialDate - Optional initial date (YYYY-MM-DD). Defaults to today.
 * @returns {Object} - { encoderQueue, encoderFilterDate, setEncoderFilterDate }
 */
export const useEncoderQueue = (initialDate = null) => {
  const [encoderFilterDate, setEncoderFilterDate] = useState(() => {
    // Initialize with provided date or today's date in YYYY-MM-DD format
    if (initialDate) return initialDate;
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [encoderQueue, setEncoderQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEncoderQueue = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${API}/consultation/encoder/get-encoder-queue.php?queue_date=${encoderFilterDate}`;
        const response = await fetch(url, {
          method: "GET",
          credentials: "include"
        });

        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          setEncoderQueue(data.data);
        } else {
          setEncoderQueue([]);
          setError(data.message || "Failed to fetch encoder queue");
        }
      } catch (err) {
        console.error("Error fetching encoder queue:", err);
        setEncoderQueue([]);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately when date changes
    fetchEncoderQueue();

    // Set up polling interval (15 seconds)
    const interval = setInterval(fetchEncoderQueue, 15000);

    return () => clearInterval(interval);
  }, [encoderFilterDate]);

  return {
    encoderQueue,
    encoderFilterDate,
    setEncoderFilterDate,
    loading,
    error
  };
};
