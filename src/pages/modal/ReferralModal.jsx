import React, { useState, useEffect } from "react";
import "./ReferralModal.css";

export default function ReferralModal({ patient, consultation, onSave, onCancel, currentUser }) {
  const [formData, setFormData] = useState({
    receiving_facility: "",
    receiving_personnel: "",
    referral_category: "",
    referral_reasons: [],
    identity_number_manual: patient?.patient_id || "",
    reason_for_referral_2: ""
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  const referralReasonOptions = [
    "Diagnostics",
    "No Available Doctor",
    "No Equipment Available",
    "No Laboratory Available",
    "No Treatment/Procedure Available",
    "No Room Available",
    "Seek Advice/Second Opinion",
    "Seek Further Treatment Appropriate to the Case",
    "Seek Specialized Evaluation/Consultation"
  ];

  useEffect(() => {
    // If editing existing referral, populate form
    if (consultation) {
      setFormData(prev => ({
        ...prev,
        receiving_facility: consultation.receiving_facility || "",
        receiving_personnel: consultation.receiving_personnel || "",
        referral_category: consultation.referral_category || "",
        referral_reasons: consultation.reason_for_referral_2 ? JSON.parse(consultation.reason_for_referral_2) : [],
        identity_number_manual: consultation.identity_number_manual || patient?.patient_id || ""
      }));
    }
  }, [consultation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReasonCheck = (reason) => {
    setFormData(prev => {
      const reasons = prev.referral_reasons.includes(reason)
        ? prev.referral_reasons.filter(r => r !== reason)
        : [...prev.referral_reasons, reason];
      
      return {
        ...prev,
        referral_reasons: reasons
      };
    });
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.referral_category) {
      setSaveMessage({ type: "error", text: "✗ Referral Category is required" });
      return;
    }
    if (formData.referral_reasons.length === 0) {
      setSaveMessage({ type: "error", text: "✗ Please select at least one referral reason" });
      return;
    }

    try {
      setIsSaving(true);
      setSaveMessage(null);

      // Just pass the data back to DoctorModal
      setSaveMessage({ type: "success", text: "✓ Referral form saved" });
      setTimeout(() => {
        onSave(formData);
      }, 400);
    } catch (err) {
      setSaveMessage({ type: "error", text: "✗ " + err.message });
      console.error("Save referral error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="referral-modal-overlay">
      <div className="referral-modal">
        {/* Header */}
        <div className="referral-modal-header">
          <h2>Referral Form</h2>
          <p>Fill in the referral details for {patient?.first_name} {patient?.last_name} • Click "Save Updates" to save everything</p>
        </div>

        {/* Body */}
        <div className="referral-modal-body">
          {/* Receiving Facility & Personnel */}
          <div className="form-section">
            <h3>Referral Destination</h3>
            <div className="form-group">
              <label htmlFor="receiving_facility">
                Receiving Facility/Hospital
              </label>
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
              <label htmlFor="receiving_personnel">
                Receiving Personnel/Doctor
              </label>
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

            {/* Referral Category */}
            <div className="form-group">
              <label>
                <span className="required">*</span> Referral Category
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="referral_category"
                    value="Emergency"
                    checked={formData.referral_category === "Emergency"}
                    onChange={handleInputChange}
                  />
                  <span>Emergency</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="referral_category"
                    value="Outpatient"
                    checked={formData.referral_category === "Outpatient"}
                    onChange={handleInputChange}
                  />
                  <span>Outpatient</span>
                </label>
              </div>
            </div>
          </div>

          {/* Referral Reasons */}
          <div className="form-section">
            <h3>Reason for Referral</h3>
            <label className="section-label">
              <span className="required">*</span> Select one or more reasons
            </label>
            <div className="checkbox-grid">
              {referralReasonOptions.map((reason, idx) => (
                <label key={idx} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.referral_reasons.includes(reason)}
                    onChange={() => handleReasonCheck(reason)}
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div className="form-section">
            <h3>Additional Information</h3>
            
            <div className="form-group">
              <label htmlFor="identity_number_manual">
                Identity Number (Manual Entry)
              </label>
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

          {/* Save Message */}
          {saveMessage && (
            <div className={`save-message ${saveMessage.type}`}>
              {saveMessage.text}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="referral-modal-actions">
          <button
            className="btn btn-save"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Preparing..." : "✓ Fill Referral"}
          </button>
          <button
            className="btn btn-cancel"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
