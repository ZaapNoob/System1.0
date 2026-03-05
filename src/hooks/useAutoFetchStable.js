import { useEffect, useRef, useState } from "react";
import { useWebSocketContext } from "../context/WebSocketContext";

/**
 * Smart fetch hook that uses WebSocket when available, polls only as fallback
 * For doctor-assignments, filters by doctorId and status automatically
 *
 * @param {string} dataType - Type of data: 'waiting-queue' or 'doctor-assignments'
 * @param {string} url - Fallback API endpoint (only used if WebSocket unavailable)
 * @param {number} fallbackInterval - Polling interval for WebSocket disconnection (default: 20000ms)
 * @param {number} doctorId - (Optional) Doctor ID to filter assignments for specific doctor
 * @param {string|string[]} statusFilter - (Optional) Status or array of statuses to filter by (e.g., 'waiting' or ['waiting', 'serving'])
 */
export default function useAutoFetchStable(dataType, url, fallbackInterval = 20000, doctorId = null, statusFilter = null) {
  const { connected, waitingQueue, doctorAssignments } = useWebSocketContext();
  
  const [data, setData] = useState([]);
  const [isUsingWebSocket, setIsUsingWebSocket] = useState(false);
  const timerRef = useRef(null);

  // Get the appropriate data source (don't filter here - do it in useEffect)
  const sourceData = dataType === 'waiting-queue' ? waitingQueue : doctorAssignments;

  // Normalize data to ensure consistent field names
  const normalizeData = (items) => {
    if (!Array.isArray(items)) return [];
    return items.map(item => {
      // If WebSocket sends first_name/last_name separately, combine them
      if (!item.patient_name && item.first_name) {
        return {
          ...item,
          patient_name: `${item.first_name}${item.last_name ? ' ' + item.last_name : ''}`.trim()
        };
      }
      return item;
    });
  };

  useEffect(() => {
    // Convert statusFilter to array if it's a string
    const statusArray = statusFilter ? (Array.isArray(statusFilter) ? statusFilter : [statusFilter]) : null;

    // Apply filtering inside useEffect to avoid infinite loop
    let wsData = sourceData;
    if (dataType === 'doctor-assignments' && Array.isArray(wsData)) {
      // Filter by doctor_id
      if (doctorId) {
        wsData = wsData.filter(item => item.doctor_id === doctorId);
      }
      // Filter by status (e.g., ['waiting', 'serving'])
      if (statusArray && statusArray.length > 0) {
        wsData = wsData.filter(item => statusArray.includes(item.status));
      }
    }

    if (connected && Array.isArray(wsData) && wsData.length > 0) {
      // ✅ WebSocket is connected and has actual data
      const normalizedData = normalizeData(wsData);
      setData(normalizedData);
      setIsUsingWebSocket(true);
      
      // Clear any pending fallback polls
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else if (!connected && url) {
      // ⛔ WebSocket disconnected, use polling fallback
      setIsUsingWebSocket(false);
      
      const fetchData = async () => {
        try {
          const res = await fetch(url);
          const json = await res.json();
          
          if (json?.success) {
            const newData = normalizeData(json.data || []);
            setData(newData);
          }
        } catch (err) {
          console.error(`Fallback polling error for ${dataType}:`, err);
        }
      };
      
      // Immediate first fetch
      fetchData();
      
      // Set up polling interval
      timerRef.current = setInterval(fetchData, fallbackInterval);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // ⚠️ FIXED: Only depend on data length and connected status to prevent infinite loops
    // Do NOT depend on sourceData array reference - it changes on every WebSocket update
  }, [connected, sourceData?.length, url, fallbackInterval, dataType, doctorId, statusFilter]);

  return data;
}
