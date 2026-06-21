import React from "react";
import ReactDOM from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Bookmark, CheckSquare, Mail, Share2, Settings,
  Plus, Search, Clock, TrendingUp, FileText, MessageSquare,
  Layout, Layers, Zap, Sun, Moon
} from "lucide-react";

type TabType = "workspace" | "captures" | "tasks" | "templates";
type ViewType = "summary" | "tasks" | "email" | "flashcards";

interface Capture {
  id: string;
  url: string;
  title: string;
  text?: string;
  selection?: string;
  description?: string;
  capturedAt: number;
  source?: string;
  summary?: string;
  tasks?: string[];
}

function SidePanel() {
  const [activeTab, setActiveTab] = React.useState<TabType>("workspace");
  const [capture, setCapture] = React.useState<any>(null);
  const [summary, setSummary] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(true);

  React.useEffect(() => {
    chrome.storage.local.get(["lastCapture", "lastSummary"], (data) => {
      if (data.lastCapture) setCapture(data.lastCapture);
      if (data.lastSummary) setSummary(data.lastSummary);
    });
  }, []);

  async function handleCapture() {
    setLoading(true);
    const res = await chrome.runtime.sendMessage({ type: "CAPTURE_PAGE" });
    if (res?.data) setCapture(res.data);
    setLoading(false);
  }

  async function handleSummarize() {
    setLoading(true);
    const res = await chrome.runtime.sendMessage({ type: "SUMMARIZE_PAGE" });
    if (res?.data) setSummary(res.data);
    setLoading(false);
  }

  async function handleAction(action: string) {
    setLoading(true);
    const res = await chrome.runtime.sendMessage({ type: action });
    setLoading(false);
  }

  return (
    <div className={`h-screen flex ${darkMode ? "bg-thyn-bg" : "bg-white"} text-thyn-text overflow-hidden`}>
      {/* Left Sidebar */}
      <aside className="w-16 flex flex-col items-center py-4 gap-4 border-r border-thyn-border bg-thyn-surface/20 backdrop-blur-2xl">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl hover:bg-thyn-surface transition-colors"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <NavIcon icon={Layout} active={activeTab === "workspace"} onClick={() => setActiveTab("workspace")} />
        <NavIcon icon={Bookmark} active={activeTab === "captures"} onClick={() => setActiveTab("captures")} />
        <NavIcon icon={CheckSquare} active={activeTab === "tasks"} onClick={() => setActiveTab("tasks")} />
        <NavIcon icon={FileText} active={activeTab === "templates"} onClick={() => setActiveTab("templates")} />
        <div className="flex-1" />
        <button
          onClick={() => chrome.runtime.openOptionsPage()}
          className="p-2 rounded-xl hover:bg-thyn-surface transition-colors"
        >
          <Settings size={18} />
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="px-5 py-3 flex items-center justify-between border-b border-thyn-border bg-thyn-surface/10 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold tracking-tight">THYN</span>
            <span className="text-[10px] uppercase tracking-widest text-thyn-muted bg-thyn-surface px-2 py-0.5 rounded-full border border-thyn-border">
              Workspace
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCapture}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium rounded-xl bg-thyn-primary/20 text-thyn-primary border border-thyn-primary/20 hover:bg-thyn-primary/30 transition-all"
            >
              {loading ? "..." : "+ Capture"}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5">
          <AnimatePresence mode="wait">
            {activeTab === "workspace" && (
              <WorkspaceView
                capture={capture}
                summary={summary}
                loading={loading}
                onSummarize={handleSummarize}
                onAction={handleAction}
              />
            )}
            {activeTab === "captures" && <CapturesView />}
            {activeTab === "tasks" && <TasksView />}
            {activeTab === "templates" && <TemplatesView />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavIcon({ icon: Icon, active, onClick }: { icon: any; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`p-2.5 rounded-xl transition-all ${
        active
          ? "bg-thyn-primary/20 text-thyn-primary shadow-glass-sm"
          : "text-thyn-muted hover:text-thyn-text hover:bg-thyn-surface"
      }`}
    >
      <Icon size={20} />
    </button>
  );
}

function WorkspaceView({
  capture,
  summary,
  loading,
  onSummarize,
  onAction,
}: {
  capture: any;
  summary: any;
  loading: boolean;
  onSummarize: () => void;
  onAction: (action: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="space-y-4"
    >
      {/* Current Page Card */}
      <GlassCard>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-thyn-primary/20 flex items-center justify-center flex-shrink-0">
            <Zap size={20} className="text-thyn-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold truncate">
              {capture?.title || "No page captured yet"}
            </h2>
            <p className="text-xs text-thyn-muted truncate mt-0.5">
              {capture?.url || "Capture a page to get started"}
            </p>
          </div>
        </div>

        {!capture && (
          <button
            onClick={onSummarize}
            disabled={loading}
            className="w-full p-3 rounded-2xl bg-thyn-primary/20 text-thyn-primary border border-thyn-primary/20 text-sm font-medium hover:bg-thyn-primary/30 transition-all"
          >
            {loading ? "Processing..." : "Capture Current Page"}
          </button>
        )}

        {capture && (
          <div className="flex gap-2 flex-wrap">
            <ActionChip icon={Sparkles} label="Summarize" onClick={onSummarize} loading={loading} />
            <ActionChip icon={CheckSquare} label="Tasks" onClick={() => onAction("EXTRACT_TASKS")} />
            <ActionChip icon={Mail} label="Email" onClick={() => onAction("GENERATE_EMAIL")} />
            <ActionChip icon={Share2} label="Share" />
          </div>
        )}
      </GlassCard>

      {/* Summary Card */}
      {summary && (
        <GlassCard>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Sparkles size={14} className="text-thyn-primary" />
            AI Summary
          </h3>
          <p className="text-sm leading-relaxed text-thyn-muted">
            {summary.summary || "Summary generated."}
          </p>

          {summary.tasks?.length > 0 && (
            <div className="mt-4 pt-3 border-t border-thyn-border">
              <h4 className="text-xs font-medium text-thyn-muted mb-2 uppercase tracking-wider">
                Action Items
              </h4>
              <div className="space-y-1.5">
                {summary.tasks.map((task: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-thyn-primary mt-1.5 flex-shrink-0" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      )}

      {/* Quick Actions */}
      <GlassCard>
        <h3 className="text-sm font-semibold mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <QuickAction icon={Search} label="Search Captures" />
          <QuickAction icon={Clock} label="Recent" />
          <QuickAction icon={TrendingUp} label="Trending" />
          <QuickAction icon={Layers} label="Compare Tabs" />
        </div>
      </GlassCard>
    </motion.div>
  );
}

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-thyn-surface backdrop-blur-2xl border border-thyn-border rounded-3xl p-5 shadow-glass ${className}`}
    >
      {children}
    </div>
  );
}

function ActionChip({
  icon: Icon,
  label,
  onClick,
  loading,
}: {
  icon: any;
  label: string;
  onClick?: () => void;
  loading?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-thyn-surface hover:bg-white/10 border border-thyn-border transition-all"
    >
      <Icon size={12} />
      {loading ? "..." : label}
    </motion.button>
  );
}

function QuickAction({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button className="flex items-center gap-2 p-3 rounded-2xl bg-thyn-surface hover:bg-white/10 border border-thyn-border text-sm transition-all">
      <Icon size={14} className="text-thyn-muted" />
      {label}
    </button>
  );
}

function CapturesView() {
  const [captures, setCaptures] = React.useState<any[]>([]);

  React.useEffect(() => {
    chrome.storage.local.get("thyn_state", (data) => {
      const state = data.thyn_state;
      if (state?.captures) setCaptures(state.captures);
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="space-y-3"
    >
      <h2 className="text-sm font-semibold mb-4">Saved Captures</h2>
      {captures.length === 0 && (
        <p className="text-sm text-thyn-muted">No captures yet. Capture a page to get started.</p>
      )}
      {captures.map((c: Capture) => (
        <GlassCard key={c.id}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-thyn-surface flex items-center justify-center flex-shrink-0 border border-thyn-border">
              <FileText size={14} className="text-thyn-muted" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{c.title}</p>
              <p className="text-xs text-thyn-muted truncate mt-0.5">{c.url}</p>
              <p className="text-xs text-thyn-muted mt-1">
                {new Date(c.capturedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </GlassCard>
      ))}
    </motion.div>
  );
}

function TasksView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="space-y-3"
    >
      <h2 className="text-sm font-semibold mb-4">Extracted Tasks</h2>
      <p className="text-sm text-thyn-muted">Tasks extracted from your captures will appear here.</p>
    </motion.div>
  );
}

function TemplatesView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="space-y-3"
    >
      <h2 className="text-sm font-semibold mb-4">Templates</h2>
      <div className="grid gap-2">
        {["Summary", "Action Items", "Follow-up Email", "Study Notes", "Meeting Brief", "Social Post"].map(
          (tpl) => (
            <GlassCard key={tpl}>
              <div className="flex items-center gap-3">
                <FileText size={14} className="text-thyn-muted" />
                <span className="text-sm">{tpl}</span>
                <span className="ml-auto text-xs text-thyn-muted">Use</span>
              </div>
            </GlassCard>
          )
        )}
      </div>
    </motion.div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SidePanel />
  </React.StrictMode>
);
