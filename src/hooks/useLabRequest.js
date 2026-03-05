import { useState } from "react";
import { searchPatientsForLab, saveLabRequest } from "../api/laboratory";

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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const results = await searchPatientsForLab(searchQuery);
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
    handleSearch,
    handleSelectPatientForm,
    handleReset,
    handleGenerateLabRequest,
    clearSavedLabRequestId,
  };
}
