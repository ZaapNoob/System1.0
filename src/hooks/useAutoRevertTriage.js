import { useState, useEffect } from "react";
import API from "../config/api";

/**
 * Custom hook for managing triage state with auto-revert on incomplete sessions
 * 
 * Features:
 * - Tracks active triage patient in localStorage
 * - Auto-reverts to 'waiting' status on page reload if incomplete
 * - Clears API cache after revert
 * - Manages assignment completion flag
 * 
 * @returns {Object} Triage state and functions
 *   - triageQueueId: Current patient queue ID
 *   - assignmentCompleted: Boolean flag for assignment completion
 *   - setTriageQueueId: Set patient queue ID
 *   - setAssignmentCompleted: Set assignment flag
 *   - revertTriage: Async function to revert patient to waiting
 */
export default function useAutoRevertTriage() {
  const [triageQueueId, setTriageQueueId] = useState(null);
  const [assignmentCompleted, setAssignmentCompleted] = useState(false);

  // ===============================
  // AUTO-REVERT INCOMPLETE TRIAGE ON MOUNT
  // ===============================
  useEffect(() => {
    const checkAndRevertIncompleteTriage = async () => {
      // Check if there's an incomplete triage from previous session
      const storedTriageQueueId = localStorage.getItem("activeTriageQueueId");
      const storedAssignmentCompleted = localStorage.getItem("triageAssignmentCompleted") === "true";

      if (storedTriageQueueId && !storedAssignmentCompleted) {
        console.warn("⚠️ Found incomplete triage from previous session. Auto-reverting...");

        try {
          // Clear waiting queue cache so fresh data loads after revert
          const cacheKey = `cache_${btoa(`${API}/Queue/get-waiting.php`)}`;
          localStorage.removeItem(cacheKey);

          // Revert incomplete triage back to waiting
          const res = await fetch(`${API}/Queue/revert-triage.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ queue_id: storedTriageQueueId })
          });

          const data = await res.json();
          if (data.success) {
            console.log("✅ Auto-reverted incomplete triage to waiting queue");
          }
        } catch (err) {
          console.error("❌ Failed to auto-revert triage:", err);
        } finally {
          // Clean up stored triage state
          localStorage.removeItem("activeTriageQueueId");
          localStorage.removeItem("triageAssignmentCompleted");
        }
      }
    };

    checkAndRevertIncompleteTriage();
  }, []);

  // ===============================
  // REVERT TRIAGE TO WAITING
  // ===============================
  const revertTriage = async (queueId) => {
    if (!queueId) return;

    try {
      const res = await fetch(`${API}/Queue/revert-triage.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queue_id: queueId })
      });

      const data = await res.json();
      if (data.success) {
        console.log("✅ Patient reverted to waiting queue");

        // Clear cache so next fetch gets fresh data from API
        const cacheKey = `cache_${btoa(`${API}/Queue/get-waiting.php`)}`;
        localStorage.removeItem(cacheKey);
      } else {
        console.warn("⚠️ Patient already assigned or not in triage status");
      }
    } catch (err) {
      console.error("❌ Failed to revert triage:", err);
    }
  };

  return {
    triageQueueId,
    assignmentCompleted,
    setTriageQueueId,
    setAssignmentCompleted,
    revertTriage
  };
}
