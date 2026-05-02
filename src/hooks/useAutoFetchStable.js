import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useWebSocketContext } from "../context/WebSocketContext";

/**
 * Smart fetch hook that uses WebSocket when available, polls only as fallback
 * For doctor-assignments and encoder, filters by doctorId and status/date automatically
 *
 * @param {string} dataType - Type of data: 'waiting-queue', 'doctor-assignments', or 'encoder-queue'
 * @param {string} url - Fallback API endpoint (only used if WebSocket unavailable)
 * @param {number} fallbackInterval - Polling interval for WebSocket disconnection (default: 20000ms)
 * @param {number} doctorId - (Optional) Doctor ID to filter assignments/encoder for specific doctor
 * @param {string|string[]} statusFilter - (Optional) Status or array of statuses to filter by (e.g., 'waiting' or ['waiting', 'serving'])
 */
export default function useAutoFetchStable(dataType, url, fallbackInterval = 20000, doctorId = null, statusFilter = null) {
  const { connected, waitingQueue, doctorAssignments, encoderQueue } = useWebSocketContext();
  
  const [data, setData] = useState([]);
  const [isUsingWebSocket, setIsUsingWebSocket] = useState(false);
  const timerRef = useRef(null);
  const lastDataKeysRef = useRef(null); // Track last data to prevent unnecessary updates

  // ✅ Memoize sourceData selection to prevent infinite loops
  const sourceData = useMemo(() => {
    if (dataType === 'waiting-queue') {
      return waitingQueue;
    } else if (dataType === 'doctor-assignments') {
      return doctorAssignments;
    } else if (dataType === 'encoder-queue') {
      return encoderQueue;
    }
    return [];
  }, [dataType, waitingQueue, doctorAssignments, encoderQueue]);

  // ✅ Memoize normalizeData function
  const normalizeData = useMemo(() => (items) => {
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
  }, []);

  // ✅ Helper to get data signature for comparison (avoids object reference comparison)
  const getDataSignature = useCallback((items) => {
    if (!Array.isArray(items) || items.length === 0) return null;
    // Create a simple signature from item IDs and lengths
    return items.map(item => item.id || item.queue_id || JSON.stringify(item)).join('|');
  }, []);

  // ✅ Effect 1: Handle WebSocket data when connected
  useEffect(() => {
    if (!connected || !Array.isArray(sourceData)) {
      console.log(`[useAutoFetchStable] WebSocket not ready: connected=${connected}, hasData=${Array.isArray(sourceData)}`);
      return;
    }

    const statusArray = statusFilter ? (Array.isArray(statusFilter) ? statusFilter : [statusFilter]) : null;

    let wsData = sourceData;
    if ((dataType === 'doctor-assignments' || dataType === 'encoder-queue') && Array.isArray(wsData)) {
      if (doctorId) {
        wsData = wsData.filter(item => item.doctor_id === doctorId);
      }
      if (statusArray && statusArray.length > 0) {
        wsData = wsData.filter(item => statusArray.includes(item.status));
      }
    }

    console.log(`[useAutoFetchStable] ${dataType}: Got ${wsData.length} items from WebSocket (after filtering)`);

    // ✅ Only update if data actually changed
    const newSignature = getDataSignature(wsData);
    if (newSignature !== lastDataKeysRef.current) {
      lastDataKeysRef.current = newSignature;
      
      if (wsData.length > 0) {
        const normalizedData = normalizeData(wsData);
        setData(normalizedData);
      } else {
        setData([]);
      }
      
      setIsUsingWebSocket(true);
      
      // Clear any pending fallback polls
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [connected, sourceData, dataType, doctorId, statusFilter, normalizeData, getDataSignature]);

  // ✅ Effect 2: Handle fallback polling when WebSocket disconnected
  useEffect(() => {
    if (connected || !url) return;

    // Prevent duplicate polling intervals
    if (timerRef.current) return;

    console.log(`[useAutoFetchStable] ${dataType}: WebSocket not connected, starting fallback polling...`);
    setIsUsingWebSocket(false);

    const fetchData = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const json = await res.json();
        
        if (json?.success) {
          const newData = normalizeData(json.data || []);
          setData(newData);
          console.log(`[useAutoFetchStable] ${dataType}: Fetched ${newData.length} items via fallback`);
        } else {
          console.warn(`[useAutoFetchStable] ${dataType}: API returned success=false`);
        }
      } catch (err) {
        console.error(`[useAutoFetchStable] ${dataType} fallback polling error:`, err.message);
      }
    };

    // Immediate first fetch (don't wait for interval)
    console.log(`[useAutoFetchStable] ${dataType}: Doing immediate first fetch...`);
    fetchData();

    // Set up polling interval for subsequent fetches
    timerRef.current = setInterval(() => {
      console.log(`[useAutoFetchStable] ${dataType}: Polling interval triggered`);
      fetchData();
    }, fallbackInterval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [connected, url, fallbackInterval, dataType, normalizeData]);

  return data;
}
