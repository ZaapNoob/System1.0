import { useState } from "react";
import { useWebSocketContext } from "../context/WebSocketContext";
import { acceptQueuePatient } from "../api/queue";

export default function useAcceptQueue({ onAccepted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { send: wsSend } = useWebSocketContext();

  const handleAcceptQueue = async (queueItem, onModalOpen) => {
    if (!queueItem?.id) return;

    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Call API to accept patient
      console.log('🟡 [AcceptQueue] Calling API to accept patient:', queueItem.id);
      const res = await acceptQueuePatient(queueItem.id);

      if (!res.success) {
        setError(res.message || "Failed to accept patient");
        console.error('❌ [AcceptQueue] API failed:', res.message);
        return;
      }

      console.log('✅ [AcceptQueue] API succeeded, patient accepted');

      // 2️⃣ API succeeded - trigger WebSocket live fetch
      // Send message to WebSocket server to fetch fresh queue data
      if (wsSend) {
        console.log('📡 [AcceptQueue] Sending WebSocket refresh trigger...');
        wsSend({
          type: 'refresh-queue-now',
          message: 'Patient accepted - refresh queue immediately',
          queueId: queueItem.id,
          timestamp: new Date().toISOString()
        });
        console.log('✅ [AcceptQueue] WebSocket refresh message sent successfully');
      } else {
        console.error('❌ [AcceptQueue] wsSend is not available!', { wsSend });
      }

      // 3️⃣ Open modal with accepted patient data
      if (onModalOpen) {
        onModalOpen(res.data);
      }

      // 4️⃣ Call hook-level callback
      if (onAccepted) {
        onAccepted(res.data);
      }
    } catch (err) {
      console.error('❌ [AcceptQueue] Error:', err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return { handleAcceptQueue, loading, error };
}
