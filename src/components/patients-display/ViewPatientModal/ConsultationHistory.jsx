import { useState } from "react";
import ConsultationRecord from "./ConsultationRecord";

export default function ConsultationHistory({
  patient,
  consultationHistory,
  consultLoading,
  onDeleteConsult,
  onEditConsult,
  onPrintOPD,
  deletingConsultation,
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="section-container consultation-section">
      <button 
        className="section-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        <span className={`toggle-icon ${expanded ? 'open' : 'closed'}`}>▼</span>
        <h4>Consultation History</h4>
        <span className="member-count">{consultationHistory.length}</span>
      </button>

      {expanded && (
        <div className="section-content">
          {consultLoading ? (
            <p>Loading consultation history...</p>
          ) : consultationHistory.length === 0 ? (
            <p className="muted">No consultation history found.</p>
          ) : (
            <div className="consult-history">
              {consultationHistory.map((consult) => (
                <ConsultationRecord
                  key={consult.consultation_id}
                  consultation={consult}
                  patient={patient}
                  onPrintOPD={onPrintOPD}
                  onEditConsult={onEditConsult}
                  onDeleteConsult={onDeleteConsult}
                  deletingConsultation={deletingConsultation}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
