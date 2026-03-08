import { useCallback } from "react";
import API from "../config/api";
import { useWebSocketContext } from "../context/WebSocketContext";
import { useWebSocketPolling } from "./useWebSocketPolling";

/**
 * Hook to handle cancelling waiting patients from today's queue
 * @returns {Object} { handleCancelWaitingQueues: Function }
 */
export const useCancelWaitingQueues = () => {
  const { send: wsSend } = useWebSocketContext();
  const { triggerPollingReset } = useWebSocketPolling();

  const handleCancelWaitingQueues = useCallback(async () => {
    const confirmCancel = window.confirm(
      "Cancel all waiting queues from today?"
    );

    if (!confirmCancel) return;

    try {
      console.log("📍 Cancel button clicked - sending request to:", `${API}/Queue/cancel-waiting.php`);
      
      const res = await fetch(`${API}/Queue/cancel-waiting.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("📍 Response status:", res.status);

      const data = await res.json();
      console.log("📍 Response data:", data);

      if (data.success) {
        alert(`✅ Successfully cancelled ${data.affected_rows} waiting patients.`);

        // Force immediate refresh via WebSocket
        wsSend({ type: "refresh-queue-now" });
        
        // Also trigger polling reset to ensure data updates
        triggerPollingReset();

      } else {
        alert(`❌ Failed to cancel queues: ${data.message}`);
      }
    } catch (err) {
      console.error("❌ Cancel error:", err);
      alert(`Error: ${err.message}`);
    }
  }, [wsSend, triggerPollingReset]);

  return { handleCancelWaitingQueues };
};

export default useCancelWaitingQueues;
