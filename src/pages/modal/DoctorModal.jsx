import { useModal } from "../../components/modal/ModalProvider";
import { useState, useEffect } from "react";
import "./DoctorModal.css";

export default function DoctorModal({ patient, onDone }) {
  const { closeModal } = useModal();

  const [vitals, setVitals] = useState(patient || {});
  const [chiefComplaint, setChiefComplaint] = useState(
    patient?.chief_complaint || ""
  );
  const [chiefComplaintHistory, setChiefComplaintHistory] = useState([]);
  const [diagnosisHistory, setDiagnosisHistory] = useState([]);
  const [treatmentHistory, setTreatmentHistory] = useState([]);
  const [patientIllnessHistory, setPatientIllnessHistory] = useState([]);

  // Fetch latest consultation details if missing in queue record
  useEffect(() => {
    if (!patient?.patient_id) return;

    const fetchVitalsFromConsultation = async () => {
      try {
        const res = await fetch(
          `/api/consultation/get-latest-consultation.php?patient_id=${patient.patient_id}`
        );
        const data = await res.json();

        if (data.success && data.data && data.data.length > 0) {
          const latestConsult = data.data[0];
          const allConsults = data.data;

          setVitals((prev) => {
            const updated = { ...prev };

            if (!updated.systolic_bp && latestConsult.systolic_bp) {
              updated.systolic_bp = latestConsult.systolic_bp;
            }
            if (!updated.diastolic_bp && latestConsult.diastolic_bp) {
              updated.diastolic_bp = latestConsult.diastolic_bp;
            }
            if (!updated.heart_rate && latestConsult.pulse_rate) {
              updated.heart_rate = latestConsult.pulse_rate;
            }
            if (!updated.respiratory_rate && latestConsult.respiratory_rate) {
              updated.respiratory_rate = latestConsult.respiratory_rate;
            }
            if (!updated.temperature && latestConsult.temperature) {
              updated.temperature = latestConsult.temperature;
            }
            if (!updated.oxygen_saturation && latestConsult.oxygen_saturation) {
              updated.oxygen_saturation = latestConsult.oxygen_saturation;
            }
            if (!updated.weight && latestConsult.weight) {
              updated.weight = latestConsult.weight;
            }
            if (!updated.height && latestConsult.height) {
              updated.height = latestConsult.height;
            }

            return updated;
          });

          // Set chief complaint (latest only) with highlight
          if (!chiefComplaint && latestConsult.chief_complaint) {
            setChiefComplaint(latestConsult.chief_complaint);
          }

          // Extract history: all unique chief complaint records
          const complaintHistory = allConsults
            .map((c) => c.chief_complaint)
            .filter((cc) => cc && cc.trim())
            .filter((value, index, self) => self.indexOf(value) === index); // unique
          if (complaintHistory.length > 0) {
            setChiefComplaintHistory(complaintHistory);
          }

          // Extract history: all unique diagnosis records
          const diagHistory = allConsults
            .map((c) => c.diagnosis)
            .filter((d) => d && d.trim())
            .filter((value, index, self) => self.indexOf(value) === index); // unique
          if (diagHistory.length > 0) {
            setDiagnosisHistory(diagHistory);
          }

          // Extract history: all unique treatment records
          const treatHistory = allConsults
            .map((c) => c.treatment)
            .filter((t) => t && t.trim())
            .filter((value, index, self) => self.indexOf(value) === index); // unique
          if (treatHistory.length > 0) {
            setTreatmentHistory(treatHistory);
          }

          // Extract history: all unique patient_illness records
          const illnessHistory = allConsults
            .map((c) => c.patient_illness)
            .filter((i) => i && i.trim())
            .filter((value, index, self) => self.indexOf(value) === index); // unique
          if (illnessHistory.length > 0) {
            setPatientIllnessHistory(illnessHistory);
          }
        }
      } catch (err) {
        console.error("Failed to fetch consultation vitals:", err);
      }
    };

    fetchVitalsFromConsultation();
  }, [patient?.patient_id]);

  if (!patient) return null;

  const displayVitals = vitals;

  return (
    <div className="doctor-modal-container">
      {/* Header */}
      <div className="doctor-modal-header">
        <div>
          <h2>Patient Information</h2>
          <p className="doctor-modal-subtitle">
            Review patient profile, vitals, and consultation details
          </p>
        </div>
        <button className="modal-close-btn" onClick={closeModal}>
          ✕
        </button>
      </div>

      <div className="doctor-modal-body">
        {/* LEFT: Patient Profile */}
        <div className="doctor-card doctor-patient-container">
          <div className="doctor-patient-image">
            <img
              src={patient?.profile_image || "/default-profile.png"}
              alt="Patient Profile"
            />
          </div>

          <div className="doctor-patient-info">
            <h3>Patient Profile</h3>

            <div className="info-row">
              <span className="label">Name</span>
              <span className="value">
                {patient?.first_name || "—"} {patient?.middle_name || ""}{" "}
                {patient?.last_name || "—"} {patient?.suffix || ""}
              </span>
            </div>

            <div className="info-row">
              <span className="label">Queue Code</span>
              <span className="value badge-blue">
                {patient?.queue_code || "—"}
              </span>
            </div>

            <div className="info-row">
              <span className="label">Gender</span>
              <span className="value">{patient?.gender || "—"}</span>
            </div>

            <div className="info-row">
              <span className="label">Date of Birth</span>
              <span className="value">{patient?.date_of_birth || "—"}</span>
            </div>

            <div className="info-row">
              <span className="label">Age</span>
              <span className="value">{patient?.age || "—"}</span>
            </div>

            <div className="info-row">
              <span className="label">Blood Type</span>
              <span className="value badge-red">
                {patient?.blood_type || "—"}
              </span>
            </div>

            <div className="info-row">
              <span className="label">Contact Number</span>
              <span className="value">{patient?.contact_number || "—"}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Vital Signs */}
        <div className="doctor-card doctor-vitals-container">
          <h3>Vital Signs</h3>

          <div className="vitals-grid">
            <div className="vital-box">
              <span className="vital-title">Blood Pressure</span>
              <span className="vital-value">
                {displayVitals?.systolic_bp || "—"}/
                {displayVitals?.diastolic_bp || "—"}
              </span>
              <small>mmHg</small>
            </div>

            <div className="vital-box">
              <span className="vital-title">Heart Rate</span>
              <span className="vital-value">
                {displayVitals?.heart_rate || "—"}
              </span>
              <small>bpm</small>
            </div>

            <div className="vital-box">
              <span className="vital-title">Respiratory Rate</span>
              <span className="vital-value">
                {displayVitals?.respiratory_rate || "—"}
              </span>
              <small>breaths/min</small>
            </div>

            <div className="vital-box">
              <span className="vital-title">Temperature</span>
              <span className="vital-value">
                {displayVitals?.temperature || "—"}
              </span>
              <small>°C</small>
            </div>

            <div className="vital-box">
              <span className="vital-title">Oxygen Saturation</span>
              <span className="vital-value">
                {displayVitals?.oxygen_saturation || "—"}
              </span>
              <small>%</small>
            </div>

            <div className="vital-box">
              <span className="vital-title">Weight</span>
              <span className="vital-value">
                {displayVitals?.weight || "—"}
              </span>
              <small>kg</small>
            </div>

            <div className="vital-box">
              <span className="vital-title">Height</span>
              <span className="vital-value">
                {displayVitals?.height || "—"}
              </span>
              <small>cm</small>
            </div>
          </div>
        </div>

        {/* Bottom Full Width */}
        <div className="doctor-details-grid">
          <div className="doctor-card detail-card complaint-card" style={{ backgroundColor: "#e7f3ff", borderLeft: "4px solid #0066cc" }}>
            <h3>⭐ Chief Complaint (Latest)</h3>
            <div style={{ maxHeight: "150px", overflowY: "auto" }}>
              {chiefComplaintHistory.length > 0 ? (
                <ul style={{ margin: "0", paddingLeft: "20px" }}>
                  {chiefComplaintHistory.map((cc, idx) => (
                    <li key={idx} style={{ marginBottom: "8px", fontSize: "13px", color: idx === 0 ? "#0066cc" : "#333" }}>
                      {idx === 0 && <span style={{ fontWeight: "bold" }}>🔴 Latest: </span>}
                      {cc}
                    </li>
                  ))}
                </ul>
              ) : (
                "—"
              )}
            </div>
          </div>

          <div className="doctor-card detail-card">
            <h3>Diagnosis History</h3>
            <div style={{ maxHeight: "150px", overflowY: "auto" }}>
              {diagnosisHistory.length > 0 ? (
                <ul style={{ margin: "0", paddingLeft: "20px" }}>
                  {diagnosisHistory.map((d, idx) => (
                    <li key={idx} style={{ marginBottom: "8px", fontSize: "13px", color: idx === 0 ? "#0066cc" : "#333" }}>
                      {idx === 0 && <span style={{ fontWeight: "bold" }}>🔴 Latest: </span>}
                      {d}
                    </li>
                  ))}
                </ul>
              ) : (
                "—"
              )}
            </div>
          </div>

          <div className="doctor-card detail-card">
            <h3>Treatment History</h3>
            <div style={{ maxHeight: "150px", overflowY: "auto" }}>
              {treatmentHistory.length > 0 ? (
                <ul style={{ margin: "0", paddingLeft: "20px" }}>
                  {treatmentHistory.map((t, idx) => (
                    <li key={idx} style={{ marginBottom: "8px", fontSize: "13px", color: idx === 0 ? "#0066cc" : "#333" }}>
                      {idx === 0 && <span style={{ fontWeight: "bold" }}>🟢 Latest: </span>}
                      {t}
                    </li>
                  ))}
                </ul>
              ) : (
                "—"
              )}
            </div>
          </div>

          <div className="doctor-card detail-card">
            <h3>Patient Illness History</h3>
            <div style={{ maxHeight: "150px", overflowY: "auto" }}>
              {patientIllnessHistory.length > 0 ? (
                <ul style={{ margin: "0", paddingLeft: "20px" }}>
                  {patientIllnessHistory.map((i, idx) => (
                    <li key={idx} style={{ marginBottom: "8px", fontSize: "13px", color: idx === 0 ? "#0066cc" : "#333" }}>
                      {idx === 0 && <span style={{ fontWeight: "bold" }}>🟡 Latest: </span>}
                      {i}
                    </li>
                  ))}
                </ul>
              ) : (
                "—"
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
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