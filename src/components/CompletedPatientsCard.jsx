/**
 * Completed Patients Card Component
 * 
 * Usage in Dashboard.jsx:
 * 
 * Import at the top:
 * import CompletedPatientsCard from "../components/CompletedPatientsCard";
 * 
 * By User ID:
 * <CompletedPatientsCard 
 *   userId={user?.id} 
 *   completedCount={stats.overallCompleted}
 * />
 * 
 * By Doctor ID:
 * <CompletedPatientsCard 
 *   doctorId={doctor?.id} 
 *   completedCount={doctor?.completedCount}
 * />
 */

import { useModal } from "./modal/ModalProvider";
import CompletedPatientsModal from "./modal/CompletedPatientsModal";

export default function CompletedPatientsCard({ userId, doctorId, encoderId, completedCount, role }) {
  const { openModal } = useModal();

  const handleClick = () => {
    openModal(
      <CompletedPatientsModal
        userId={userId}
        doctorId={doctorId}
        encoderId={encoderId}
        role={role}
      />
    );
  };

  return (
    <div className="stat-card completed-card-clickable" onClick={handleClick}>
      <div className="stat-icon">📊</div>
      <div className="stat-content">
        <h3>{role === "encoder" ? "Encoded" : "Completed List"}</h3>
        <p className="stat-number">{completedCount || 0}</p>
        <p className="stat-description">Click to view all</p>
      </div>
    </div>
  );
}
