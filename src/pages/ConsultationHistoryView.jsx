import { useState, useEffect } from "react";
import Consultation from "./modal/consultation";
import EditConsultationModal from "../components/patients-display/EditConsultationModal";
import { useConsultationHistory } from "../hooks/useConsultationHistory";
import { useRefresh } from "../hooks/useRefresh";
import { useModal } from "../components/modal/ModalProvider";
import "./ConsultationHistoryView.css";

export default function ConsultationHistoryView({ patient }) {

  const [loading, setLoading] = useState(false);
  
  // Modal context
  const { openModal, closeModal } = useModal();
  
  // Use refresh hook to trigger data reload
  const { refreshTrigger, triggerRefresh } = useRefresh();
  
  // 🔍 DIAGNOSTIC LOG
  useEffect(() => {
    console.log("🔍 ConsultationHistoryView received patient:", patient);
    console.log("🔍 Patient ID being used:", patient?.patient_id);
    console.log("🔍 All patient fields:", patient ? Object.keys(patient) : "NO PATIENT");
  }, [patient]);
  
  // Fetch consultations using the hook - will refetch when refreshTrigger changes
  const { consultHistory, loadingHistory } = useConsultationHistory(
    patient?.patient_id,
    refreshTrigger
  );

  const handleEdit = (consultation) => {
    console.log("🎯 Opening EditConsultationModal for consultation:", consultation.id);
    // Get user from localStorage or pass as prop if ConsultationHistoryView receives it
    const token = localStorage.getItem("token");
    let currentUser = null;
    if (token) {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          currentUser = JSON.parse(userStr);
        } catch (e) {
          console.error("Failed to parse user from localStorage");
        }
      }
    }
    
    openModal(
      <EditConsultationModal
        consultation={consultation}
        patient={patient}
        user={currentUser}
        onUpdate={() => {
          console.log("✅ Consultation updated, refreshing history...");
          closeModal();
          triggerRefresh();
        }}
        onClose={() => {
          closeModal();
        }}
      />
    );
  };

  const handlePrintConsultation = (consultation) => {
    const printData = {
      ...patient,
      ...consultation,
      autoprint: false
    };
    sessionStorage.setItem("printPatient", JSON.stringify(printData));
    window.open(`/print-opd`, "PrintOPD", "width=1200,height=800");
  };

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

    const result = hasCategory || hasPersonnel || hasReason;
    
    if (!result) {
      console.log("❌ NO REFERRAL - category:", consultation?.referral_category, "personnel:", consultation?.receiving_personnel, "reason:", consultation?.reason_for_referral_2);
    } else {
      console.log("✅ HAS REFERRAL - category:", hasCategory, "personnel:", hasPersonnel, "reason:", hasReason);
    }
    
    return result;
  };

  const handlePrintReferral = (consultation) => {
    console.log("📋 Print Referral clicked for consultation:", consultation);
    console.log("📋 Checking referral data - category:", consultation?.referral_category, "personnel:", consultation?.receiving_personnel, "facility:", consultation?.receiving_facility, "reason:", consultation?.reason_for_referral_2);
    console.log("📋 Patient illness field value:", consultation?.patient_illness);
    console.log("👥 Patient object keys:", Object.keys(patient || {}));
    console.log("👥 Patient address fields:", {street: patient?.street, barangay: patient?.barangay_name, city: patient?.city_municipality, province: patient?.province});
    console.log("📋 ALL consultation keys:", Object.keys(consultation || {}));
    
    const referralData = {
      patient: patient,
      referral: consultation,
      autoprint: false
    };
    
    console.log("✅ Storing referral data to localStorage:", referralData);
    console.log("✅ Referral object keys being stored:", Object.keys(referralData.referral || {}));
    console.log("✅ Referral.patient_illness = ", referralData.referral?.patient_illness);
    console.log("✅ Referral.receiving_facility = ", referralData.referral?.receiving_facility);
    localStorage.setItem("printReferralData", JSON.stringify(referralData));
    window.open(`/print-referral`, "PrintReferral", "width=1200,height=800");
  };

  // If editing, show the Consultation form instead of the table
  if (false) {
    return null; // This section is no longer used - we use modal instead
  }
return (
  <div className="consultation-history-new">

    {loadingHistory ? (
      <div className="loading-state">Loading consultation history...</div>

    ) : consultHistory && consultHistory.length > 0 ? (
      <>
        <div className="history-list">

          {consultHistory.map((c) => (
            <div key={c.id} className="history-card">

              <div className="history-top">
                <div className="history-date">{c.visit_date}</div>
                <div className="history-doctor">{c.doctor_name}</div>
              </div>

              <div className="history-body">
                <div><strong>CC:</strong> {c.chief_complaint || "-"}</div>
                <div><strong>Diagnosis:</strong> {c.diagnosis || "-"}</div>
                <div><strong>Treatment:</strong> {c.treatment || "-"}</div>
                <div><strong>History:</strong> {c.patient_illness || "-"}</div>
              </div>

              <div className="history-actions">
                <button
                  className="edit-btn-new"
                  onClick={() => handleEdit(c)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="print-btn-new"
                  onClick={() => handlePrintConsultation(c)}
                  title="Print this consultation record"
                >
                  🖨️ Print
                </button>
                {hasReferral(c) && (
                  <button
                    className="print-referral-btn-new"
                    onClick={() => handlePrintReferral(c)}
                    title="Print referral form"
                  >
                    📋 Print Referral
                  </button>
                )}
              </div>

            </div>
          ))}

        </div>

        {/* ADD BUTTON */}
        <div className="add-section">
          <button
            className="add-consultation-btn-new"
            onClick={() => {
              openModal(
                <Consultation 
                  patient={patient}
                  isEditing={false}
                  onClose={() => {
                    closeModal();
                    triggerRefresh();
                  }}
                  onConsultationSaved={triggerRefresh}
                />
              );
            }}
          >
            ➕ Add Consultation
          </button>
        </div>
      </>
    ) : (
      <div className="empty-state-new">
        <p>No consultation history found</p>

        <button
          className="add-consultation-btn-new"
          onClick={() => {
            openModal(
              <Consultation 
                patient={patient}
                isEditing={false}
                onClose={() => {
                  closeModal();
                  triggerRefresh();
                }}
                onConsultationSaved={triggerRefresh}
              />
            );
          }}
        >
          ➕ Add First Consultation
        </button>
      </div>
    )}
  </div>
);
}