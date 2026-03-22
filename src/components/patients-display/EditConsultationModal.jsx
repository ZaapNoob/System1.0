import { useEffect, useState } from "react";
import { useModal } from "../modal/ModalProvider";
import API from "../../config/api";
import { apiFetch } from "../../utils/api";
import { useDoctors } from "../../hooks/useDoctors";

export default function EditConsultationModal({ consultation, patient, onUpdate }) {
  const { closeModal } = useModal();
  const { doctors } = useDoctors();

  // DEBUG: Log incoming consultation
  useEffect(() => {
    console.log("📋 [EditConsultation] Consultation object received:", consultation);
    console.log("👤 [EditConsultation] Patient object received:", patient);
  }, [consultation, patient]);

  // Determine consultation ID - accept both 'id' and 'consultation_id'
  const consultationId = consultation?.consultation_id || consultation?.id;

  const [formData, setFormData] = useState({
    consultation_id: consultationId || "",
    patient_id: patient?.patient_id || consultation?.patient_id || "",
    doctor_id: consultation?.doctor_id || "",
    purpose_visit: consultation?.purpose_visit || "",
    nature_visit: consultation?.nature_visit || "",
    visit_date: consultation?.visit_date || "",
    systolic_bp: consultation?.systolic_bp || "",
    diastolic_bp: consultation?.diastolic_bp || "",
    temperature: consultation?.temperature || "",
    pulse_rate: consultation?.pulse_rate || consultation?.pulse || "",
    respiratory_rate: consultation?.respiratory_rate || consultation?.respiratory || "",
    oxygen_saturation: consultation?.oxygen_saturation || consultation?.oxygen || "",
    weight: consultation?.weight || "",
    height: consultation?.height || "",
    chief_complaint: consultation?.chief_complaint || "",
    diagnosis: consultation?.diagnosis || "",
    treatment: consultation?.treatment || "",
    patient_illness: consultation?.patient_illness || "",
    remarks: consultation?.remarks || ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // DEBUG: Log form data before sending
    console.log("📝 [EditConsultation] Form data before submit:", formData);

    try {
      const res = await apiFetch(
        `${API}/consultation/update-consultation.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        }
      );

      console.log("✅ [EditConsultation] API Response:", res);

      if (res.success) {
        // Notify parent to refresh
        if (onUpdate) onUpdate();
        closeModal();
      } else {
        setError(res.message || "Failed to update consultation");
      }
    } catch (err) {
      console.error("❌ [EditConsultation] Error:", err);
      setError(err.message || "Error updating consultation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-consultation-modal">
      <h3>Edit Consultation</h3>

      {!formData.consultation_id && (
        <div className="error-message" style={{ color: "#e74c3c", marginBottom: "15px", fontWeight: "bold" }}>
          ⚠️ Warning: Consultation ID is missing! Cannot submit.
        </div>
      )}

      {error && <div className="error-message" style={{ color: "red", marginBottom: "15px" }}>{error}</div>}

      {/* DEBUG PANEL */}
      <div style={{ 
        backgroundColor: "#f0f0f0", 
        padding: "10px", 
        borderRadius: "4px", 
        marginBottom: "15px", 
        fontSize: "12px",
        border: "1px solid #ccc"
      }}>
        <strong>Debug Info:</strong>
        <div>Consultation ID: <span style={{ fontFamily: "monospace", color: formData.consultation_id ? "green" : "red" }}>
          {formData.consultation_id || "(not set)"}
        </span></div>
        <div>Patient ID: <span style={{ fontFamily: "monospace" }}>{formData.patient_id || "(not set)"}</span></div>
      </div>

      <form onSubmit={handleSubmit}>

        {/* DOCTOR SELECTION */}
        <div className="form-group">
          <label htmlFor="doctor_id">Doctor:</label>
          <select
            id="doctor_id"
            name="doctor_id"
            value={formData.doctor_id}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="">-- Select Doctor --</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name || doctor.full_name || `Doctor #${doctor.id}`}
              </option>
            ))}
          </select>
        </div>

        {/* PURPOSE AND NATURE */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="purpose_visit">Purpose of Visit:</label>
            <select
              id="purpose_visit"
              name="purpose_visit"
              value={formData.purpose_visit}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">-- Select --</option>
              <option value="General">General</option>
              <option value="Prenatal">Prenatal</option>
              <option value="Dental Care">Dental Care</option>
              <option value="Child Care">Child Care</option>
              <option value="Child Nutrition">Child Nutrition</option>
              <option value="Injury">Injury</option>
              <option value="Adult Immunization">Adult Immunization</option>
              <option value="Family Planning">Family Planning</option>
              <option value="Postpartum">Postpartum</option>
              <option value="Tuberculosis">Tuberculosis</option>
              <option value="Child Immunization">Child Immunization</option>
              <option value="Sick Children">Sick Children</option>
              <option value="Firecracker Injury">Firecracker Injury</option>
              <option value="Mental Health">Mental Health</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="nature_visit">Nature of Visit:</label>
            <select
              id="nature_visit"
              name="nature_visit"
              value={formData.nature_visit}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">-- Select --</option>
              <option value="New Consultation">New Consultation</option>
              <option value="Follow-up Consultation">Follow-up Consultation</option>
              <option value="Problem Consultation (New Symptoms)">Problem Consultation (New Symptoms)</option>
            </select>
          </div>
        </div>

        {/* VISIT DATE */}
        <div className="form-group">
          <label htmlFor="visit_date">Visit Date:</label>
          <input
            type="date"
            id="visit_date"
            name="visit_date"
            value={formData.visit_date}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>

        {/* CHIEF COMPLAINT */}
        <div className="form-group">
          <label htmlFor="chief_complaint">Chief Complaint:</label>
          <textarea
            id="chief_complaint"
            name="chief_complaint"
            value={formData.chief_complaint}
            onChange={handleInputChange}
            className="form-input"
            rows="3"
          />
        </div>

        {/* VITALS */}
        <div className="vitals-group">
          <h4>Vital Signs</h4>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="systolic_bp">BP Systolic:</label>
              <input
                type="number"
                id="systolic_bp"
                name="systolic_bp"
                value={formData.systolic_bp}
                onChange={handleInputChange}
                className="form-input"
                placeholder="mmHg"
              />
            </div>

            <div className="form-group">
              <label htmlFor="diastolic_bp">BP Diastolic:</label>
              <input
                type="number"
                id="diastolic_bp"
                name="diastolic_bp"
                value={formData.diastolic_bp}
                onChange={handleInputChange}
                className="form-input"
                placeholder="mmHg"
              />
            </div>

            <div className="form-group">
              <label htmlFor="temperature">Temperature (°C):</label>
              <input
                type="number"
                id="temperature"
                name="temperature"
                step="0.1"
                value={formData.temperature}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pulse_rate">Pulse (bpm):</label>
              <input
                type="number"
                id="pulse_rate"
                name="pulse_rate"
                value={formData.pulse_rate}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="respiratory_rate">Respiratory Rate (cpm):</label>
              <input
                type="number"
                id="respiratory_rate"
                name="respiratory_rate"
                value={formData.respiratory_rate}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="oxygen_saturation">O2 Saturation (%):</label>
              <input
                type="number"
                id="oxygen_saturation"
                name="oxygen_saturation"
                value={formData.oxygen_saturation}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="weight">Weight (kg):</label>
              <input
                type="number"
                id="weight"
                name="weight"
                step="0.1"
                value={formData.weight}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="height">Height (cm):</label>
              <input
                type="number"
                id="height"
                name="height"
                step="0.1"
                value={formData.height}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* PATIENT ILLNESS */}
        <div className="form-group">
          <label htmlFor="patient_illness">Patient Illness History:</label>
          <textarea
            id="patient_illness"
            name="patient_illness"
            value={formData.patient_illness}
            onChange={handleInputChange}
            className="form-input"
            rows="3"
          />
        </div>

        {/* DIAGNOSIS */}
        <div className="form-group">
          <label htmlFor="diagnosis">Diagnosis:</label>
          <textarea
            id="diagnosis"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleInputChange}
            className="form-input"
            rows="3"
          />
        </div>

        {/* TREATMENT */}
        <div className="form-group">
          <label htmlFor="treatment">Treatment:</label>
          <textarea
            id="treatment"
            name="treatment"
            value={formData.treatment}
            onChange={handleInputChange}
            className="form-input"
            rows="3"
          />
        </div>

        {/* REMARKS */}
        <div className="form-group">
          <label htmlFor="remarks">Remarks:</label>
          <textarea
            id="remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            className="form-input"
            rows="2"
          />
        </div>

        {/* BUTTONS */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading || !formData.consultation_id}
            title={!formData.consultation_id ? "Invalid consultation ID" : ""}
            style={{
              padding: "10px 20px",
              backgroundColor: !formData.consultation_id ? "#bdc3c7" : "#27ae60",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: !formData.consultation_id || loading ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={closeModal}
            style={{
              padding: "10px 20px",
              backgroundColor: "#95a5a6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              marginLeft: "10px"
            }}
          >
            Cancel
          </button>
        </div>

      </form>

      <style>{`
        .edit-consultation-modal {
          padding: 20px;
          max-height: 80vh;
          overflow-y: auto;
        }

        .edit-consultation-modal h3 {
          margin-top: 0;
          margin-bottom: 20px;
          color: #2c3e50;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
          color: #2c3e50;
          font-size: 13px;
        }

        .form-input {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #bdc3c7;
          border-radius: 4px;
          font-size: 13px;
          font-family: inherit;
        }

        .form-input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 4px rgba(52, 152, 219, 0.3);
        }

        .vitals-group {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 15px;
        }

        .vitals-group h4 {
          margin-top: 0;
          margin-bottom: 15px;
          color: #2c3e50;
          font-size: 14px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #bdc3c7;
        }

        .error-message {
          padding: 10px;
          background: #ffe6e6;
          border: 1px solid #e74c3c;
          border-radius: 4px;
          color: #c0392b;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}
