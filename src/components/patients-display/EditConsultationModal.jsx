import { useEffect, useState } from "react";
import { useModal } from "../modal/ModalProvider";
import API from "../../config/api";
import { apiFetch } from "../../utils/api";
import { useDoctors } from "../../hooks/useDoctors";
import { usePatientImage } from "../../hooks/image display/usePatientImage";
import { getImageUrl } from "../../utils/image.js";
import "./EditConsultationModal.css";

export default function EditConsultationModal({ consultation, patient, onUpdate }) {
  const { closeModal } = useModal();
  const { doctors } = useDoctors();
  const { imageUrl } = usePatientImage(patient); // Auto-fetch if profile_image missing

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
      {/* PATIENT HEADER SECTION */}
      <div className="consultation-patient-header">
        <div className="patient-image-container">
          <img
            src={imageUrl}
            alt="Patient"
            className="consultation-patient-image"
            onError={(e) => {
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23e5e7eb' width='100' height='100'/%3E%3Ccircle cx='50' cy='35' r='15' fill='%239ca3af'/%3E%3Cpath d='M 20 80 Q 20 60 50 60 Q 80 60 80 80 Z' fill='%239ca3af'/%3E%3C/svg%3E";
            }}
          />
        </div>

        <div className="patient-info-header">
          <h3>{patient?.first_name} {patient?.last_name}</h3>
          <div className="patient-meta">
            <span className="meta-item">Patient ID: <strong>{formData.patient_id || "—"}</strong></span>
            <span className="meta-item">Consultation ID: <strong>{formData.consultation_id || "—"}</strong></span>
          </div>
        </div>
      </div>

      <h3>Edit Consultation</h3>

      {!formData.consultation_id && (
        <div className="error-message">
          ⚠️ Warning: Consultation ID is missing! Cannot submit.
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {/* DEBUG PANEL */}
     

    <form onSubmit={handleSubmit}>
  <div className="form-container">

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
          <input type="number" id="systolic_bp" name="systolic_bp" value={formData.systolic_bp} onChange={handleInputChange} className="form-input" />
        </div>

        <div className="form-group">
          <label htmlFor="diastolic_bp">BP Diastolic:</label>
          <input type="number" id="diastolic_bp" name="diastolic_bp" value={formData.diastolic_bp} onChange={handleInputChange} className="form-input" />
        </div>

        <div className="form-group">
          <label htmlFor="temperature">Temperature (°C):</label>
          <input type="number" id="temperature" name="temperature" step="0.1" value={formData.temperature} onChange={handleInputChange} className="form-input" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="pulse_rate">Pulse (bpm):</label>
          <input type="number" id="pulse_rate" name="pulse_rate" value={formData.pulse_rate} onChange={handleInputChange} className="form-input" />
        </div>

        <div className="form-group">
          <label htmlFor="respiratory_rate">Respiratory Rate:</label>
          <input type="number" id="respiratory_rate" name="respiratory_rate" value={formData.respiratory_rate} onChange={handleInputChange} className="form-input" />
        </div>

        <div className="form-group">
          <label htmlFor="oxygen_saturation">O2 Saturation (%):</label>
          <input type="number" id="oxygen_saturation" name="oxygen_saturation" value={formData.oxygen_saturation} onChange={handleInputChange} className="form-input" />
        </div>
      </div>
    </div>

    {/* TEXT SECTIONS */}
    <div className="form-group">
      <label htmlFor="patient_illness">Patient Illness History:</label>
      <textarea id="patient_illness" name="patient_illness" value={formData.patient_illness} onChange={handleInputChange} className="form-input" rows="3" />
    </div>

    <div className="form-group">
      <label htmlFor="diagnosis">Diagnosis:</label>
      <textarea id="diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleInputChange} className="form-input" rows="3" />
    </div>

    <div className="form-group">
      <label htmlFor="treatment">Treatment:</label>
      <textarea id="treatment" name="treatment" value={formData.treatment} onChange={handleInputChange} className="form-input" rows="3" />
    </div>

    <div className="form-group">
      <label htmlFor="remarks">Remarks:</label>
      <textarea id="remarks" name="remarks" value={formData.remarks} onChange={handleInputChange} className="form-input" rows="2" />
    </div>

    {/* BUTTONS */}
    <div className="form-actions">
      <button type="submit" disabled={loading || !formData.consultation_id} className="btn-submit">
        {loading ? "Saving..." : "Save Changes"}
      </button>

      <button type="button" onClick={closeModal} className="btn-cancel">
        Cancel
      </button>
    </div>

  </div>
</form>
    </div>
  );
}
