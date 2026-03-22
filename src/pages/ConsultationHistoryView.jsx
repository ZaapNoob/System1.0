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
    <div className="consultation-history">
      {loadingHistory ? (
        <div>Loading consultation history...</div>
      ) : consultHistory && consultHistory.length > 0 ? (
        <>
          <table className="consultation-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Doctor</th>
                <th>CC</th>
                <th>Treatment</th>
                <th>Diagnosis</th>
                <th>History Illness</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {consultHistory.map((c) => (
                <tr key={c.id}>
                  <td>{c.visit_date}</td>
                  <td>{c.doctor_name}</td>
                  <td>{c.chief_complaint || "-"}</td>
                  <td>{c.treatment || "-"}</td>
                  <td>{c.diagnosis || "-"}</td>
                  <td>{c.patient_illness || "-"}</td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(c)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ADD NEW CONSULTATION BUTTON */}
          <div style={{ marginTop: "10px" }}>
            <button
              className="add-consultation-btn"
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
              ➕ Add New Consultation
            </button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p>No consultation history found</p>
          <button
            className="add-consultation-btn"
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
            ➕ Add New Consultation
          </button>
        </div>
      )}
    </div>
  );
}