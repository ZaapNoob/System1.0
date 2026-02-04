import React, { useState } from "react";
import "./TriageModal.css";

export default function TriageModal({ patient, doctors = [], onAssign, onClose }) {
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const handleAssign = () => {
    if (selectedDoctor) onAssign(selectedDoctor);
  };

  return (
    <div className="modal-overlay">
      <div className="triage-modal-container">
        {/* Header */}
        <div className="triage-modal-header">
          <h2>Assign Patient to Doctor</h2>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="triage-modal-body">
          {/* Patient Profile */}
          <div className="triage-patient-image">
            <img
              src={patient?.profile_image || "/default-profile.png"}
              alt="Patient Profile"
            />
          </div>

          {/* Patient Info + Vital Signs */}
          <div className="triage-patient-info-grid">
            {/* Patient Information */}
            <div className="patient-info-column">
              <h3>Patient Information</h3>

              <div className="info-row">
                <span className="label">Name:</span>
                <span className="value">
                  {patient?.first_name || "—"}{" "}
                  {patient?.middle_name || ""}{" "}
                  {patient?.last_name || "—"}{" "}
                  {patient?.suffix || ""}
                </span>
              </div>

              <div className="info-row">
                <span className="label">Queue Code:</span>
                <span className="value">{patient?.queue_code || "—"}</span>
              </div>

              <div className="info-row">
                <span className="label">Gender:</span>
                <span className="value">{patient?.gender || "—"}</span>
              </div>

              <div className="info-row">
                <span className="label">Date of Birth:</span>
                <span className="value">{patient?.date_of_birth || "—"}</span>
              </div>

              <div className="info-row">
                <span className="label">Age:</span>
                <span className="value">{patient?.age || "—"}</span>
              </div>

              <div className="info-row">
                <span className="label">Blood Type:</span>
                <span className="value">{patient?.blood_type || "—"}</span>
              </div>

              <div className="info-row">
                <span className="label">Contact Number:</span>
                <span className="value">{patient?.contact_number || "—"}</span>
              </div>
            </div>

            {/* Vital Signs */}
            <div className="vital-signs-column">
              <h3>Vital Signs</h3>

              <div className="info-row">
                <span className="label">Blood Pressure:</span>
                <span className="value">
                  {patient?.systolic_bp || "—"}/{patient?.diastolic_bp || "—"} mmHg
                </span>
              </div>

              <div className="info-row">
                <span className="label">Heart Rate:</span>
                <span className="value">{patient?.heart_rate || "—"} bpm</span>
              </div>

              <div className="info-row">
                <span className="label">Respiratory Rate:</span>
                <span className="value">
                  {patient?.respiratory_rate || "—"} breaths/min
                </span>
              </div>

              <div className="info-row">
                <span className="label">Temperature:</span>
                <span className="value">{patient?.temperature || "—"}°C</span>
              </div>

              <div className="info-row">
                <span className="label">Oxygen Saturation:</span>
                <span className="value">{patient?.oxygen_saturation || "—"}%</span>
              </div>

              <div className="info-row">
                <span className="label">Weight:</span>
                <span className="value">{patient?.weight || "—"} kg</span>
              </div>

              <div className="info-row">
                <span className="label">Height:</span>
                <span className="value">{patient?.height || "—"} cm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Assignment */}
        <div className="triage-doctor-selection">
          <h3>Assign Doctor</h3>
          <select
            className="doctor-dropdown"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="" disabled>
              Select a doctor
            </option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="triage-modal-actions">
          <button
            className="btn btn-assign"
            onClick={handleAssign}
            disabled={!selectedDoctor}
          >
            Assign & Serve
          </button>
          <button className="btn btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}