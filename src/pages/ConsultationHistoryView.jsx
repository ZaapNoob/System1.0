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
  
  // Fetch consultations using the hook - will refetch when refreshTrigger changes
  const { consultHistory, loadingHistory } = useConsultationHistory(
    patient?.patient_id,
    refreshTrigger
  );

  const handleEdit = (consultation) => {
    console.log("🎯 Opening EditConsultationModal for consultation:", consultation.id);
    openModal(
      <EditConsultationModal
        consultation={consultation}
        patient={patient}
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