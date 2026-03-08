import { useState, useMemo } from "react";

/**
 * Custom hook for filtering encoder queue by search term and date
 * @param {Array} encoderQueue - The encoder queue data to filter
 * @returns {Object} - { search, setSearch, filterDate, setFilterDate, filteredQueue }
 */
export const useEncoderQueueFilter = (encoderQueue) => {
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Memoized filtered queue to prevent unnecessary recalculations
  const filteredQueue = useMemo(() => {
    return encoderQueue.filter((patient) => {
      // Filter by search term (patient name or queue number)
      const matchesSearch =
        search === "" ||
        patient.patient_name.toLowerCase().includes(search.toLowerCase()) ||
        String(patient.queue_number).toLowerCase().includes(search.toLowerCase());

      // Filter by date (queue date or visit date)
      const matchesDate =
        filterDate === "" ||
        patient.queue_date === filterDate ||
        patient.visit_date === filterDate;

      return matchesSearch && matchesDate;
    });
  }, [encoderQueue, search, filterDate]);

  return {
    search,
    setSearch,
    filterDate,
    setFilterDate,
    filteredQueue,
  };
};
