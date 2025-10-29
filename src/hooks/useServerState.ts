import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const SERVER_URL = "http://localhost:3001";

let socket: Socket | null = null;

interface UseServerStateOptions {
  onStateUpdate?: (state: Record<string, any>) => void;
}

export const useServerState = (options?: UseServerStateOptions) => {
  const socketRef = useRef<Socket | null>(null);
  const onStateUpdateRef = useRef(options?.onStateUpdate);

  // Keep the callback ref updated
  useEffect(() => {
    onStateUpdateRef.current = options?.onStateUpdate;
  }, [options?.onStateUpdate]);

  useEffect(() => {
    // Initialize socket connection if not already connected
    if (!socket) {
      socket = io(SERVER_URL, {
        transports: ["websocket", "polling"],
      });

      socket.on("connect", () => {
        console.log("Connected to server:", socket?.id);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from server");
      });
    }

    socketRef.current = socket;

    // Set up handlers for both initial sync and updates
    const handleStateSync = (state: Record<string, any>) => {
      console.log("Received initial state sync:", state);
      if (onStateUpdateRef.current) {
        onStateUpdateRef.current(state);
      }
    };

    const handleStateUpdate = (state: Record<string, any>) => {
      console.log("Received state update:", state);
      if (onStateUpdateRef.current) {
        onStateUpdateRef.current(state);
      }
    };

    // Listen to both state-sync (initial) and state-update (changes)
    socket.on("state-sync", handleStateSync);
    socket.on("state-update", handleStateUpdate);

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.off("state-sync", handleStateSync);
        socket.off("state-update", handleStateUpdate);
      }
    };
  }, []);

  const updateState = useCallback((updates: Record<string, any>) => {
    if (socketRef.current && socketRef.current.connected) {
      console.log("Sending state update:", updates);
      socketRef.current.emit("update-state", updates);
    } else {
      console.warn("Socket not connected, cannot send state update");
    }
  }, []);

  return { updateState };
};
