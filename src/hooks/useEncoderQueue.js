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
    
    // Get LOCAL date (not UTC) to avoid timezone offset issues
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const localDate = `${year}-${month}-${day}`;
    
    console.log('🧾 [ENCODER-INIT] Initialized date:', localDate, '(System date:', today.toDateString(), ')');
    return localDate;
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
        console.log('🧾 [ENCODER-FETCH] Requesting URL:', url);
        const response = await fetch(url, {
          method: "GET",
          credentials: "include"
        });

        const data = await response.json();
        console.log('🧾 [ENCODER-RESPONSE] API Response:', data);

        if (data.success && Array.isArray(data.data)) {
          console.log('🧾 [ENCODER-SUCCESS] Fetched', data.data.length, 'patients for date:', encoderFilterDate);
          console.log('🧾 [ENCODER-DATA] Patient details:', data.data.map(p => ({
            name: p.patient_name,
            queue_num: p.queue_number,
            status: p.status,
            has_consultation: p.has_consultation,
            queue_date: p.queue_date
          })));
          setEncoderQueue(data.data);
        } else {
          console.warn('🧾 [ENCODER-ERROR] No data or success=false:', data.message);
          setEncoderQueue([]);
          setError(data.message || "Failed to fetch encoder queue");
        }
      } catch (err) {
        console.error("🧾 [ENCODER-CATCH] Error fetching encoder queue:", err);
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
