import { useState } from "react";

export default function ConsultationRecord({
  consultation,
  patient,
  onPrintOPD,
  onEditConsult,
  onDeleteConsult,
  deletingConsultation,
}) {
  const [expanded, setExpanded] = useState(false);

  // 🔍 DIAGNOSTIC LOGGING
  console.log("📋 ConsultationRecord received consultation:", consultation);
  console.log("📋 Referral fields - category:", consultation?.referral_category, "personnel:", consultation?.receiving_personnel, "reason:", consultation?.reason_for_referral_2);

  // Check if consultation has referral data
  const hasReferral = (consultation) => {
    const hasCategory = consultation?.referral_category && 
      consultation?.referral_category !== "NULL" && 
      consultation?.referral_category !== null;
    
    const hasPersonnel = consultation?.receiving_personnel && 
      consultation?.receiving_personnel !== "NULL" && 
      consultation?.receiving_personnel !== null;
    
    const hasReason = consultation?.reason_for_referral_2 && 
      consultation?.reason_for_referral_2 !== "NULL" && 
      consultation?.reason_for_referral_2 !== null;

    console.log("✅ HasReferral check - category:", hasCategory, "personnel:", hasPersonnel, "reason:", hasReason);
    return hasCategory || hasPersonnel || hasReason;
  };

  const handlePrintReferral = () => {
    console.log("📋 Print Referral clicked for consultation:", consultation);
    console.log("📋 Checking referral data - category:", consultation?.referral_category, "personnel:", consultation?.receiving_personnel, "facility:", consultation?.receiving_facility, "reason:", consultation?.reason_for_referral_2);
    console.log("👥 Patient address fields:", {street: patient?.street, barangay: patient?.barangay_name, city: patient?.city_municipality, province: patient?.province});
    
    const referralData = {
      patient: patient,
      referral: consultation,
      autoprint: false
    };
    
    console.log("✅ Storing referral data:", referralData);
    console.log("✅ Referral.receiving_facility = ", referralData.referral?.receiving_facility);
    localStorage.setItem("printReferralData", JSON.stringify(referralData));
    window.open(`/print-referral`, "PrintReferral", "width=1200,height=800");
  };

  return (
    <div className="consult-record">
      <button
        className="consult-header-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        <span className={`toggle-icon ${expanded ? 'open' : 'closed'}`}>▼</span>
        <div className="consult-header-info">
          <span className="consult-date">{consultation.visit_date || "—"}</span>
          <span className="consult-doctor">{consultation.doctor_name || "—"}</span>
          {consultation.chief_complaint && (
            <span className="consult-complaint">{consultation.chief_complaint}</span>
          )}
        </div>
      </button>

      {expanded && (
        <div className="consult-record-content">
          <div className="consult-details-grid">
            {consultation.queue_number && (
              <div className="detail-item">
                <strong>Queue #:</strong>
                <p>{consultation.queue_number}</p>
              </div>
            )}
            {consultation.purpose_visit && (
              <div className="detail-item">
                <strong>Purpose:</strong>
                <p>{consultation.purpose_visit}</p>
              </div>
            )}
            {consultation.nature_visit && (
              <div className="detail-item">
                <strong>Nature:</strong>
                <p>{consultation.nature_visit}</p>
              </div>
            )}
            {consultation.chief_complaint && (
              <div className="detail-item">
                <strong>Chief Complaint:</strong>
                <p>{consultation.chief_complaint}</p>
              </div>
            )}
            {consultation.diagnosis && (
              <div className="detail-item">
                <strong>Diagnosis:</strong>
                <p>{consultation.diagnosis}</p>
              </div>
            )}
            {consultation.treatment && (
              <div className="detail-item">
                <strong>Treatment:</strong>
                <p>{consultation.treatment}</p>
              </div>
            )}
            {(consultation.systolic_bp || consultation.diastolic_bp) && (
              <div className="detail-item">
                <strong>BP:</strong>
                <p>{consultation.systolic_bp || "—"}/{consultation.diastolic_bp || "—"} mmHg</p>
              </div>
            )}
            {consultation.temperature && (
              <div className="detail-item">
                <strong>Temp:</strong>
                <p>{consultation.temperature}°C</p>
              </div>
            )}
            {consultation.pulse_rate && (
              <div className="detail-item">
                <strong>HR:</strong>
                <p>{consultation.pulse_rate} bpm</p>
              </div>
            )}
          </div>

          <div className="consult-record-actions">
            <button
              onClick={() => onPrintOPD(patient, consultation)}
              className="print-btn"
            >
              Print OPD
            </button>

            {hasReferral(consultation) && (
              <button
                onClick={handlePrintReferral}
                className="print-referral-btn"
                title="Print referral form"
              >
                📋 Print Referral
              </button>
            )}

            <button
              onClick={() => onEditConsult(consultation)}
              className="update-btn"
            >
              Update
            </button>

            <button
              onClick={() => onDeleteConsult(consultation.consultation_id)}
              className="delete-btn"
              disabled={deletingConsultation}
            >
              {deletingConsultation ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
