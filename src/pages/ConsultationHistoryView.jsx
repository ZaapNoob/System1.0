import { useState, useEffect } from "react";
import Consultation from "./modal/consultation";
import { useConsultationHistory } from "../hooks/useConsultationHistory";
import { useRefresh } from "../hooks/useRefresh";
import { useModal } from "../components/modal/ModalProvider";
import "./ConsultationHistoryView.css";

export default function ConsultationHistoryView({ patient }) {

  const [editingConsultation, setEditingConsultation] = useState(null);
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
    setEditingConsultation(consultation);
  };

  const handleCloseEdit = () => {
    setEditingConsultation(null);
    // Auto-refresh after closing edit
    triggerRefresh();
  };

  // If editing, show the Consultation form instead of the table
  if (editingConsultation) {
    return (
      <div className="consultation-history">
        <button
          className="back-btn"
          onClick={() => setEditingConsultation(null)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            marginBottom: "10px"
          }}
        >
          ← Back to History
        </button>
        <Consultation 
          patient={patient} 
          consultation={editingConsultation}
          isEditing={true}
          onClose={handleCloseEdit}
          onSaved={triggerRefresh}
        />
      </div>
    );
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