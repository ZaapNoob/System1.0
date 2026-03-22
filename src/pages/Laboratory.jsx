import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import "./laboratory.css"; // you can rename later if you want
import useLabRequest from "../hooks/useLabRequest";
import { useLabHistory } from "../hooks/useLabHistory";
import { usePrintLaboratory } from "../hooks/usePrintLaboratory";
import { usePatientImage } from "../hooks/image display/usePatientImage";
import { DEFAULT_AVATAR } from "../utils/image";

export default function LabRequest({
  user,
  onNavigateToProfile,
  allowedPages,
  onNavigate,
  handleLogout,
}) {
  const {
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
    printPreviewId,
    updateSuccess,
    handleSearch,
    handleSelectPatientForm,
    handleReset,
    handleGenerateLabRequest,
    clearSavedLabRequestId,
    handleEditLabRequest,
    handleUpdateLabRequest,
    handleCancelEditLab,
    clearPrintPreviewId,
    clearUpdateSuccess,
  } = useLabRequest();

  const { openLabPrintPreview } = usePrintLaboratory();

  // Auto-open print preview when lab request is saved
  useEffect(() => {
    if (savedLabRequestId) {
      openLabPrintPreview(savedLabRequestId);
      clearSavedLabRequestId();
    }
  }, [savedLabRequestId, openLabPrintPreview, clearSavedLabRequestId]);

  // Auto-open print preview when lab request is updated
  useEffect(() => {
    if (printPreviewId) {
      openLabPrintPreview(printPreviewId);
      clearPrintPreviewId();
      // Show history again after print preview is triggered
      setShowLabHistory(true);
    }
  }, [printPreviewId, openLabPrintPreview, clearPrintPreviewId]);

  const [formData, setFormData] = useState({
    request_no: `LR-${new Date().getFullYear()}-${Math.floor(
      Math.random() * 9000
    ) + 1000}`,
    patient_id: "",
    diagnosis: "",
    xray_findings: "",
    utz_findings: "",
  });

  const [selectedTests, setSelectedTests] = useState([]);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [showLabHistory, setShowLabHistory] = useState(true);

  const diagnosisRef = useRef(null);

  const { labHistory, loadingHistory } = useLabHistory(
    selectedPatient?.id,
    refreshTrigger
  );

  // Get patient image using custom hook
  const { imageUrl, isLoading: imageLoading, fullPatient } = usePatientImage(selectedPatient);

  const handleCheckboxChange = (category, test) => {
    const exists = selectedTests.find(
      (t) => t.category === category && t.test_name === test
    );

    if (exists) {
      setSelectedTests((prev) =>
        prev.filter(
          (t) =>
            !(t.category === category && t.test_name === test)
        )
      );
    } else {
      setSelectedTests((prev) => [
        ...prev,
        { category, test_name: test, other_value: null },
      ]);
    }
  };

  const handleOtherChange = (category, value) => {
    setSelectedTests((prev) =>
      prev.map((t) =>
        t.category === category && t.test_name === "Others"
          ? { ...t, other_value: value }
          : t
      )
    );
  };

  const handleResetForm = () => {
    handleReset();
    setSelectedTests([]);
    setShowLabHistory(true);
    setFormData({
      request_no: `LR-${new Date().getFullYear()}-${Math.floor(
        Math.random() * 9000
      ) + 1000}`,
      patient_id: "",
      diagnosis: "",
      xray_findings: "",
      utz_findings: "",
    });
  };

  const handleSelectPatient = (patient) => {
    handleSelectPatientForm(patient, setFormData);
  };

  const renderTestSection = (category, tests) => (
    <div className="test-section">
      <h3>{category}</h3>

      <div className="checkbox-grid">
        {tests.map((test) => (
          <label key={test} className="checkbox-item">
            <input
              type="checkbox"
              checked={selectedTests.some(
                (t) => t.category === category && t.test_name === test
              )}
              onChange={() =>
                handleCheckboxChange(category, test)
              }
            />
            {test}
          </label>
        ))}
      </div>

      {selectedTests.find(
        (t) =>
          t.category === category &&
          t.test_name === "Others"
      ) && (
        <input
          type="text"
          placeholder="Specify other test..."
          onChange={(e) =>
            handleOtherChange(category, e.target.value)
          }
          className="other-input"
        />
      )}
    </div>
  );

  return (
    <div className="dashboard-container">
      <Sidebar
        allowedPages={allowedPages}
        currentPage="lab_request"
        onNavigate={onNavigate}
      />

      <div className="dashboard-content">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Laboratory Request</h1>
            <div
              className="user-info"
              onClick={onNavigateToProfile}
              style={{ cursor: "pointer" }}
            >
              <div className="user-avatar-icon">👤</div>
              <span className="user-name">
                {user?.name || "User"}
              </span>
              <span className="user-role">
                {user?.role || "Member"}
              </span>
              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main
          className={`dashboard-main ${
            step === 2 ? "full-width" : ""
          }`}
        >
          {/* LEFT PANEL */}
          <div className="left-panel">
            {step === 1 && !updateSuccess && (
              <div className="welcome-section">
                <div className="welcome-card">
                  <h2>Search Patient</h2>
                  <p>
                    Enter patient name or ID to create lab
                    request.
                  </p>
                </div>

                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="search-input-group">
                    <input
                      type="text"
                      className="search-input-new"
                      placeholder="Search by name or ID... (type to search)"
                      value={searchQuery}
                      onChange={(e) =>
                        setSearchQuery(e.target.value)
                      }
                      autoComplete="off"
                    />
                    {loading && <span style={{ marginLeft: '10px', color: '#666' }}>🔄 Searching...</span>}
                  </div>
                  {error && (
                    <div
                      style={{
                        color: "red",
                        marginTop: "6px",
                      }}
                    >
                      {error}
                    </div>
                  )}
                </form>

                {searchResults.length > 0 && (
                  <div className="search-results">
                    <h3>Select Patient:</h3>
                    <ul>
                      {searchResults.map((patient) => (
                        <li key={patient.id}>
                          <div className="patient-line">
                            <span className="patient-name">
                              {patient.name}
                            </span>
                            <span className="patient-code">
                              ({patient.patient_code})
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              handleSelectPatient(patient)
                            }
                          >
                            Select
                          </button>
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
                  <div className="success-badge">
                    ✓ Success
                  </div>
                  <h2>Lab Request Created</h2>
                  <p>
                    The laboratory request has been saved and opened for printing.
                  </p>
                </div>

                <button
                  className="btn-outline"
                  onClick={handleResetForm}
                >
                  + Create New Request
                </button>
              </div>
            )}

            {updateSuccess && (
              <div className="welcome-section">
                <div className="welcome-card">
                  <div className="success-badge">
                    ✓ Success
                  </div>
                  <h2>Lab Request Updated</h2>
                  <p>
                    The laboratory request has been updated and opened for printing.
                  </p>
                </div>

                <button
                  className="btn-outline"
                  onClick={() => {
                    clearUpdateSuccess();
                    handleResetForm();
                  }}
                >
                  + Create New Request
                </button>
              </div>
            )}
          </div>

          {/* RIGHT PANEL */}
        <  div className="right-panel1">
            {step === 2 && selectedPatient && (
              <div className="lab-request-container1">
                      <div className="lab-width-controller1">
                <div className="lab-card1">
                  <div className="lab-header1">
                    <h2>Lab Request Details</h2>
                    <button
                      type="button"
                      className="back-button1"
                      onClick={handleResetForm}
                    >
                      ← Back
                    </button>
                  </div>

                  {/* HISTORY SECTION AT TOP */}
                  {showLabHistory && (
                  <div className="history-box">
                    <h3>Previous Lab Requests</h3>

                    {loadingHistory && (
                      <p>Loading history...</p>
                    )}

                    {!loadingHistory &&
                      labHistory.length === 0 && (
                        <p className="no-history">
                          No lab request history.
                        </p>
                      )}

                    {!loadingHistory &&
                      labHistory.length > 0 && (
                        <ul className="history-list">
                          {labHistory.map((item) => (
                            <li
                              key={item.id}
                              className="history-list-item"
                            >
                              <div className="history-item-info">
                                <div className="history-date">
                                  {new Date(
                                    item.created_at
                                  ).toLocaleDateString()}
                                </div>
                                <div className="history-doctor">
                                  Dr.{" "}
                                  {item.doctor_name ||
                                    "N/A"}
                                </div>
                              </div>
                              <button
                                className="history-print-btn"
                                onClick={() => {
                                  openLabPrintPreview(
                                    item.id
                                  );
                                }}
                              >
                                Print
                              </button>

                              {/* ✏️ EDIT BUTTON */}
                              <button
                                type="button"
                                className="history-print-btn"
                                onClick={() => {
                                  const editData = handleEditLabRequest(item);
                                  setFormData(prev => ({
                                    ...prev,
                                    id: item.id,
                                    request_no: item.request_no,
                                    diagnosis: editData.diagnosis || "",
                                    xray_findings: editData.xray_findings || "",
                                    utz_findings: editData.utz_findings || "",
                                  }));
                                  // Set selected tests from history
                                  if (editData.tests && editData.tests.length > 0) {
                                    setSelectedTests(editData.tests);
                                  }
                                  setShowLabHistory(false);
                                  setTimeout(() => {
                                    diagnosisRef.current?.scrollIntoView({ behavior: 'smooth' });
                                  }, 100);
                                }}
                                title="Edit lab request"
                                style={{ marginLeft: '8px' }}
                              >
                                ✏️
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>
                  )}

                  {/* SHOW HISTORY BUTTON */}
                  {!showLabHistory && (
                    <button
                      className="btn-outline"
                      onClick={() => setShowLabHistory(true)}
                      style={{ marginBottom: '16px' }}
                    >
                      ↑ Show History
                    </button>
                  )}

                  {/* Patient */}
                  <div className="form-group">
                    <label>Patient</label>
                    <div className="patient-image-container">
                      <img
                        src={imageUrl}
                        alt="Patient"
                        className="patient-image-display"
                        onLoad={() => console.log("✅ Patient image loaded")}
                        onError={(e) => {
                          e.target.src = DEFAULT_AVATAR;
                        }}
                      />
                      <div className="patient-info-section">
                        <div className="patient-info-item">
                          <span className="patient-info-label">Patient Name</span>
                          <span className="patient-info-value">{fullPatient?.name || selectedPatient?.name || 'N/A'}</span>
                        </div>
                        <div className="patient-info-item">
                          <span className="patient-info-label">Patient Code</span>
                          <span className="patient-info-value">{fullPatient?.patient_code || 'N/A'}</span>
                        </div>
                        <div className="patient-info-item">
                          <span className="patient-info-label">Gender</span>
                          <span className="patient-info-value">{fullPatient?.gender || 'N/A'}</span>
                        </div>
                        <div className="patient-info-item">
                          <span className="patient-info-label">Age</span>
                          <span className="patient-info-value">{fullPatient?.age || 'N/A'}</span>
                        </div>
                        <div className="patient-info-item">
                          <span className="patient-info-label">Date of Birth</span>
                          <span className="patient-info-value">{fullPatient?.date_of_birth || 'N/A'}</span>
                        </div>
                      </div>
                      {imageLoading && <p style={{ fontSize: '12px', color: '#666', position: 'absolute', top: '10px' }}>Loading image...</p>}
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div className="form-group">
                    <label>Diagnosis</label>
                    <textarea
                      ref={diagnosisRef}
                      name="diagnosis"
                      value={formData.diagnosis}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          diagnosis: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  {error && (
                    <div
                      style={{
                        color: "red",
                        marginTop: "6px",
                        padding: "8px",
                        backgroundColor: "#ffe0e0",
                        borderRadius: "4px",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  {/* X-Ray */}
                  <div className="form-group">
                    <label>X-Ray Findings (Optional)</label>
                    <textarea
                      name="xray_findings"
                      value={formData.xray_findings}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          xray_findings: e.target.value,
                        }))
                      }
                      placeholder="Enter X-ray findings..."
                    />
                  </div>

                  {/* ULTRASOUND */}
                  <div className="form-group">
                    <label>Ultrasound Findings (Optional)</label>
                    <textarea
                      name="utz_findings"
                      value={formData.utz_findings}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          utz_findings: e.target.value,
                        }))
                      }
                      placeholder="Enter ultrasound findings..."
                    />
                  </div>

                  {/* TEST SECTIONS */}
                  {renderTestSection("Chemistry", [
                    "BUN",
                    "Crea",
                    "FBS",
                    "Lipid Profile",
                    "HbA1c",
                    "BUA",
                    "Na",
                    "K",
                    "Cl",
                    "AST/ALT",
                    "Others",
                  ])}

                  {renderTestSection("Cardiology", [
                    "2D Echo",
                    "ECG",
                    "Others",
                  ])}

                  {renderTestSection("Bacteriology", [
                    "Gen Expert",
                    "AFB Stain",
                    "Others",
                  ])}

                  {renderTestSection("Hematology", [
                    "CBC",
                    "PC",
                    "Blood Typing",
                    "Others",
                  ])}

                  {renderTestSection("Urinalysis & Others", [
                    "Fecalysis",
                    "Urinalysis",
                    "Covid 19 Test",
                    "Others",
                  ])}

                  {editingLabRequestId ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        className="btn-primary-lg"
                        onClick={() =>
                          handleUpdateLabRequest(
                            formData,
                            selectedTests,
                            refreshTrigger,
                            setRefreshTrigger
                          )
                        }
                        disabled={loading}
                      >
                        {loading ? "Updating..." : "Update Lab Request ✓"}
                      </button>
                      <button
                        className="btn-outline"
                        onClick={() => {
                          handleCancelEditLab();
                          setShowLabHistory(true);
                          setFormData({
                            request_no: `LR-${new Date().getFullYear()}-${Math.floor(
                              Math.random() * 9000
                            ) + 1000}`,
                            patient_id: "",
                            diagnosis: "",
                            xray_findings: "",
                            utz_findings: "",
                          });
                          setSelectedTests([]);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn-primary-lg"
                      onClick={() =>
                        handleGenerateLabRequest(
                          formData,
                          selectedPatient,
                          selectedTests,
                          user,
                          setStep
                        )
                      }
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Lab Request →"}
                    </button>
                  )}
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