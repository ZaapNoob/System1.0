import { useEffect, useRef, useState } from "react";

export default function useWebSocket() {
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);

  const [waitingQueue, setWaitingQueue] = useState([]);
  const [doctorAssignments, setDoctorAssignments] = useState([]);
  const [encoderQueue, setEncoderQueue] = useState([]);

  useEffect(() => {
    // Connect to WebSocket via Apache on the standard port (443)
    // Apache proxies /ws to ws://localhost:8080
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.hostname}/ws`;

    console.log(`📡 Connecting to WebSocket: ${wsUrl}`);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setConnected(true);
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case "waiting-queue":
          setWaitingQueue(message.data);
          break;

        case "doctor-assignments":
          setDoctorAssignments(message.data);
          break;

        case "encoder-queue":
          setEncoderQueue(message.data);
          break;

        default:
          break;
      }
    };

    ws.onclose = () => {
      setConnected(false);
      console.log("⛔ WebSocket disconnected");
    };

    wsRef.current = ws;

    return () => ws.close();
  }, []);

  const send = (data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('📤 [WebSocket.send] Sending message to server:', data.type, data);
      wsRef.current.send(JSON.stringify(data));
      console.log('✅ [WebSocket.send] Message sent successfully');
    } else {
      console.warn('⚠️ [WebSocket.send] WebSocket not ready. State:', wsRef.current?.readyState, 'Expected:', WebSocket.OPEN);
    }
  };

  return {
    connected,
    waitingQueue,
    doctorAssignments,
    encoderQueue,
    send
  };
}