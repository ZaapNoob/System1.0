import { useState } from "react";
import { acceptQueuePatient } from "../api/queue";

export default function useAcceptQueue({ onAccepted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAcceptQueue = async (queueItem, onModalOpen) => {
    if (!queueItem?.id) return;

    setLoading(true);
    setError(null);

    try {
      const res = await acceptQueuePatient(queueItem.id);

      if (!res.success) {
        setError(res.message || "Failed to accept patient");
        return;
      }

      // Call the per-call callback if provided (for opening modal)
      if (onModalOpen) {
        onModalOpen(res.data);
      }

      // Call the hook-level callback if provided
      if (onAccepted) {
        onAccepted(res.data);
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return { handleAcceptQueue, loading, error };
}
