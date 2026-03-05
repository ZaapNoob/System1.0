import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "./laboratory.css"; // you can rename later if you want
import useLabRequest from "../hooks/useLabRequest";
import { useLabHistory } from "../hooks/useLabHistory";
import { usePrintLaboratory } from "../hooks/usePrintLaboratory";

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
    handleSearch,
    handleSelectPatientForm,
    handleReset,
    handleGenerateLabRequest,
    clearSavedLabRequestId,
  } = useLabRequest();

  const { openLabPrintPreview } = usePrintLaboratory();

  // Auto-open print preview when lab request is saved
  useEffect(() => {
    if (savedLabRequestId) {
      openLabPrintPreview(savedLabRequestId);
      clearSavedLabRequestId();
    }
  }, [savedLabRequestId, openLabPrintPreview, clearSavedLabRequestId]);

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

  const { labHistory, loadingHistory } = useLabHistory(
    selectedPatient?.id
  );

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
            {step === 1 && (
              <div className="welcome-section">
                <div className="welcome-card">
                  <h2>Search Patient</h2>
                  <p>
                    Enter patient name or ID to create lab
                    request.
                  </p>
                </div>

                <form onSubmit={handleSearch}>
                  <div className="search-input-group">
                    <input
                      type="text"
                      className="search-input-new"
                      placeholder="Search by name or ID..."
                      value={searchQuery}
                      onChange={(e) =>
                        setSearchQuery(e.target.value)
                      }
                    />
                    <button
                      type="submit"
                      className="search-submit-btn"
                      disabled={loading}
                    >
                      {loading
                        ? "Searching..."
                        : "Search"}
                    </button>
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
          </div>

          {/* RIGHT PANEL */}
          <div className="right-panel">
            {step === 2 && selectedPatient && (
              <div className="lab-request-container">
                <div className="lab-card">
                  <div className="lab-header">
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
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>

                  {/* Patient */}
                  <div className="form-group">
                    <label>Patient</label>
                    <div className="patient-name">
                      {selectedPatient.name}
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div className="form-group">
                    <label>Diagnosis</label>
                    <textarea
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
                    "CI",
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
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}