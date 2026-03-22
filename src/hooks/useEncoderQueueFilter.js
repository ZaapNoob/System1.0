import { useState, useMemo } from "react";

/**
 * Custom hook for filtering encoder queue by search term only
 * (Date filtering is now handled by API - pass queue_date parameter to fetch the correct date)
 * @param {Array} encoderQueue - The encoder queue data to filter
 * @returns {Object} - { search, setSearch, filteredQueue }
 */
export const useEncoderQueueFilter = (encoderQueue) => {
  const [search, setSearch] = useState("");

  // Memoized filtered queue to prevent unnecessary recalculations
  const filteredQueue = useMemo(() => {
    return encoderQueue.filter((patient) => {
      // Filter by search term (patient name or queue number)
      const matchesSearch =
        search === "" ||
        patient.patient_name.toLowerCase().includes(search.toLowerCase()) ||
        String(patient.queue_number).toLowerCase().includes(search.toLowerCase());

      return matchesSearch;
    });
  }, [encoderQueue, search]);

  return {
    search,
    setSearch,
    filteredQueue,
  };
};
