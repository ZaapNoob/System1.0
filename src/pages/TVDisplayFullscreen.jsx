import { useState, useEffect } from "react";
import { useWebSocketContext } from "../context/WebSocketContext";
import "./TVDisplayFullscreen.css";

/**
 * Full-screen TV Display Component
 * Shows active queue numbers and waiting queue list for each doctor
 * Displays in real-time via WebSocket
 */
export default function TVDisplayFullscreen() {
  const { doctorAssignments } = useWebSocketContext();
  const [doctorQueues, setDoctorQueues] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second for live minute calculation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate minutes waiting from queue creation time
  const getMinutesWaiting = (createdAt) => {
    if (!createdAt) return null;
    try {
      const queueTime = new Date(createdAt);
      const minutes = Math.floor((currentTime - queueTime) / 60000);
      return minutes;
    } catch (e) {
      return null;
    }
  };

  // Format time display
  const formatQueueTime = (createdAt) => {
    if (!createdAt) return "N/A";
    try {
      const time = new Date(createdAt);
      return time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (e) {
      return "N/A";
    }
  };

  // Organize queues by doctor with active and waiting separation
  useEffect(() => {
    if (!doctorAssignments || doctorAssignments.length === 0) {
      setDoctorQueues([]);
      return;
    }

    // Group by doctor_id
    const doctors = {};
    
    doctorAssignments.forEach(queue => {
      const docId = queue.doctor_id;
      if (!doctors[docId]) {
        doctors[docId] = {
          doctor_id: docId,
          doctor_name: queue.doctor_name,
          active: null,
          waiting: []
        };
      }

      // Active patient (is_active = 1 or status = 'serving')
      if (parseInt(queue.is_active) === 1 || queue.status === 'serving') {
        doctors[docId].active = queue;
      }
      // Waiting patient (is_active = 0 or status = 'waiting')
      else if (parseInt(queue.is_active) === 0 || queue.status === 'waiting') {
        doctors[docId].waiting.push(queue);
      }
    });

    // Convert to array and sort by doctor_id
    const sorted = Object.values(doctors)
      .filter(doc => doc.active || doc.waiting.length > 0) // Only show doctors with active or waiting queues
      .sort((a, b) => a.doctor_id - b.doctor_id);

    setDoctorQueues(sorted);
  }, [doctorAssignments]);

  // Get queue code from queue object
  const getQueueNumber = (queue) => {
    return queue.queue_code || queue.patient_queue_id || queue.queue_number || queue.id || '---';
  };

  return (
    <div className="tv-fullscreen-container">
      {/* Title Header */}
      <div className="tv-logo-header">
        <div className="tv-title-text">RHU Gubat Queueing Management System</div>
      </div>

      {doctorQueues.length === 0 ? (
        <div className="tv-fullscreen-empty">
          <div className="tv-no-queue-message">No Active Queues</div>
        </div>
      ) : (
        <div className="tv-fullscreen-grid">
          {doctorQueues.map((doctor) => (
            <div key={doctor.doctor_id} className="tv-fullscreen-doctor-slot">
              {/* Left Side - Active Patient with Doctor Info */}
              <div className="tv-doctor-left-section">
                <div className="tv-doctor-header">
                  Dr. {doctor.doctor_name || `Doctor ${doctor.doctor_id}`}
                </div>

                <div className="tv-active-section">
                  {doctor.active ? (
                    <>
                      <div className="tv-active-section-header">
                        <div className="tv-status-label">NOW SERVING</div>
                      </div>
                      <div className="tv-active-section-content">
                        <div className="tv-fullscreen-number">
                          {getQueueNumber(doctor.active)}
                        </div>
                        <div className="tv-active-time">
                          Started: {formatQueueTime(doctor.active.created_at || doctor.active.updated_at)}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="tv-no-current">No Current Patient</div>
                  )}
                </div>
              </div>

              {/* Right Side - Waiting List */}
              <div className="tv-doctor-right-section">
                {doctor.waiting && doctor.waiting.length > 0 ? (
                  <>
                    <div className="tv-waiting-header">
                      📋 WAITING ({doctor.waiting.length})
                    </div>
                    <div className="tv-waiting-list">
                      {doctor.waiting.slice(0, 3).map((queue, idx) => {
                        const minutesWaiting = getMinutesWaiting(queue.created_at);
                        return (
                          <div key={`${doctor.doctor_id}-waiting-${idx}`} className="tv-waiting-item">
                            <span className="tv-waiting-rank">#{idx + 1}</span>
                            <span className="tv-waiting-queue">{getQueueNumber(queue)}</span>
                            <div className="tv-waiting-time">
                              <span className="tv-time-icon">🕐</span>
                              <span className="tv-time-text">
                                {formatQueueTime(queue.created_at)}
                                {minutesWaiting !== null && ` (+${minutesWaiting}m)`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {doctor.waiting.length > 3 && (
                        <div className="tv-waiting-more">+{doctor.waiting.length - 3} more</div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="tv-no-waiting">No Waiting Patients</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Close button */}
      <button
        onClick={() => window.close()}
        className="tv-fullscreen-close"
        title="Close (Press ESC to also close)"
      >
        ✕
      </button>

      <EscapeKeyListener />
    </div>
  );
}

/**
 * Hook to listen for ESC key and close the window
 */
function EscapeKeyListener() {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        window.close();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return null;
}
