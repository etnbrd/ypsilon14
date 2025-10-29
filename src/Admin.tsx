import React, { useState } from "react";
import { useServerState } from "./hooks/useServerState";

const AdminDashboard: React.FC = () => {
  const [serverState, setServerState] = useState<Record<string, any>>({});
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const handleStateUpdate = (state: Record<string, any>) => {
    setServerState(state);
    setLastUpdate(new Date());
  };

  const { updateState } = useServerState({ onStateUpdate: handleStateUpdate });

  // Get current admin access state
  const adminAccessEnabled = serverState.admin_access_enabled || false;

  // Toggle admin access
  const toggleAdminAccess = () => {
    updateState({
      admin_access_enabled: !adminAccessEnabled,
    });
  };

  const stateKeys = Object.keys(serverState).filter(
    (key) => key !== "admin_access_enabled",
  );
  const hasState = stateKeys.length > 0;

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
        color: "rgb(255, 204, 7)",
        background: "rgb(24, 21, 21)",
        minHeight: "100vh",
        fontFamily: "monospace",
      }}
    >
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
          ADMIN DASHBOARD
        </h1>
        <div style={{ fontSize: "18px", opacity: 0.8 }}>
          YPSILON-14 STATION CONTROL
        </div>
        <div style={{ margin: "20px 0", opacity: 0.5 }}>{"=".repeat(60)}</div>
      </div>

      <div style={{ margin: "30px 0" }}>
        <div style={{ marginBottom: "10px" }}>
          <strong>STATUS:</strong>{" "}
          <span style={{ color: "#00ff00", marginLeft: "10px" }}>
            CONNECTED
          </span>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <strong>LAST UPDATE:</strong>{" "}
          <span style={{ marginLeft: "10px", opacity: 0.8 }}>
            {lastUpdate ? lastUpdate.toLocaleTimeString() : "N/A"}
          </span>
        </div>
        <div>
          <strong>STATE ENTRIES:</strong>{" "}
          <span style={{ marginLeft: "10px", opacity: 0.8 }}>
            {stateKeys.length}
          </span>
        </div>
      </div>

      <div style={{ margin: "20px 0", opacity: 0.5 }}>{"=".repeat(60)}</div>

      <div style={{ margin: "30px 0" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>
          ADMIN CONTROLS
        </h2>

        <div
          style={{
            border: "2px solid rgba(255, 204, 7, 0.5)",
            padding: "20px",
            background: "rgba(255, 204, 7, 0.1)",
            marginBottom: "30px",
          }}
        >
          <div style={{ fontSize: "18px", marginBottom: "15px" }}>
            <strong>RESTRICTED ACCESS CONTROL</strong>
          </div>
          <div style={{ marginBottom: "15px", opacity: 0.8 }}>
            Controls user access to AIRLOCKS and SYSTEM menus.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button
              onClick={toggleAdminAccess}
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                fontFamily: "monospace",
                border: "2px solid rgb(255, 204, 7)",
                background: adminAccessEnabled
                  ? "rgba(0, 255, 0, 0.2)"
                  : "rgba(255, 0, 0, 0.2)",
                color: "rgb(255, 204, 7)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {adminAccessEnabled ? "✓ ACCESS GRANTED" : "✗ ACCESS DENIED"}
            </button>
            <div
              style={{
                fontSize: "14px",
                opacity: 0.7,
              }}
            >
              Status:{" "}
              {adminAccessEnabled ? (
                <span style={{ color: "#00ff00" }}>
                  Users can access restricted menus
                </span>
              ) : (
                <span style={{ color: "#ff5555" }}>
                  Users cannot access restricted menus
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ margin: "20px 0", opacity: 0.5 }}>{"=".repeat(60)}</div>

      <div style={{ margin: "30px 0" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>GLOBAL STATE</h2>

        {!hasState && (
          <div
            style={{
              opacity: 0.6,
              fontStyle: "italic",
              padding: "40px 0",
              textAlign: "center",
            }}
          >
            <p>No state changes recorded yet.</p>
            <p>State will appear here when users interact with toggles.</p>
          </div>
        )}

        {hasState && (
          <div>
            {stateKeys.map((key) => {
              const value = serverState[key];
              return (
                <div
                  key={key}
                  style={{
                    border: "1px solid rgba(255, 204, 7, 0.3)",
                    padding: "20px",
                    background: "rgba(255, 204, 7, 0.05)",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      marginBottom: "10px",
                    }}
                  >
                    &gt; {key}
                  </div>
                  <div style={{ opacity: 0.8 }}>
                    <pre
                      style={{
                        margin: 0,
                        fontFamily: "monospace",
                        fontSize: "14px",
                      }}
                    >
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ margin: "20px 0", opacity: 0.5 }}>{"=".repeat(60)}</div>

      <div style={{ marginTop: "40px" }}>
        <a
          href="/"
          style={{
            color: "rgb(255, 204, 7)",
            textDecoration: "none",
            fontSize: "18px",
          }}
        >
          {"< RETURN TO MAIN INTERFACE"}
        </a>
      </div>
    </div>
  );
};

export default AdminDashboard;
