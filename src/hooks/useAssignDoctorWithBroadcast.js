import { useState } from "react";
import { assignDoctor } from "../api/doctor";
import { useWebSocketContext } from "../context/WebSocketContext";

/**
 * Hook to assign doctor to patient with automatic polling reset and WebSocket broadcast
 * @returns {Object} { handleAssignDoctor, loading, error }
 */
export const useAssignDoctorWithBroadcast = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { send: wsSend } = useWebSocketContext();

  const handleAssignDoctor = async (patient, selectedDoctor, triggerPollingReset) => {
    if (!selectedDoctor) {
      setError("Please select a doctor");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const doctorId = Number(selectedDoctor);
      
      // 📡 Assign doctor to patient via API
      await assignDoctor({
        queue_id: patient.id,
        patient_id: patient.patient_id,
        doctor_id: doctorId
      });

      // 📡 After API success, trigger WebSocket live fetch
      // Server will fetch fresh doctor_patient_queue data for ALL doctors and broadcast to all clients
      // Each client filters by their own doctor ID via the hook
      wsSend({
        type: 'refresh-doctor-queue-now'
      });
      console.log('📡 Doctor assigned - triggering WebSocket live fetch for ALL doctor assignments');

      setLoading(false);
      return true;
    } catch (err) {
      console.error("Failed to assign doctor:", err);
      setError(err.message || "Failed to assign doctor");
      setLoading(false);
      return false;
    }
  };

  return { handleAssignDoctor, loading, error };
};
