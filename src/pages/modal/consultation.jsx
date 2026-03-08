// src/components/Consultation.jsx
import React, { useState, useEffect } from "react";
import { useFetchVitals } from "../../hooks/useFetchVitals";
import { useSaveConsultation } from "../../hooks/useSaveConsultation";
import { useSaveConsultationOnly } from "../../hooks/useSaveConsultationOnly";
import { useDoctors } from "../../hooks/useDoctors";
import { updateConsultation } from "../../api/consultation";
import "./consultation.css";

export default function Consultation({ patient, consultation, isEditing = false, onClose, onConsultationSaved, onSaved }) {
  const today = new Date().toISOString().split("T")[0];
  const { doctors, loading: loadingDoctors } = useDoctors();
  
  // Initialize form data - use consultation data if editing, otherwise empty
  const [formData, setFormData] = useState(() => {
    if (isEditing && consultation) {
      return {
        referral: "",
        referredTo: "",
        reasonForReferral: "",
        referredBy: "",
        purpose: "",
        nature: "",
        visitDate: consultation?.visit_date || today,
        physician: consultation?.doctor_id || "",
        systolic: consultation?.systolic || "",
        diastolic: consultation?.diastolic || "",
        temperature: consultation?.temperature || "",
        pulse: consultation?.pulse || "",
        respiratory: consultation?.respiratory || "",
        oxygen: consultation?.oxygen || "",
        weight: consultation?.weight || "",
        height: consultation?.height || "",
        chiefComplaint: consultation?.chief_complaint || "",
        diagnosis: consultation?.diagnosis || "",
        treatment: consultation?.treatment || "",
        patientIllness: consultation?.patient_illness || "",
      };
    }
    
    return {
      referral: "",
      referredTo: "",
      reasonForReferral: "",
      referredBy: "",
      purpose: "",
      nature: "",
      visitDate: today,
      physician: "",
      systolic: "",
      diastolic: "",
      temperature: "",
      pulse: "",
      respiratory: "",
      oxygen: "",
      weight: "",
      height: "",
      chiefComplaint: "",
      diagnosis: "",
      treatment: "",
      patientIllness: "",
    };
  });

  // Hook for fetching and auto-filling vital signs (only for new consultations)
  const { loading: loadingVitals, error: errorVitals } = isEditing ? { loading: false, error: null } : useFetchVitals(
    patient,
    setFormData
  );

  // Hook for saving consultation data (only used for new consultations)
  const { loading: loadingSave, error: errorSave, success: hookSuccess, handleSaveConsultation } = isEditing 
    ? { loading: false, error: null, success: false, handleSaveConsultation: null }
    : useSaveConsultation(onClose, doctors);

  // Hook for saving consultation data without printing
  const { loading: loadingSaveOnly, error: errorSaveOnly, handleSaveConsultationOnly } = isEditing
    ? { loading: false, error: null, handleSaveConsultationOnly: null }
    : useSaveConsultationOnly(onClose, onConsultationSaved);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [shouldPrint, setShouldPrint] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e, withPrint = false) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing && consultation) {
        // Update existing consultation
        const updateData = {
          id: consultation.id,
          chiefComplaint: formData.chiefComplaint,
          diagnosis: formData.diagnosis,
          treatment: formData.treatment,
          patientIllness: formData.patientIllness,
        };
        
        const response = await updateConsultation(updateData);
        
        if (response.success) {
          setSuccess(true);
          // Trigger refresh callback to reload consultation history
          if (onSaved) onSaved();
          setTimeout(() => {
            onClose();
          }, 1000);
        }
      } else {
        // Save new consultation
        if (withPrint) {
          // Save and print
          handleSaveConsultation(patient, formData);
        } else {
          // Save only - use the new hook
          handleSaveConsultationOnly(patient, formData);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to save consultation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="consultation-container">
      <h2>{isEditing ? "📝 Edit Consultation" : "📝 Referral & Consultation"}</h2>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          ✅ Consultation saved successfully
        </div>
      )}

      {loading && (
        <div className="loading-message">
          ⏳ Loading vital signs...
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="consultation-form">

        {!isEditing && (
          <>
            {/* Referral Section */}
            <section>
                         <div className="referral-box">

  <div className="section-header">
    <h3>Referral</h3>
  </div>

  <div className="referral-toggle">
    <label>
      <input
        type="radio"
        name="referral"
        value="Yes"
        checked={formData.referral === "Yes"}
        onChange={handleChange}
      />
      Yes
    </label>

    <label>
      <input
        type="radio"
        name="referral"
        value="No"
        checked={formData.referral === "No"}
        onChange={handleChange}
      />
      No
    </label>
  </div>

  {formData.referral === "Yes" && (
    <div className="referral-details-grid">
      <div>
        <label>Referred To</label>
        <input
          type="text"
          name="referredTo"
          value={formData.referredTo}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Referred By</label>
        <input
          type="text"
          name="referredBy"
          value={formData.referredBy}
          onChange={handleChange}
        />
      </div>

      <div className="full-width">
        <label>Reason for Referral</label>
        <textarea
          name="reasonForReferral"
          rows="3"
          value={formData.reasonForReferral}
          onChange={handleChange}
        />
      </div>
    </div>
  )}
</div>
            </section>

<div className="card-section">
  <div className="section-header">
    <h3>Visit Details</h3>
  </div>

  <div className="visit-details-grid">
    {/* Purpose Visited */}
    <div>
      <label>Purpose Visited</label>
      <select
        name="purpose"
        value={formData.purpose}
        onChange={handleChange}
        required
      >
        <option value="">-- Select Purpose of Visit --</option>
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

    {/* Nature of Visit */}
    <div>
      <label>Nature of Visit</label>
      <select
        name="nature"
        value={formData.nature}
        onChange={handleChange}
        required
      >
        <option value="">-- Select Nature of Visit --</option>
        <option value="New Consultation">New Consultation</option>
        <option value="Follow-up Consultation">Follow-up Consultation</option>
        <option value="Problem Consultation (New Symptoms)">
          Problem Consultation (New Symptoms)
        </option>
      </select>
    </div>

    {/* Attending Physician */}
<div className="attending-physician">
      <label>Attending Physician</label>
      <select
        name="physician"
        value={formData.physician}
        onChange={handleChange}
        disabled={loadingDoctors}
      >
        <option value="">
          {loadingDoctors ? "Loading doctors..." : "Select a physician"}
        </option>
        {doctors.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.name}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>

        {/* Visit Info */}
        <section>
          <h3>📅 Visit Information</h3>

          <label>Visit Date</label>
          <input
            type="date"
            name="visitDate"
            value={formData.visitDate}
            onChange={handleChange}
          />

        
        </section>

        {/* Vital Signs */}
        <section>
          <h3>🩺 Vital Signs</h3>

          <div className="grid-2">
            <input type="number" placeholder="BP Systolic" name="systolic" value={formData.systolic} onChange={handleChange} />
            <input type="number" placeholder="BP Diastolic" name="diastolic" value={formData.diastolic} onChange={handleChange} />
            <input type="number" placeholder="Temperature (°C)" name="temperature" value={formData.temperature} onChange={handleChange} />
            <input type="number" placeholder="Pulse Rate (bpm)" name="pulse" value={formData.pulse} onChange={handleChange} />
            <input type="number" placeholder="Respiratory Rate (cpm)" name="respiratory" value={formData.respiratory} onChange={handleChange} />
            <input type="number" placeholder="O₂ Saturation (%)" name="oxygen" value={formData.oxygen} onChange={handleChange} />
            <input type="number" placeholder="Weight (kg)" name="weight" value={formData.weight} onChange={handleChange} />
            <input type="number" placeholder="Height (cm)" name="height" value={formData.height} onChange={handleChange} />
          </div>
        </section>
          </>
        )}

        {/* Clinical Assessment */}
        <section>
          <h3>🏥 Clinical Assessment</h3>

          <label>Chief Complaint</label>
          <textarea
            name="chiefComplaint"
            rows="4"
            value={formData.chiefComplaint}
            onChange={handleChange}
          />

          <label>Diagnosis</label>
          <textarea
            name="diagnosis"
            rows="3"
            value={formData.diagnosis}
            onChange={handleChange}
            placeholder="Enter diagnosis"
          />

          <label>Treatment</label>
          <textarea
            name="treatment"
            rows="3"
            value={formData.treatment}
            onChange={handleChange}
            placeholder="Enter treatment plan"
          />

          <label>Patient Illness History</label>
          <textarea
            name="patientIllness"
            rows="3"
            value={formData.patientIllness}
            onChange={handleChange}
            placeholder="Enter patient illness history"
          />
        </section>

        <div className="consultation-actions">
          {!isEditing ? (
            <>
              <button 
                type="submit" 
                className="btn-save" 
                disabled={loading}
                onClick={(e) => handleSubmit(e, false)}
              >
                {loading ? "Saving..." : "💾 Save"}
              </button>
              <button 
                type="submit" 
                className="btn-save btn-print" 
                disabled={loading}
                onClick={(e) => handleSubmit(e, true)}
              >
                {loading ? "Saving..." : "💾 Save & Print"}
              </button>
            </>
          ) : (
            <button 
              type="button" 
              className="btn-save" 
              disabled={loading}
              onClick={(e) => handleSubmit(e, false)}
            >
              {loading ? "Updating..." : "✏️ Update Consultation"}
            </button>
          )}
          <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}