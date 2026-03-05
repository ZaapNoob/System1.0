import React, { createContext, useContext } from 'react';
import useWebSocket from '../hooks/useWebSocket';

/**
 * Global WebSocket Context
 * Provides real-time queue and assignment updates to entire app
 */
const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const webSocket = useWebSocket();

  return (
    <WebSocketContext.Provider value={webSocket}>
      {children}
    </WebSocketContext.Provider>
  );
}

/**
 * Hook to use WebSocket anywhere in the app
 * @returns {Object} { connected, waitingQueue, doctorAssignments, send }
 */
export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within WebSocketProvider');
  }
  return context;
}

