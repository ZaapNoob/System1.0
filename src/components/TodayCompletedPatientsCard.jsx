/**
 * Today's Completed Patients Card Component
 * 
 * By User ID:
 * <TodayCompletedPatientsCard 
 *   userId={user?.id} 
 *   completedCount={stats.todayCompleted}
 * />
 * 
 * By Doctor ID:
 * <TodayCompletedPatientsCard 
 *   doctorId={doctor?.id} 
 *   completedCount={doctor?.todayCompletedCount}
 * />
 */

import { useModal } from "./modal/ModalProvider";
import CompletedPatientsModal from "./modal/CompletedPatientsModal";

export default function TodayCompletedPatientsCard({ userId, doctorId, encoderId, completedCount, role }) {
  const { openModal } = useModal();

  const handleClick = () => {
    openModal(
      <CompletedPatientsModal
        userId={userId}
        doctorId={doctorId}
        encoderId={encoderId}
        role={role}
        isToday={true}
      />
    );
  };

  return (
    <div className="stat-card today-completed-card-clickable" onClick={handleClick}>
      <div className="stat-icon">📅</div>
      <div className="stat-content">
        <h3>{role === "encoder" ? "Today Encoded" : "Today Completed"}</h3>
        <p className="stat-number">{completedCount || 0}</p>
        <p className="stat-description">Click to view today's</p>
      </div>
    </div>
  );
}
