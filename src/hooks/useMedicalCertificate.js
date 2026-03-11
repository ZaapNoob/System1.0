import { useState, useEffect } from 'react';
import { searchPatientsQueue, saveMedicalCertificate, getCertificateDetails, updateMedicalCertificate } from '../api/patients';

export default function useMedicalCertificate() {
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingCertificateId, setEditingCertificateId] = useState(null);

  // -----------------------
  // LIVE SEARCH WITH DEBOUNCING
  // -----------------------
  useEffect(() => {
    // Debounce timer
    const debounceTimer = setTimeout(() => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setError('');
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
    setError('');
    setSearchResults([]);

    try {
      const response = await searchPatientsQueue(0, query);

      if (response?.success && Array.isArray(response.patients) && response.patients.length > 0) {
        setSearchResults(response.patients);
      } else {
        setError('No patient found.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Error fetching patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // HANDLE SEARCH (Optional - keep for form submit)
  // -----------------------
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Just perform the search directly (debouncing is already done via useEffect)
    await performSearch(searchQuery);
  };

  // -----------------------
  // SELECT PATIENT FROM SEARCH RESULTS
  // -----------------------
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setStep(2); // move to Certificate Details
  };

  // -----------------------
  // HANDLE FORM CHANGES
  // -----------------------
  // handleChange is now managed in Medical.jsx

  // -----------------------
  // HANDLE FORM SUBMIT
  // -----------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPatient) return alert('Please select a patient first.');
    setStep(3);
  };

  // -----------------------
  // RESET FORM & SEARCH
  // -----------------------
  const handleReset = () => {
    setSelectedPatient(null);
    setSearchQuery('');
    setSearchResults([]);
    setStep(1);
    setError('');
    // formData reset is handled in Medical.jsx
  };

  // -----------------------
  // SELECT PATIENT
  // -----------------------
  const handleSelectPatientForm = async (patient, setFormData) => {
    handleSelectPatient(patient);
    setFormData((prev) => ({ ...prev, patient_id: patient.id }));
  };

  // -----------------------
  // GENERATE & SAVE CERTIFICATE
  // -----------------------
  const handleGenerateCertificate = async (formData, selectedPatient, user, setStep) => {
    // Validate form data
    if (!formData.impression.trim()) {
      alert('Please enter clinical impression');
      return;
    }
    if (!formData.remarks.trim()) {
      alert('Please enter clinical remarks');
      return;
    }
    if (!selectedPatient) {
      alert('Please select a patient');
      return;
    }

    try {
      const certificatePayload = {
        certificate_no: formData.certificate_no,
        patient_id: selectedPatient.id,
        doctor_id: user?.id || 1, // Get doctor ID from user object
        impression: formData.impression,
        remarks: formData.remarks,
      };

      const response = await saveMedicalCertificate(certificatePayload);

      if (response?.success) {
        const certificateId = response?.data?.id;
        
        // Store certificate ID in sessionStorage to fetch in new tab
        if (certificateId) {
          sessionStorage.setItem('printCertificateId', certificateId);
          // Open print page in new tab
          window.open('/printing/medical', '_blank');
        }
        
        alert('Medical certificate saved successfully!');
        setStep(3); // Move to success step
      } else {
        alert('Error saving certificate: ' + (response?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving certificate:', error);
      alert('Failed to save certificate. Please try again.');
    }
  };

  // -----------------------
  // EDIT CERTIFICATE
  // -----------------------
  const handleEditCertificate = (historyItem) => {
    setEditingCertificateId(historyItem.id);
    // Pre-fill form with history data
    return {
      certificate_no: historyItem.certificate_no,
      impression: historyItem.impression,
      remarks: historyItem.remarks,
    };
  };

  // -----------------------
  // UPDATE CERTIFICATE
  // -----------------------
  const handleUpdateCertificate = async (formData, refreshTrigger, setRefreshTrigger) => {
    if (!formData.impression.trim()) {
      alert('Please enter clinical impression');
      return;
    }
    if (!formData.remarks.trim()) {
      alert('Please enter clinical remarks');
      return;
    }

    try {
      const updatePayload = {
        id: editingCertificateId,
        impression: formData.impression,
        remarks: formData.remarks,
      };

      const response = await updateMedicalCertificate(updatePayload);

      if (response?.success) {
        alert('Medical certificate updated successfully!');
        setEditingCertificateId(null);
        // Trigger refresh of history
        setRefreshTrigger(refreshTrigger + 1);
      } else {
        alert('Error updating certificate: ' + (response?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating certificate:', error);
      alert('Failed to update certificate. Please try again.');
    }
  };

  // -----------------------
  // CANCEL EDIT
  // -----------------------
  const handleCancelEdit = () => {
    setEditingCertificateId(null);
  };

  return {
    // State
    step,
    setStep,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    selectedPatient,
    setSelectedPatient,
    loading,
    error,
    editingCertificateId,

    // Handlers
    handleSearch,
    handleSelectPatient,
    handleSelectPatientForm,
    handleSubmit,
    handleReset,
    handleGenerateCertificate,
    handleEditCertificate,
    handleUpdateCertificate,
    handleCancelEdit,
  };
}
