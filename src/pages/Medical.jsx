import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './medical.css';
import useMedicalCertificate from '../hooks/useMedicalCertificate';
import { useMedicalHistory } from "../hooks/useMedicalHistory";
export default function Medical({ user, onNavigateToProfile, allowedPages, onNavigate, handleLogout }) {
  const {
    step,
    setStep,
    searchQuery,
    setSearchQuery,
    searchResults,
    selectedPatient,
    loading,
    error,
    handleSearch,
    handleSelectPatient,
    handleSelectPatientForm,
    handleSubmit,
    handleReset,
    handleGenerateCertificate,
  } = useMedicalCertificate();

  const [formData, setFormData] = useState({
    certificate_no: `MC-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`,
    patient_id: '',
    purpose: 'medical_leave',
    purpose_other: '',
    impression: '',
    remarks: '',
  });

const { medicalHistory, loadingHistory } =
  useMedicalHistory(selectedPatient?.id);



  const handleResetForm = () => {
    handleReset();
    setFormData({
      certificate_no: `MC-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`,
      patient_id: '',
      purpose: 'medical_leave',
      purpose_other: '',
      impression: '',
      remarks: '',
    });
  };

  return (
    <div className="dashboard-container">
      <Sidebar allowedPages={allowedPages} currentPage="medical" onNavigate={onNavigate} />

      <div className="dashboard-content">
        {/* HEADER */}
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Medical Certificate</h1>
            <div className="user-info" onClick={onNavigateToProfile} style={{ cursor: 'pointer' }}>
              <div className="user-avatar-icon">👤</div>
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="user-role">{user?.role || 'Member'}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </header>

        {/* MAIN */}
<main className={`dashboard-main ${step === 2 ? 'full-width' : ''}`}>          {/* LEFT PANEL */}
          <div className="left-panel">
            {step === 1 && (
              <div className="welcome-section">
                <div className="welcome-card">
                  <h2>Search Patient</h2>
                  <p>Enter a patient name or ID to begin generating a medical certificate.</p>
                </div>

                <form onSubmit={handleSearch}>
                  <div className="search-input-group">
                    <input
                      type="text"
                      className="search-input-new"
                      placeholder="Search by name or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="search-submit-btn" disabled={loading}>
                      {loading ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                  {error && <div style={{ color: 'red', marginTop: '6px' }}>{error}</div>}
                </form>

                {/* SHOW SEARCH RESULTS */}
                {searchResults.length > 0 && (
            <div className="search-results">
  <h3>Select Patient:</h3>
  <ul>
    {searchResults.map((patient) => (
      <li key={patient.id}>
        <div className="patient-line">
          <span className="patient-name">{patient.name}</span>
          <span className="patient-code">({patient.patient_code})</span>
        </div>
        <button onClick={() => handleSelectPatientForm(patient, setFormData)}>Select</button>
      </li>
    ))}
  </ul>
</div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="welcome-section">
                <div className="welcome-card">
                  <div className="success-badge">✓ Success</div>
                  <h2>Certificate Generated</h2>
                  <p>The medical certificate has been successfully prepared and is ready.</p>
                </div>

                <button className="btn-outline" onClick={handleResetForm}>
                  + Create New Certificate
                </button>
              </div>
            )}
        </div>
                  <div className="right-panel">
  {step === 2 && selectedPatient && (
    <div className="certificate-container">
      
     

      {/* Details below / right */}
      <div className="right-split-layout">

        {/* LEFT SIDE - Certificate Details */}
        <div className="stats-section">
          <div className="stats-section-header">
            <h2>Certificate Details</h2>
            <button
              type="button"
              className="back-button1"
              onClick={handleResetForm}
            >
              ← Back
            </button>
          </div>

          {/* Patient Card */}
          <div className="stat-card">
            <div className="stat-icon-wrapper blue">👤</div>
            <div className="stat-content">
              <h3>Patient</h3>
              <div className="stat-number">{selectedPatient.name}</div>
            </div>
          </div>

          {/* Impression */}
          <div className="stat-card">
            <div className="stat-icon-wrapper green"></div>
            <div className="stat-content">
              <h3>Clinical Impression</h3>
              <textarea
                name="impression"
                value={formData.impression}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    [e.target.name]: e.target.value
                  }))
                }
                placeholder="Enter diagnosis or clinical impression..."
                required
              />
            </div>
          </div>

          {/* Remarks */}
          <div className="stat-card">
            <div className="stat-icon-wrapper purple"></div>
            <div className="stat-content">
              <h3>Clinical Remarks</h3>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    [e.target.name]: e.target.value
                  }))
                }
                placeholder="Enter additional medical remarks..."
                required
              />
            </div>
          </div>

          <button
            className="btn-primary-lg"
            onClick={() =>
              handleGenerateCertificate(
                formData,
                selectedPatient,
                user,
                setStep
              )
            }
          >
            Generate Certificate →
          </button>
        </div>

        {/* RIGHT SIDE - Preview Panel */}
 {/* RIGHT SIDE - Preview Panel */}
<div className="stats-section">
  <div className="stats-section-header">
    <h2>Preview</h2>
  </div>

  <div className="stat-card2">
    <div className="stat-content">

      {loadingHistory && (
        <p style={{ color: '#718096' }}>Loading history...</p>
      )}

      {!loadingHistory && medicalHistory.length === 0 && (
        <p style={{ color: '#718096' }}>
          No medical certificate history.
        </p>
      )}

     {!loadingHistory && medicalHistory.length > 0 && (
  <ul className="medical-history-list">
    {medicalHistory.map((item) => (
      <li key={item.id} className="medical-history-item">

        <div className="history-row">

          <div className="history-info">
            <div>
              <strong>{item.certificate_no}</strong>
            </div>

            <div style={{ fontSize: "12px", color: "#666" }}>
              {item.issued_at}
            </div>

            <div style={{ fontSize: "13px" }}>
              {item.impression}
            </div>

            <div style={{ fontSize: "12px", color: "#888" }}>
              Dr. {item.doctor_name || "N/A"}
            </div>
          </div>

          {/* ✅ PRINT BUTTON */}
          <button
            type="button"
            className="history-print-btn"
            onClick={() => {
              sessionStorage.setItem(
                "printCertificateId",
                item.id
              );
              window.open("/printing/medical", "_blank");
            }}
            title="Print certificate"
          >
            🖨️
          </button>

        </div>
      </li>
    ))}
  </ul>
)}

    </div>
  </div>
</div>

      </div>
    </div>
  )}
</div>
       
        </main>
      </div>
    </div>
  );
}