import React from "react";
import ReactDOM from "react-dom/client";
import { motion } from "framer-motion";
import { Save, Bell, Shield, Palette, Globe, Trash2 } from "lucide-react";

function Options() {
  const [settings, setSettings] = React.useState({
    darkMode: true,
    autoCapture: false,
    notifications: true,
    dailyDigest: true,
    redactSensitive: true,
    summaryLength: "medium",
    theme: "dark",
  });

  React.useEffect(() => {
    chrome.storage.sync.get(["thyn_settings"], (data) => {
      if (data.thyn_settings) setSettings({ ...settings, ...data.thyn_settings });
    });
  }, []);

  function update(key: string, value: any) {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    chrome.storage.sync.set({ thyn_settings: updated });
  }

  return (
    <div className="min-h-screen bg-thyn-bg text-thyn-text p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-semibold tracking-tight">THYN Settings</h1>
          <p className="text-sm text-thyn-muted mt-1">Configure your AI workspace</p>
        </motion.div>

        <SettingsSection icon={Palette} title="Appearance">
          <ToggleRow label="Dark Mode" value={settings.darkMode} onChange={(v) => update("darkMode", v)} />
          <SelectRow
            label="Theme"
            value={settings.theme}
            options={[
              { value: "dark", label: "Dark" },
              { value: "light", label: "Light" },
              { value: "system", label: "System" },
            ]}
            onChange={(v) => update("theme", v)}
          />
        </SettingsSection>

        <SettingsSection icon={Bell} title="Notifications">
          <ToggleRow label="Enable Notifications" value={settings.notifications} onChange={(v) => update("notifications", v)} />
          <ToggleRow label="Daily Digest" value={settings.dailyDigest} onChange={(v) => update("dailyDigest", v)} />
        </SettingsSection>

        <SettingsSection icon={Shield} title="Privacy & Security">
          <ToggleRow label="Redact Sensitive Data" value={settings.redactSensitive} onChange={(v) => update("redactSensitive", v)} />
          <ToggleRow label="Auto-capture" value={settings.autoCapture} onChange={(v) => update("autoCapture", v)} />
        </SettingsSection>

        <SettingsSection icon={Globe} title="AI Preferences">
          <SelectRow
            label="Summary Length"
            value={settings.summaryLength}
            options={[
              { value: "short", label: "Short" },
              { value: "medium", label: "Medium" },
              { value: "long", label: "Detailed" },
            ]}
            onChange={(v) => update("summaryLength", v)}
          />
        </SettingsSection>

        <div className="flex items-center justify-between pt-4 border-t border-thyn-border">
          <button
            onClick={() => {
              chrome.storage.local.clear();
              chrome.storage.sync.clear();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-thyn-danger/20 text-thyn-danger border border-thyn-danger/20 text-sm hover:bg-thyn-danger/30 transition-all"
          >
            <Trash2 size={14} />
            Clear All Data
          </button>
          <button
            onClick={() => {
              chrome.storage.sync.set({ thyn_settings: settings });
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-thyn-primary/20 text-thyn-primary border border-thyn-primary/20 text-sm hover:bg-thyn-primary/30 transition-all"
          >
            <Save size={14} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-thyn-surface/30 backdrop-blur-2xl border border-thyn-border rounded-3xl p-5 shadow-glass-sm"
    >
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-thyn-border">
        <Icon size={16} className="text-thyn-primary" />
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </motion.div>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-10 h-5 rounded-full transition-all ${
          value ? "bg-thyn-primary" : "bg-thyn-surface border border-thyn-border"
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white transition-all ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function SelectRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-thyn-surface border border-thyn-border rounded-xl px-3 py-1.5 text-sm text-thyn-text outline-none focus:border-thyn-primary/50"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
