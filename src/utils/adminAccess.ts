import { io, Socket } from "socket.io-client";

const SERVER_URL = "http://localhost:3001";

// Singleton socket instance
let socket: Socket | null = null;

// Current admin access state
let adminAccessEnabled = false;

// Callbacks for state changes
const listeners: Set<(enabled: boolean) => void> = new Set();

// Initialize socket connection
export const initializeAdminAccess = () => {
  if (!socket) {
    socket = io(SERVER_URL, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Admin access listener connected:", socket?.id);
    });

    socket.on("state-sync", (state: Record<string, any>) => {
      if (typeof state.admin_access_enabled === "boolean") {
        adminAccessEnabled = state.admin_access_enabled;
        notifyListeners();
      }
    });

    socket.on("state-update", (state: Record<string, any>) => {
      if (typeof state.admin_access_enabled === "boolean") {
        adminAccessEnabled = state.admin_access_enabled;
        notifyListeners();
      }
    });
  }
};

// Get current admin access state
export const isAdminAccessEnabled = (): boolean => {
  return adminAccessEnabled;
};

// Subscribe to admin access changes
export const subscribeToAdminAccess = (
  callback: (enabled: boolean) => void
): (() => void) => {
  listeners.add(callback);
  // Immediately call with current state
  callback(adminAccessEnabled);

  // Return unsubscribe function
  return () => {
    listeners.delete(callback);
  };
};

// Notify all listeners of state change
const notifyListeners = () => {
  listeners.forEach((callback) => callback(adminAccessEnabled));
};
