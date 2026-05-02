import { useEffect, useState } from "react";
import { useModal } from "../modal/ModalProvider";
import API from "../../config/api";
import { apiFetch } from "../../utils/api";
import { useDoctors } from "../../hooks/useDoctors";
import { usePatientImage } from "../../hooks/image display/usePatientImage";
import { getImageUrl } from "../../utils/image.js";
import "./EditConsultationModal.css";

export default function EditConsultationModal({ consultation, patient, onUpdate, user }) {
  const { closeModal } = useModal();
  const { doctors } = useDoctors();
  const { imageUrl } = usePatientImage(patient); // Auto-fetch if profile_image missing

  // DEBUG: Log incoming consultation
  useEffect(() => {
    console.log("📋 [EditConsultation] Consultation object received:", consultation);
    console.log("👤 [EditConsultation] Patient object received:", patient);
    console.log("👤 [EditConsultation] User object received:", user);
  }, [consultation, patient, user]);

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
    remarks: consultation?.remarks || "",
    // Referral fields
    receiving_facility: consultation?.receiving_facility || "",
    receiving_personnel: consultation?.receiving_personnel || "",
    referral_category: consultation?.referral_category || "",
    reason_for_referral_2: consultation?.reason_for_referral_2 || "",
    identity_number_manual: consultation?.identity_number_manual || ""
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

  // Handle reason for referral checkboxes
  const handleReferralReasonChange = (reason) => {
    setFormData(prev => {
      let reasons = [];
      
      // Parse existing reasons from JSON string
      if (prev.reason_for_referral_2) {
        try {
          if (typeof prev.reason_for_referral_2 === 'string') {
            reasons = JSON.parse(prev.reason_for_referral_2);
          } else if (Array.isArray(prev.reason_for_referral_2)) {
            reasons = prev.reason_for_referral_2;
          }
        } catch (e) {
          reasons = [];
        }
      }

      // Toggle the reason
      if (reasons.includes(reason)) {
        reasons = reasons.filter(r => r !== reason);
      } else {
        reasons.push(reason);
      }

      // Store as JSON string
      return {
        ...prev,
        reason_for_referral_2: JSON.stringify(reasons)
      };
    });
  };

  // Parse reason_for_referral_2 to get selected reasons
  const getSelectedReasons = () => {
    try {
      if (typeof formData.reason_for_referral_2 === 'string' && formData.reason_for_referral_2) {
        return JSON.parse(formData.reason_for_referral_2);
      } else if (Array.isArray(formData.reason_for_referral_2)) {
        return formData.reason_for_referral_2;
      }
    } catch (e) {
      return [];
    }
    return [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

// DEBUG: Log form data before sending (moved after encoded_by addition)

    try {
      // Add encoded_by from current user
      const submitData = {
        ...formData,
        encoded_by: user?.id || null
      };

      console.log("📝 [EditConsultation] Submit data with encoded_by:", submitData);

      const res = await apiFetch(
        `${API}/consultation/update-consultation.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData)
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

    {/* REFERRAL SECTION */}
    <div className="referral-section">
      <h4>Referral Information</h4>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="receiving_facility">Receiving Facility/Hospital:</label>
          <input
            type="text"
            id="receiving_facility"
            name="receiving_facility"
            value={formData.receiving_facility}
            onChange={handleInputChange}
            placeholder="e.g., Hospital X, District Hospital"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="receiving_personnel">Receiving Personnel/Doctor:</label>
          <input
            type="text"
            id="receiving_personnel"
            name="receiving_personnel"
            value={formData.receiving_personnel}
            onChange={handleInputChange}
            placeholder="e.g., Dr. Juan Dela Cruz"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="referral_category">Referral Category:</label>
          <select
            id="referral_category"
            name="referral_category"
            value={formData.referral_category}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="">-- Select --</option>
            <option value="Emergency">Emergency</option>
            <option value="Outpatient">Outpatient</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="identity_number_manual">Identity Number (Manual):</label>
          <input
            type="text"
            id="identity_number_manual"
            name="identity_number_manual"
            value={formData.identity_number_manual}
            onChange={handleInputChange}
            placeholder={`Patient ID: ${patient?.patient_id}`}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Reason for Referral:</label>
        <div className="referral-checklist">
          {['Diagnostics', 'No Available Doctor', 'No Equipment Available', 'No Laboratory Available', 'No Treatment/Procedure Available', 'No Room Available', 'Seek Advice/Second Opinion', 'Seek Further Treatment Appropriate to the Case', 'Seek Specialized Evaluation/Consultation'].map((reason, idx) => (
            <div key={idx} className="checkbox-item">
              <input
                type="checkbox"
                id={`reason-${idx}`}
                checked={getSelectedReasons().includes(reason)}
                onChange={() => handleReferralReasonChange(reason)}
              />
              <label htmlFor={`reason-${idx}`} className="checkbox-label">{reason}</label>
            </div>
          ))}
        </div>
      </div>
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
