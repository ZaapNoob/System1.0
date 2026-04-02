import { useState, useEffect } from "react";
import { useWebSocketContext } from "../context/WebSocketContext";
import "./TVDisplayFullscreen.css";

/**
 * Full-screen TV Display Component
 * Shows only queue numbers in large format suitable for TV display via HDMI
 * Displays in real-time via WebSocket
 */
export default function TVDisplayFullscreen() {
  const { doctorAssignments } = useWebSocketContext();
  const [activeQueues, setActiveQueues] = useState([]);

  // Filter and sort active queues
  useEffect(() => {
    if (!doctorAssignments || doctorAssignments.length === 0) {
      setActiveQueues([]);
      return;
    }

    const filtered = doctorAssignments
      .filter(q => q.is_active === 1 || q.status === 'serving')
      .sort((a, b) => {
        // Sort by doctor_id first, then by patient_queue_id
        if (a.doctor_id !== b.doctor_id) {
          return a.doctor_id - b.doctor_id;
        }
        const aId = a.patient_queue_id || a.id;
        const bId = b.patient_queue_id || b.id;
        return aId - bId;
      });

    setActiveQueues(filtered);
  }, [doctorAssignments]);

  // Get queue code from queue object (P-001, P-002, etc.)
  const getQueueNumber = (queue) => {
    return queue.queue_code || queue.patient_queue_id || queue.queue_number || queue.id || '---';
  };

  return (
    <div className="tv-fullscreen-container">
      {activeQueues.length === 0 ? (
        <div className="tv-fullscreen-empty">
          <div className="tv-no-queue-message">No Active Queues</div>
        </div>
      ) : (
        <div className="tv-fullscreen-grid">
          {activeQueues.map((queue, index) => (
            <div key={`${queue.doctor_id}-${index}`} className="tv-fullscreen-slot">
              <div className="tv-fullscreen-number">
                {getQueueNumber(queue)}
              </div>
              <div className="tv-fullscreen-type-badge">
                {queue.queue_type?.toUpperCase() === 'PRIORITY' ? '⚡ PRIORITY' : '📋 REGULAR'}
              </div>
              <div className="tv-fullscreen-doctor">
                Dr. {queue.doctor_name || `Doctor ${queue.doctor_id}`}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Close button in top-right */}
      <button
        onClick={() => window.close()}
        className="tv-fullscreen-close"
        title="Close (Press ESC to also close)"
      >
        ✕
      </button>

      {/* Handle ESC key to close */}
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
