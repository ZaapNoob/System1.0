import React, { useState } from "react";
import { useDoctors } from "../../hooks/useDoctors";
import { useConsultationHistory } from "../../hooks/useConsultationHistory";
import { usePrintConsultation } from "../../hooks/usePrintConsultation";
import { useRefresh } from "../../hooks/useRefresh";
import { useWebSocketContext } from "../../context/WebSocketContext";
import { useAssignDoctorWithBroadcast } from "../../hooks/useAssignDoctorWithBroadcast";
import { useModal } from "../../components/modal/ModalProvider";
import ConfirmationModal from "../../components/modal/ConfirmationModal";
import Consultation from "./consultation";
import maleIcon from "../../assets/OIP (1).jpeg";
import femaleIcon from "../../assets/OIP.jpeg";
import "./TriageModal.css";

export default function TriageModal({ patient, triggerPollingReset, onAssign, onClose }) {
  const { doctors, loading } = useDoctors();
  const { openModal, closeModal } = useModal();
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [success, setSuccess] = useState(false);
  const { refreshTrigger, triggerRefresh } = useRefresh();
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  
  // WebSocket for broadcasting updates (global context)
  const { send: wsSend } = useWebSocketContext();
  
  // Hook for assigning doctor with automatic WebSocket broadcast
  const { handleAssignDoctor, loading: assigning, error: assignError } = useAssignDoctorWithBroadcast();
  
  // Debug: Log patient object to check available properties
  console.log('📋 TriageModal opened with patient object:', patient);
  console.log('   - patient.patient_id:', patient?.patient_id);
  console.log('   - patient.id:', patient?.id);

  // Get default image based on gender
  const getDefaultImage = () => {
    if (patient?.gender?.toLowerCase() === 'male') {
      return maleIcon;
    }
    if (patient?.gender?.toLowerCase() === 'female') {
      return femaleIcon;
    }
    return maleIcon; // Default to male if gender is unknown
  };

  const profileImage = patient?.profile_image || getDefaultImage();
  
  const { consultHistory, loadingHistory } = useConsultationHistory(patient?.patient_id, refreshTrigger);

  // Use custom hook for enriching consultation history and printing
  const { enrichedConsultHistory, handlePrintConsultation } = usePrintConsultation(
    patient,
    consultHistory,
    doctors
  );

  // Handle close with confirmation
  const handleCloseRequest = () => {
    if (!selectedDoctor && !success) {
      // Show confirmation if no doctor is selected
      setShowConfirmClose(true);
    } else {
      // Close directly if doctor was assigned
      onClose();
    }
  };

const handleAssign = async () => {
  // Show warning if no doctor selected
  if (!selectedDoctor) {
    setAttemptedSubmit(true);
    return;
  }

  try {
    const success = await handleAssignDoctor(patient, selectedDoctor, triggerPollingReset);
    
    if (success) {
      setSuccess(true);       // ✅ show success message
      onAssign(selectedDoctor); // optional: refresh parent list

      // ✅ auto-close modal after short delay
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  } catch (err) {
    console.error("Failed to assign doctor:", err);
    alert("Failed to assign doctor");
  }
};

const handleAddConsultation = () => {
  openModal(
    <Consultation 
      patient={patient} 
      onClose={() => {
        closeModal();
        // Delay refresh to allow database to sync
        setTimeout(() => {
          triggerRefresh();
        }, 1200);
      }}
      isQuickEntry={true}
    />
  );
};

  return (
    <div className="modal-overlay">
      <div className="triage-modal-container">
        {/* Header */}
        <div className="triage-modal-header">
          <h2>Assign Patient to Doctor</h2>
          <button 
            className="modal-close-btn" 
            onClick={handleCloseRequest}
            title="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="triage-modal-body-wrapper">
          {/* Top Section: Patient Image + Patient Info (Side by Side) */}
          <div className="triage-top-section">
            {/* Left: Patient Profile Image */}
            <div className="triage-patient-image-section">
              <img
                src={profileImage}
                alt="Patient Profile"
                className="patient-profile-img"
              />
            </div>

            {/* Right: Patient Info Table */}
            <div className="triage-patient-info-section">
              <div className="patient-info-card">
                <h3>Patient Information</h3>
                <table className="patient-info-table">
                  <tbody>
                    <tr>
                      <td className="label">Name:</td>
                      <td className="value">
                        {patient?.first_name || "—"}{" "}
                        {patient?.middle_name || ""}{" "}
                        {patient?.last_name || "—"}{" "}
                        {patient?.suffix || ""}
                      </td>
                    </tr>

                    <tr>
                      <td className="label">Queue Code:</td>
                      <td className="value">{patient?.queue_code || "—"}</td>
                    </tr>

                    <tr>
                      <td className="label">Gender:</td>
                      <td className="value">{patient?.gender || "—"}</td>
                    </tr>

                    <tr>
                      <td className="label">Date of Birth:</td>
                      <td className="value">{patient?.date_of_birth || "—"}</td>
                    </tr>

                    <tr>
                      <td className="label">Age:</td>
                      <td className="value">{patient?.age || "—"}</td>
                    </tr>

                    <tr>
                      <td className="label">Blood Type:</td>
                      <td className="value">{patient?.blood_type || "—"}</td>
                    </tr>

                    <tr>
                      <td className="label">Contact Number:</td>
                      <td className="value">{patient?.contact_number || "—"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Vital Signs Section (Below) */}
          <div className="triage-vital-signs-section">
            <div className="patient-info-card">
              <h3>Vital Signs</h3>
              <table className="vital-signs-table">
                <thead>
                  <tr>
                    <th>Blood Pressure</th>
                    <th>Heart Rate</th>
                    <th>Respiratory Rate</th>
                    <th>Temperature</th>
                    <th>Oxygen Saturation</th>
                    <th>Weight</th>
                    <th>Height</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {patient?.systolic_bp || "—"}/{patient?.diastolic_bp || "—"} mmHg
                    </td>
                    <td>
                      {patient?.heart_rate || "—"} bpm
                    </td>
                    <td>
                      {patient?.respiratory_rate || "—"} breaths/min
                    </td>
                    <td>
                      {patient?.temperature || "—"}°C
                    </td>
                    <td>
                      {patient?.oxygen_saturation || "—"}%
                    </td>
                    <td>
                      {patient?.weight || "—"} kg
                    </td>
                    <td>
                      {patient?.height || "—"} cm
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

         {/* Bottom Section: Assign Doctor + Consultation History */}
<div className="triage-bottom-section">

  {/* Left: Doctor Assignment */}
  <div className="triage-doctor-section">
    <div className="triage-doctor-selection patient-info-card">
      <h3>Assign Doctor</h3>
      <select
        className="doctor-dropdown"
        value={selectedDoctor}
        onChange={(e) => {
          setSelectedDoctor(e.target.value);
          setAttemptedSubmit(false); // Clear warning when doctor is selected
        }}
        disabled={loading}
      >
        <option value="" disabled>
          {loading ? "Loading doctors..." : "Select a doctor"}
        </option>
        {doctors.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.name}
          </option>
        ))}
      </select>
    </div>
  </div>

