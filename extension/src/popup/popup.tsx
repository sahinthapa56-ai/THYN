import React from "react";
import ReactDOM from "react-dom/client";
import { motion } from "framer-motion";

function Popup() {
  const [status, setStatus] = React.useState("");

  async function send(type: string) {
    setStatus("Processing...");
    try {
      const res = await chrome.runtime.sendMessage({ type });
      setStatus(res?.ok ? "Done" : "Failed");
    } catch {
      setStatus("Error");
    }
    setTimeout(() => setStatus(""), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-[320px] p-5 bg-thyn-bg/80 backdrop-blur-xl text-thyn-text rounded-3xl border border-thyn-border shadow-glass"
    >
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold tracking-tight">THYN</h1>
        <span className="text-xs text-thyn-muted font-medium uppercase tracking-wider">
          AI Workspace
        </span>
      </div>

      <div className="space-y-2.5">
        <ActionBtn label="Capture Page" onClick={() => send("CAPTURE_PAGE")} />

        <ActionBtn
          label="Summarize"
          onClick={() => send("SUMMARIZE_PAGE")}
          className="bg-thyn-primary/20 hover:bg-thyn-primary/30 text-thyn-primary border-thyn-primary/20"
        />

        <ActionBtn
          label="Extract Tasks"
          onClick={() => send("EXTRACT_TASKS")}
          className="bg-thyn-success/20 hover:bg-thyn-success/30 text-thyn-success border-thyn-success/20"
        />

        <ActionBtn
          label="Open Workspace"
          onClick={() => send("OPEN_PANEL")}
          className="bg-thyn-accent/20 hover:bg-thyn-accent/30 text-thyn-accent border-thyn-accent/20"
        />
      </div>

      <div className="mt-4 pt-3 border-t border-thyn-border flex items-center justify-between">
        <span className="text-xs text-thyn-muted">{status}</span>
        <button
          onClick={() => chrome.runtime.openOptionsPage()}
          className="text-xs text-thyn-muted hover:text-thyn-text transition-colors"
        >
          Settings
        </button>
      </div>
    </motion.div>
  );
}

function ActionBtn({
  label,
  onClick,
  className = "",
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`w-full p-3 rounded-2xl bg-thyn-surface hover:bg-white/10 border border-thyn-border text-sm font-medium transition-all ${className}`}
    >
      {label}
    </motion.button>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
