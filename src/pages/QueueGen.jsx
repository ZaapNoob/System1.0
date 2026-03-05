import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useModal } from "../components/modal/ModalProvider";
import QueueAddPatientModal from "./modal/QueueAddPatientModal";
import useGenerateQueue from "../hooks/GenerateQueueNo";
import usePatientSearchQueue from "../hooks/usePatientSearchQueue";

import "./queuegen.css";

export default function QueueGen({ user, allowedPages = [], onNavigate }) {
  // ===============================
  // ACTIVE PAGE STATE
  // ===============================
  const [currentPage, setCurrentPage] = useState("queuegen");

  const handleNavigate = (page) => {
    setCurrentPage(page);
    if (onNavigate) onNavigate(page);
  };

  const { openModal } = useModal();
  const barangayId = 0;

  // 🔥 Patient Search Hook
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    setSearchResults,
    selectedPatient,
    setSelectedPatient,
    selectPatient
  } = usePatientSearchQueue(barangayId);

  // 🖨️ Printer toggle
  const [usePrinter, setUsePrinter] = useState(true);

  // Dialog state for duplicate patient
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateQueueData, setDuplicateQueueData] = useState(null);

  // Optional vitals state
  const [vitals, setVitals] = useState({
    systolic_bp: "",
    diastolic_bp: "",
    heart_rate: "",
    respiratory_rate: "",
    temperature: "",
    oxygen_saturation: "",
    weight: "",
    height: ""
  });

  // Queue Hook
  const {
    queueType,
    queuePreview,
    isManual,
    manualNumber,
    setIsManual,
    setManualNumber,
    handleQueueTypeChange,
    handleGenerateQueue
  } = useGenerateQueue({
    selectedPatient,
    setSelectedPatient,
    setSearchTerm,
    setSearchResults,
    setVitals,
    usePrinter
  });

  // Register new patient
  const handleRegisterNewPatient = () => {
    openModal(
      <QueueAddPatientModal
        onPatientAdded={(patient) => setSelectedPatient(patient)}
      />
    );
  };

  // Handle vitals input
  const handleVitalsChange = (e) => {
    const { name, value } = e.target;
    setVitals((prev) => ({ ...prev, [name]: value }));
  };

  // Handle when patient is already in queue
  const handleAlreadyInQueue = (queueData) => {
    setDuplicateQueueData(queueData);
    setShowDuplicateDialog(true);
  };

  // Continue anyway - force generate without check
  const handleContinueAnyway = async () => {
    setShowDuplicateDialog(false);
    // Call handleGenerateQueue with forceGenerate=true to skip the check
    await handleGenerateQueue(vitals, null, true);
  };


  return (
    <div className="queuegen-main">
      <Sidebar 
        allowedPages={allowedPages} 
        currentPage={currentPage}
        onNavigate={handleNavigate} 
      />

      <div className="queuegen-container">
        <h2>📋 Queue Generation</h2>
        <p className="subtitle">Search patient and assign queue number</p>

        <div className="queue-layout">
          {/* LEFT SIDE */}
          <div className="queue-left">
            {/* SEARCH */}
            <div className="queue-section">
              <label>Search Patient</label>
              <input
                type="text"
                placeholder="Name, patient code, or DOB"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((p) => (
                    <div
                      key={p.id}
                      className="search-item"
                      onClick={() => selectPatient(p)}
                    >
                      <strong>{p.name}</strong>
                      <p>
                        {p.gender} • {p.date_of_birth} • Code: {p.patient_code}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <small className="hint">
                Patient not found?{" "}
                <span className="link" onClick={handleRegisterNewPatient}>
                  Register new patient
                </span>
              </small>
            </div>

            {/* SELECTED PATIENT */}
            <div className="queue-section">
              <label>Selected Patient</label>
              {selectedPatient ? (
                <div className="patient-card">
                  <strong>{selectedPatient.name}</strong>
                  <p>
                    {selectedPatient.gender} • {selectedPatient.age} yrs
                  </p>
                  <p>Code: {selectedPatient.patient_code}</p>
                </div>
              ) : (
                <div className="patient-placeholder">No patient selected</div>
              )}
            </div>

         {selectedPatient && (
  <div className="queue-preview-card">

    <div className="queue-preview-header">
      <p>Queue Number Preview</p>
      <span className="queue-number">
        {isManual
          ? `${queueType === "PRIORITY" ? "P" : "R"}-${
              manualNumber ? String(manualNumber).padStart(3, "0") : "---"
            }`
          : queuePreview}
      </span>
    </div>

    <div className="queue-preview-options">

      <label className="modern-checkbox">
        <input
          type="checkbox"
          checked={isManual}
          onChange={(e) => {
            setIsManual(e.target.checked);
            if (e.target.checked) {
              setUsePrinter(false);
            }
          }}
        />
        <span>Manual queue number</span>
      </label>

      {isManual && (
        <input
          className="manual-input"
          type="number"
          min="1"
          placeholder="Enter number (ex: 5)"
          value={manualNumber}
          onChange={(e) => setManualNumber(e.target.value)}
        />
      )}

      <label className="modern-checkbox">
        <input
          type="checkbox"
          checked={usePrinter}
          onChange={(e) => {
            setUsePrinter(e.target.checked);
            if (e.target.checked) {
              setIsManual(false);
            }
          }}
        />
        <span>Print queue ticket automatically</span>
      </label>

    </div>
  </div>
)}
          </div>

          {/* RIGHT SIDE */}
          {selectedPatient && (
            <div className="queue-right">
           {/* OPTIONAL VITAL SIGNS */}
<div className="queue-section">
  <label>Optional Vital Signs</label>

  <div className="vitals-grid-input">

    {/* BP ROW */}
    <div className="bp-row">
      <input
        type="number"
        name="systolic_bp"
        placeholder="Systolic BP (e.g., 120)"
        value={vitals.systolic_bp || ""}
        onChange={handleVitalsChange}
      />
      <input
        type="number"
        name="diastolic_bp"
        placeholder="Diastolic BP (e.g., 80)"
        value={vitals.diastolic_bp || ""}
        onChange={handleVitalsChange}
      />
    </div>

    {/* Other vitals */}
    <input type="number" name="heart_rate" placeholder="Heart Rate"
      value={vitals.heart_rate || ""} onChange={handleVitalsChange} />

    <input type="number" name="respiratory_rate" placeholder="Respiratory Rate"
      value={vitals.respiratory_rate || ""} onChange={handleVitalsChange} />

    <input type="number" step="0.1" name="temperature" placeholder="Temperature"
      value={vitals.temperature || ""} onChange={handleVitalsChange} />

    <input type="number" name="oxygen_saturation" placeholder="Oxygen Saturation"
      value={vitals.oxygen_saturation || ""} onChange={handleVitalsChange} />

    <input type="number" step="0.01" name="weight" placeholder="Weight"
      value={vitals.weight || ""} onChange={handleVitalsChange} />

    <input type="number" step="0.01" name="height" placeholder="Height"
      value={vitals.height || ""} onChange={handleVitalsChange} />

  </div>
</div>

              {/* QUEUE TYPE */}
              <div className="queue-section">
                <label>Queue Type</label>
                <div className="queue-type-buttons">
                  <button
                    className={queueType === "PRIORITY" ? "active" : ""}
                    onClick={() => handleQueueTypeChange("PRIORITY")}
                  >
                    ⚡ Priority
                  </button>
                  <button
                    className={queueType === "REGULAR" ? "active" : ""}
                    onClick={() => handleQueueTypeChange("REGULAR")}
                  >
                    🧾 Regular
                  </button>
                </div>
              </div>

              {/* GENERATE BUTTON */}
              <div className="queue-buttons">
                <button
                  className="btn-generate"
                  onClick={() => handleGenerateQueue(vitals, handleAlreadyInQueue)}
                >
                  {isManual ? "Send Queue Number" : "Generate Queue Number"}
                </button>
              </div>

              {/* USER INFO */}
              <div className="queue-user-info">
                Processed by: <strong>{user?.name || "Staff"}</strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DUPLICATE PATIENT DIALOG */}
      {showDuplicateDialog && duplicateQueueData && (
        <div className="modal-overlay">
          <div className="modal-content duplicate-dialog">
            <div className="modal-header">
              <h3>⚠️ Patient Already in Queue</h3>
            </div>
            <div className="modal-body">
              <p>
                This patient is already in the queue with number: <strong>{duplicateQueueData.queueCode}</strong>
              </p>
              <p>Status: <strong>{duplicateQueueData.inTriage ? "Triage" : "Queue"}</strong></p>
              <p style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
                Would you like to generate a new queue number anyway?
              </p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel" 
                onClick={() => setShowDuplicateDialog(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-continue-anyway" 
                onClick={handleContinueAnyway}
              >
                Continue Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
