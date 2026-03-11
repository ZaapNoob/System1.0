import { useState, useEffect } from "react";
import { searchPatientsForLab, saveLabRequest, updateLabRequest } from "../api/laboratory";

/**
 * Custom hook for managing lab request form
 * @returns {Object} - Lab request state and handlers
 */
export default function useLabRequest() {
  const [step, setStep] = useState(1); // 1: Search, 2: Form, 3: Success
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedLabRequestId, setSavedLabRequestId] = useState(null);
  const [editingLabRequestId, setEditingLabRequestId] = useState(null);

  // -----------------------
  // LIVE SEARCH WITH DEBOUNCING
  // -----------------------
  useEffect(() => {
    // Debounce timer
    const debounceTimer = setTimeout(() => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setError("");
        return;
      }

      // Perform the search
      performSearch(searchQuery);
    }, 300); // 300ms delay before fetching

    return () => clearTimeout(debounceTimer); // Cleanup timer on unmount or query change
  }, [searchQuery]);

  // -----------------------
  // PERFORM SEARCH
  // -----------------------
  const performSearch = async (query) => {
    setLoading(true);
    setError("");

    try {
      const results = await searchPatientsForLab(query);
      setSearchResults(results || []);
      if (results.length === 0) {
        setError("No patients found");
      }
    } catch (err) {
      setError(err.message || "Failed to search patients");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // HANDLE SEARCH (Optional - keep for form submit)
  // -----------------------
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError("Please enter a search query");
      return;
    }

    // Just perform the search directly (debouncing is already done via useEffect)
    await performSearch(searchQuery);
  };

  const handleSelectPatientForm = (patient, setFormData) => {
    setSelectedPatient(patient);
    setStep(2);
    // Update form data with patient ID
    if (setFormData) {
      setFormData((prev) => ({
        ...prev,
        patient_id: patient.id,
      }));
    }
  };

  const handleReset = () => {
    setStep(1);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedPatient(null);
    setError("");
    setSavedLabRequestId(null); // Clear the saved request ID
  };

  const clearSavedLabRequestId = () => {
    setSavedLabRequestId(null);
  };

  const handleGenerateLabRequest = async (
    formData,
    selectedPatient,
    selectedTests,
    user,
    setStep
  ) => {
    try {
      // Validate form data
      if (!formData.diagnosis.trim()) {
        setError("Please enter a diagnosis");
        return null;
      }

      if (selectedTests.length === 0) {
        setError("Please select at least one test");
        return null;
      }

      setLoading(true);
      setError("");

      // Call API to save lab request
      const result = await saveLabRequest(formData, selectedTests, user?.id);

      // Store the saved lab request ID to trigger auto-open
      if (result && result.id) {
        setSavedLabRequestId(result.id);
      }

      // Move to success step
      setStep(3);

      // Return the result so caller can use the ID
      return result;
    } catch (err) {
      setError(err.message || "Failed to save lab request");
      console.error("Error saving lab request:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // EDIT LAB REQUEST
  // -----------------------
  const handleEditLabRequest = (historyItem) => {
    setEditingLabRequestId(historyItem.id);
    // Return history item data to pre-fill form
    return {
      diagnosis: historyItem.diagnosis,
      xray_findings: historyItem.xray_findings,
      utz_findings: historyItem.utz_findings,
      tests: historyItem.tests || []
    };
  };

  // -----------------------
  // UPDATE LAB REQUEST
  // -----------------------
  const handleUpdateLabRequest = async (
    formData,
    selectedTests,
    refreshTrigger,
    setRefreshTrigger
  ) => {
    try {
      // Validate form data
      if (!formData.diagnosis.trim()) {
        setError("Please enter a diagnosis");
        return;
      }

      if (selectedTests.length === 0) {
        setError("Please select at least one test");
        return;
      }

      setLoading(true);
      setError("");

      // Call API to update lab request
      const result = await updateLabRequest(formData, selectedTests);

      if (result) {
        alert("Lab request updated successfully!");
        setEditingLabRequestId(null);
        // Trigger refresh of history
        setRefreshTrigger(refreshTrigger + 1);
      }
    } catch (err) {
      setError(err.message || "Failed to update lab request");
      console.error("Error updating lab request:", err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // CANCEL EDIT
  // -----------------------
  const handleCancelEditLab = () => {
    setEditingLabRequestId(null);
  };

  return {
    step,
    setStep,
    searchQuery,
    setSearchQuery,
    searchResults,
    selectedPatient,
    loading,
    error,
    savedLabRequestId,
    editingLabRequestId,
    handleSearch,
    handleSelectPatientForm,
    handleReset,
    handleGenerateLabRequest,
    clearSavedLabRequestId,
    handleEditLabRequest,
    handleUpdateLabRequest,
    handleCancelEditLab,
  };
}
