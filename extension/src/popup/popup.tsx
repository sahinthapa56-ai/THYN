import React from "react";
import ReactDOM from "react-dom/client";

function Popup() {
  const [token, setToken] = React.useState<string | null>(null);
  const [profile, setProfile] = React.useState<any>(null);

  React.useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_TOKEN" }, (res) => {
      setToken(res?.token || null);
    });
    chrome.runtime.sendMessage({ type: "GET_LINKEDIN_PROFILE" }, (res) => {
      if (res?.ok) setProfile(res.profile);
    });
  }, []);

  const openDashboard = () => {
    chrome.tabs.create({ url: "http://localhost:3000/dashboard" });
  };

  const openSidePanel = () => {
    chrome.runtime.sendMessage({ type: "OPEN_PANEL" });
  };

  const isLinkedInProfile = profile !== null;

  return (
    <div style={{
      width: "280px",
      padding: "16px",
      background: "#0a0a0a",
      color: "#fff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "13px",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <span style={{ fontWeight: 700, fontSize: "16px" }}>THYN</span>
        <span style={{ color: token ? "#22c55e" : "#6b7280", fontSize: "10px", background: token ? "rgba(34,197,94,0.1)" : "rgba(107,114,128,0.1)", padding: "2px 8px", borderRadius: "999px" }}>
          {token ? "Connected" : "Not signed in"}
        </span>
      </div>

      {/* Status */}
      <div style={{
        padding: "12px",
        borderRadius: "10px",
        background: isLinkedInProfile ? "rgba(34,197,94,0.08)" : "rgba(107,114,128,0.08)",
        border: `1px solid ${isLinkedInProfile ? "rgba(34,197,94,0.2)" : "rgba(107,114,128,0.15)"}`,
        marginBottom: "12px",
      }}>
        <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "2px" }}>
          {isLinkedInProfile ? profile?.name || "LinkedIn Profile" : "Not on LinkedIn"}
        </div>
        <div style={{ fontSize: "11px", color: "#9ca3af" }}>
          {isLinkedInProfile
            ? "Open the side panel to save this contact."
            : "Navigate to a LinkedIn profile to save contacts."}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <button
          onClick={openSidePanel}
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            fontSize: "13px",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Open Side Panel
        </button>
        <button
          onClick={openDashboard}
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            fontSize: "13px",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Open Dashboard
        </button>
      </div>

      {/* Token status */}
      {!token && (
        <div style={{ marginTop: "12px", fontSize: "11px", color: "#6b7280", textAlign: "center" }}>
          Sign in at the dashboard and copy your token to Settings.
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Popup />);
