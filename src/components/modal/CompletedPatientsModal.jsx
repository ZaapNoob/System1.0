import { useEffect, useState } from "react";
import { useModal } from "./ModalProvider";
import "./CompletedPatientsModal.css";

export default function CompletedPatientsModal({ userId, doctorId, encoderId, role, onClose, isToday = false }) {
  const [completedPatients, setCompletedPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { closeModal } = useModal();

  useEffect(() => {
    // Accept userId, doctorId, or encoderId
    if (!userId && !doctorId && !encoderId) return;

    setLoading(true);
    
    // Build query params - pass whichever ID is provided
    const params = new URLSearchParams();
    if (doctorId) {
      params.append('doctor_id', doctorId);
    } else if (encoderId) {
      params.append('encoded_by', encoderId);
    } else {
      params.append('user_id', userId);
    }

    // Choose API endpoint based on isToday flag
    const apiEndpoint = isToday 
      ? `/api/Queue/get-completed-patients-today.php?${params.toString()}`
      : `/api/Queue/get-completed-patients.php?${params.toString()}`;
    
    fetch(apiEndpoint)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCompletedPatients(data.data || []);
        }
      })
      .catch((err) => {
        console.error("❌ Error loading completed patients:", err);
        setCompletedPatients([]);
      })
      .finally(() => setLoading(false));
  }, [userId, doctorId, encoderId, isToday]);

  const filteredPatients = completedPatients.filter((patient) =>
    `${patient.first_name} ${patient.last_name} ${patient.queue_number} ${patient.queue_code}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Get title based on whether filtering by doctor, user, or encoder
  const getTitle = () => {
    if (encoderId && role === "encoder") {
      return isToday 
        ? `🧾 Today's Encoded Consultations` 
        : `🧾 All Encoded Consultations`;
    }
    if (doctorId && completedPatients[0]?.doctor_name) {
      return isToday 
        ? `👨‍⚕️ Dr. ${completedPatients[0].doctor_name} - Today's Completed` 
        : `👨‍⚕️ Dr. ${completedPatients[0].doctor_name} - Completed Patients`;
    }
    return isToday ? "📅 Today's Completed Patients" : "📊 Completed Patients";
  };

  return (
    <div className="completed-patients-modal">
      <div className="modal-header-completed">
        <h2>{getTitle()}</h2>
        <p className="modal-subtitle">
          {isToday 
            ? `Today's completed patients: ${completedPatients.length}` 
            : `Total completed patients: ${completedPatients.length}`}
        </p>
      </div>

      <div className="modal-search-completed">
        <input
          type="text"
          placeholder="🔍 Search patient name or queue number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input-completed"
        />
      </div>

      <div className="modal-content-completed">
        {loading ? (
          <div className="loading-state">Loading completed patients...</div>
        ) : filteredPatients.length === 0 ? (
          <div className="empty-state">
            {completedPatients.length === 0
              ? "No completed patients yet"
              : "No matching results"}
          </div>
        ) : (
          <table className="patients-table-completed">
            <thead>
              <tr>
                <th>Queue #</th>
                <th>Patient Name</th>
                <th>Type</th>
                <th>Date</th>
                <th>Vitals</th>
                <th>Created</th>
                {doctorId && <th>Assigned By</th>}
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="patient-row-completed">
                  <td className="queue-col">
                    <strong>{patient.queue_number}</strong>
                    <div className="queue-code">{patient.queue_code}</div>
                  </td>
                  <td className="patient-name-col">
                    {patient.first_name} {patient.middle_name ? patient.middle_name + " " : ""}
                    {patient.last_name}
                  </td>
                  <td className="type-col">
                    <span
                      className={`type-badge ${patient.queue_type.toLowerCase()}`}
                    >
                      {patient.queue_type}
                    </span>
                  </td>
                  <td className="date-col">{patient.queue_date}</td>
                  <td className="vitals-col">
                    <div className="vitals-mini">
                      {patient.temperature && <span>🌡️ {patient.temperature}°C</span>}
                      {patient.systolic_bp && patient.diastolic_bp && (
                        <span>💓 {patient.systolic_bp}/{patient.diastolic_bp}</span>
                      )}
                    </div>
                  </td>
                  <td className="created-col">{patient.created_at.split(" ")[0]}</td>
                  {doctorId && (
                    <td className="created-col">
                      {patient.administered_by_name || "—"}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="modal-footer-completed">
        <button className="btn-close-completed" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
}
