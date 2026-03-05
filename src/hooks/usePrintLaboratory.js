import { useState, useEffect } from "react";
import { getLabRequestDetails } from "../api/laboratory";

/**
 * Custom hook to handle lab request printing
 * @returns {Object} - { labRequestData, loading, error, openLabPrintPreview }
 */
export const usePrintLaboratory = () => {
  const [labRequestData, setLabRequestData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const openLabPrintPreview = (labRequestId) => {
    // Store the lab request ID in sessionStorage
    sessionStorage.setItem("printLabRequestId", labRequestId);
    // Open in new tab/window
    window.open("/print-laboratory", "PrintLaboratory");
  };

  const fetchLabRequest = async (labRequestId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLabRequestDetails(labRequestId);
      setLabRequestData(data);
      return data;
    } catch (err) {
      console.error("Error fetching lab request:", err);
      setError(err.message || "Failed to fetch lab request");
      setLabRequestData(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    labRequestData,
    loading,
    error,
    openLabPrintPreview,
    fetchLabRequest,
  };
};
