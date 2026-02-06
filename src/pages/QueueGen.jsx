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

      {/* OPTIONAL VITAL SIGNS */}
{selectedPatient && (
  <div className="queue-section">
    <label>Optional Vital Signs</label>
    <div className="vitals-grid-input">
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
      <input
        type="number"
        name="heart_rate"
        placeholder="Heart Rate"
        value={vitals.heart_rate || ""}
        onChange={handleVitalsChange}
      />
      <input
        type="number"
        name="respiratory_rate"
        placeholder="Respiratory Rate"
        value={vitals.respiratory_rate || ""}
        onChange={handleVitalsChange}
      />
      <input
        type="number"
        step="0.1"
        name="temperature"
        placeholder="Temperature"
        value={vitals.temperature || ""}
        onChange={handleVitalsChange}
      />
      <input
        type="number"
        name="oxygen_saturation"
        placeholder="Oxygen Saturation"
        value={vitals.oxygen_saturation || ""}
        onChange={handleVitalsChange}
      />
      <input
        type="number"
        step="0.01"
        name="weight"
        placeholder="Weight"
        value={vitals.weight || ""}
        onChange={handleVitalsChange}
      />
      <input
        type="number"
        step="0.01"
        name="height"
        placeholder="Height"
        value={vitals.height || ""}
        onChange={handleVitalsChange}
      />
    </div>
  </div>
)}


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

        {/* QUEUE PREVIEW */}
        <div className="queue-display">
          <p>Queue Number Preview</p>
          <span className="queue-number">
            {isManual
              ? `${queueType === "PRIORITY" ? "P" : "R"}-${
                  manualNumber ? String(manualNumber).padStart(3, "0") : "---"
                }`
              : queuePreview}
          </span>
        </div>

        {/* MANUAL MODE */}
        <div className="queue-section">
          <label>
            <input
              type="checkbox"
              checked={isManual}
              onChange={(e) => setIsManual(e.target.checked)}
            />
            &nbsp;Manual queue number
          </label>
          {isManual && (
            <div style={{ marginTop: 8 }}>
              <input
                type="number"
                min="1"
                placeholder="Enter number (ex: 5)"
                value={manualNumber}
                onChange={(e) => setManualNumber(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* 🖨️ PRINT OPTION */}
        <div className="queue-section">
          <label>
            <input
              type="checkbox"
              checked={usePrinter}
              onChange={(e) => setUsePrinter(e.target.checked)}
            />
            &nbsp;Print queue ticket automatically
          </label>
        </div>

        {/* GENERATE BUTTON */}
        <div className="queue-buttons">
          <button
            className="btn-generate"
            disabled={!selectedPatient}
            onClick={() => handleGenerateQueue(vitals)} // send vitals
          >
            {isManual ? "Send Queue Number" : "Generate Queue Number"}
          </button>
        </div>

        <div className="queue-user-info">
          Processed by: <strong>{user?.name || "Staff"}</strong>
        </div>
      </div>
    </div>
  );
}
