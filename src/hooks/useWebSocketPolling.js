import { useState, useEffect } from "react";
import { useWebSocketContext } from "../context/WebSocketContext";

/**
 * Hook to manage polling reset trigger and WebSocket message handling
 * Automatically triggers polling acceleration when WebSocket messages arrive
 * @returns {Object} { pollingReset, triggerPollingReset }
 */
export const useWebSocketPolling = () => {
  const [pollingReset, setPollingReset] = useState(0);
  const { lastUpdate: wsMessage } = useWebSocketContext();

  const triggerPollingReset = () => {
    setPollingReset(prev => prev + 1);
    console.log("🚀 Accept clicked: 3s fast polling activated");
  };

  // Handle real-time WebSocket updates for queue
  useEffect(() => {
    if (wsMessage?.type === 'waiting-queue' && wsMessage?.data) {
      console.log('🔔 Real-time queue update via WebSocket:', wsMessage.data);
      triggerPollingReset(); // Ensure immediate local refresh
    }
  }, [wsMessage?.type, wsMessage?.timestamp]);

  // Handle real-time WebSocket updates for doctor assignments
  useEffect(() => {
    if (wsMessage?.type === 'doctor-assignments' && wsMessage?.data) {
      console.log('🔔 Real-time doctor assignments update via WebSocket:', wsMessage.data);
      triggerPollingReset(); // Ensure immediate local refresh
    }
  }, [wsMessage?.type, wsMessage?.timestamp]);

  // Handle real-time WebSocket updates when another client accepts a patient
  useEffect(() => {
    if (wsMessage?.type === 'queue-updated' && wsMessage?.data) {
      console.log('🔔 Queue updated by another client via WebSocket:', wsMessage.data);
      triggerPollingReset(); // Speed up polling to fetch latest queue immediately
    }
  }, [wsMessage?.type, wsMessage?.timestamp]);

  return { pollingReset, triggerPollingReset };
};
