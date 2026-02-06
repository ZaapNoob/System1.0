import { useModal } from "../../components/modal/ModalProvider";
import "./DoctorModal.css";
export default function DoctorModal({ patient, onDone }) {
  const { closeModal } = useModal();

  if (!patient) return null;

  return (
    <div className="doctor-modal-container">
      {/* Header */}
      <div className="doctor-modal-header">
        <h2>Patient Information</h2>
        <button className="modal-close-btn" onClick={closeModal}>
          ✕
        </button>
      </div>

  <div className="doctor-modal-body">
    {/* Left Container: Patient Profile */}
    <div className="doctor-patient-container">
      <div className="doctor-patient-image">
        <img
          src={patient?.profile_image || "/default-profile.png"}
          alt="Patient Profile"
        />
      </div>

      <div className="doctor-patient-info">
        <h3>Patient Profile</h3>
        <div className="info-row">
          <span className="label">Name:</span>
          <span className="value">
            {patient?.first_name || "—"} {patient?.middle_name || ""} {patient?.last_name || "—"} {patient?.suffix || ""}
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
    </div>

    {/* Right Container: Vital Signs */}
    <div className="doctor-vitals-container">
      <h3>Vital Signs</h3>
      <div className="info-row">
        <span className="label">Blood Pressure:</span>
        <span className="value">{patient?.systolic_bp || "—"}/{patient?.diastolic_bp || "—"} mmHg</span>
      </div>
      <div className="info-row">
        <span className="label">Heart Rate:</span>
        <span className="value">{patient?.heart_rate || "—"} bpm</span>
      </div>
      <div className="info-row">
        <span className="label">Respiratory Rate:</span>
        <span className="value">{patient?.respiratory_rate || "—"} breaths/min</span>
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

      {/* Footer / Done Button */}
      <div className="doctor-modal-actions">
        <button className="btn btn-success" onClick={onDone}>
          ✔ Done
        </button>
        <button className="btn btn-cancel" onClick={closeModal}>
          Close
        </button>
      </div>

    </div>
  );
}