<div className="consult-history-section patient-info-card">
  <h4>Consultation History</h4>

  {loadingHistory && (
    <p className="loading-text">Loading history...</p>
  )}

  {!loadingHistory && consultHistory.length === 0 && (
    <p className="no-history">No previous consultations.</p>
  )}

  {!loadingHistory && consultHistory.length > 0 && (
    <div className="consult-history-table-wrapper">
      <table className="consult-history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Consultation Type</th>
            <th>Purpose</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {enrichedConsultHistory.map((consult) => (
            <tr key={consult.id}>
              <td>{consult.visit_date}</td>
              <td>
                <span
                  className={`consult-badge ${
                    consult.nature_visit === "Follow-up Consultation"
                      ? "badge-followup"
                      : "badge-new"
                  }`}
                >
                  {consult.nature_visit}
                </span>
              </td>
              <td>{consult.purpose_visit || "—"}</td>
              <td>
                <button
                  type="button"
                  className="mini-print-btn"
                  onClick={() => handlePrintConsultation(consult)}
                >
                  🖨 Print
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
          </div>
               </div>

         {/* ✅ Actions */}
        <div className="triage-modal-actions">
          {attemptedSubmit && !selectedDoctor && !success && (
            <div className="warning-notification">
              ⚠️ Please select a doctor to assign first
            </div>
          )}
          
          {success && (
            <div className="assign-success">
              ✅ Patient assigned successfully
            </div>
          )}
          
          <button
            className="btn btn-assign"
            onClick={handleAssign}
          >
            Assign & Serve
          </button>
          <button 
            className="btn btn-cancel" 
            onClick={handleCloseRequest}
            title="Close modal"
          >
            Cancel
          </button>

            {/* ✅ NEW BUTTON */}
  <button
    className="btn btn-consultation"
    onClick={handleAddConsultation}
  >
    Add Consultation
  </button>

    
<button
  className="btn btn-print-opd"
  onClick={() => {
    sessionStorage.setItem("printPatient", JSON.stringify({...patient, autoprint: false}));
    window.open(`${window.location.origin}/print-opd`, "_blank");
  }}
>
  Print OPD
</button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationModal
        isOpen={showConfirmClose}
        title="Close Without Assigning Doctor?"
        message="This patient will be out in queue. Would you like to continue?"
        confirmText="Yes, Continue"
        cancelText="No, Go Back"
        onConfirm={() => {
          // 📡 OnClose in Dashboard will handle revert + WebSocket broadcast
          setShowConfirmClose(false);
          onClose();
        }}
        onCancel={() => setShowConfirmClose(false)}
      />
    </div>
  );
}