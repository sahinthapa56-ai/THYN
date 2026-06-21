import React from "react";
import ReactDOM from "react-dom/client";

// ── Types ──────────────────────────────────────────────────
interface LinkedInProfile {
  name: string;
  headline: string | null;
  company: string | null;
  position: string | null;
  location: string | null;
  linkedinUrl: string;
  avatarUrl: string | null;
  summary: string | null;
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
}

interface Reminder {
  id: string;
  title: string;
  note: string | null;
  dueAt: string;
  done: boolean;
}

// ── API ────────────────────────────────────────────────────
const API_BASE = "http://localhost:3001";

async function getToken(): Promise<string | null> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "GET_TOKEN" }, (res) => {
      resolve(res?.token || null);
    });
  });
}

async function api(path: string, options: RequestInit = {}) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((options.headers as Record<string, string>) || {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `API ${res.status}`);
  }
  return res.json();
}

// ── Side Panel Component ───────────────────────────────────
function SidePanel() {
  const [profile, setProfile] = React.useState<LinkedInProfile | null>(null);
  const [contact, setContact] = React.useState<any>(null);
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [reminders, setReminders] = React.useState<Reminder[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [noteInput, setNoteInput] = React.useState("");
  const [token, setToken] = React.useState<string | null>(null);
  const [showSettings, setShowSettings] = React.useState(false);
  const [tokenInput, setTokenInput] = React.useState("");

  // Load token and profile on mount
  React.useEffect(() => {
    getToken().then((t) => {
      setToken(t);
      if (!t) {
        setLoading(false);
        return;
      }

      // Load LinkedIn profile from storage
      chrome.storage.local.get("linkedinProfile", (data) => {
        const p = data.linkedinProfile as LinkedInProfile;
        setProfile(p || null);
        setLoading(false);

        // If we have a profile, check if contact exists
        if (p?.linkedinUrl) {
          loadContact(p.linkedinUrl, t);
        }
      });
    });
  }, []);

  async function loadContact(linkedinUrl: string, token: string) {
    try {
      const data = await api(`/contacts?linkedinUrl=${encodeURIComponent(linkedinUrl)}`);
      // Try to find matching contact
      if (data.contacts?.length) {
        const match = data.contacts.find(
          (c: any) => c.linkedinUrl === linkedinUrl
        );
        if (match) {
          setContact(match);
          // Load notes and reminders
          const notesData = await api(`/notes/contact/${match.id}`);
          setNotes(notesData.notes);
          const remindersData = await api(`/reminders?contactId=${match.id}`);
          setReminders(remindersData.reminders);
        }
      }
    } catch {
      // Contact doesn't exist yet — that's fine
    }
  }

  async function handleSaveContact() {
    if (!profile || !token) return;
    setSaving(true);
    try {
      const data = await api("/contacts", {
        method: "POST",
        body: JSON.stringify({
          linkedinUrl: profile.linkedinUrl,
          name: profile.name,
          headline: profile.headline,
          company: profile.company,
          position: profile.position,
          location: profile.location,
          avatarUrl: profile.avatarUrl,
          summary: profile.summary,
        }),
      });
      setContact(data.contact);
    } catch (err: any) {
      if (err.message?.includes("409") || err.message?.includes("already exists")) {
        // Contact already exists — reload
        loadContact(profile.linkedinUrl, token);
      }
    }
    setSaving(false);
  }

  async function handleAddNote() {
    if (!noteInput.trim() || !contact || !token) return;
    try {
      const data = await api("/notes", {
        method: "POST",
        body: JSON.stringify({
          contactId: contact.id,
          content: noteInput.trim(),
        }),
      });
      setNotes((prev) => [data.note, ...prev]);
      setNoteInput("");
    } catch (e) {
      console.error("Failed to add note", e);
    }
  }

  async function handleSaveToken() {
    if (!tokenInput.trim()) return;
    await chrome.storage.local.set({ thyn_token: tokenInput.trim() });
    setToken(tokenInput.trim());
    setShowSettings(false);
    // Reload profile
    chrome.storage.local.get("linkedinProfile", (data) => {
      const p = data.linkedinProfile as LinkedInProfile;
      setProfile(p || null);
      if (p?.linkedinUrl) loadContact(p.linkedinUrl, tokenInput.trim());
    });
  }

  // ── Render ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="animate-spin w-6 h-6 border-2 border-white/20 border-t-white rounded-full" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 gap-4 text-center">
        <div className="text-3xl">🔑</div>
        <p className="text-sm text-white/60">
          Sign in to use THYN
        </p>
        <p className="text-xs text-white/40">
          Open the THYN web dashboard, go to Settings, and copy your access token.
        </p>
        <button
          className="mt-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium"
          onClick={() => setShowSettings(true)}
        >
          Enter Token
        </button>

        {showSettings && (
          <div className="w-full mt-4 p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <input
              type="text"
              placeholder="Paste your access token"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-white/25 placeholder:text-white/30"
            />
            <button
              onClick={handleSaveToken}
              disabled={!tokenInput.trim()}
              className="w-full py-2 rounded-lg bg-white text-black text-sm font-medium disabled:opacity-30"
            >
              Save Token
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="text-3xl mb-2">👤</div>
        <p className="text-sm text-white/60">Not a LinkedIn profile</p>
        <p className="text-xs text-white/40 mt-2">
          Open a LinkedIn profile to save a contact.
        </p>
      </div>
    );
  }

  const isSaved = !!contact;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium shrink-0 text-white/60">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            profile.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <h2 className="font-semibold text-sm truncate">{profile.name}</h2>
          <p className="text-xs text-white/50 truncate">
            {profile.headline || profile.company || ""}
          </p>
        </div>
      </div>

      {/* Save / Contact Info */}
      {!isSaved ? (
        <button
          onClick={handleSaveContact}
          disabled={saving}
          className="w-full py-2.5 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-medium border border-blue-500/30 hover:bg-blue-500/30 transition disabled:opacity-30"
        >
          {saving ? "Saving..." : "+ Save Contact"}
        </button>
      ) : (
        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-sm">✓ Saved</span>
            <span className="text-xs text-white/40">
              {notes.length} note{notes.length !== 1 ? "s" : ""}
              {notes.length > 0 && reminders.length > 0 ? " · " : ""}
              {reminders.length > 0 && `${reminders.length} reminder${reminders.length !== 1 ? "s" : ""}`}
            </span>
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
          Notes
        </h3>
        {isSaved && (
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add a note..."
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
              className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-white/25 placeholder:text-white/30"
            />
            <button
              onClick={handleAddNote}
              disabled={!noteInput.trim()}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-xs text-white/80 hover:bg-white/20 transition disabled:opacity-30"
            >
              Add
            </button>
          </div>
        )}
        <div className="space-y-1.5">
          {notes.length === 0 && (
            <p className="text-xs text-white/30 py-2 text-center">
              {isSaved ? "No notes yet." : "Save the contact first."}
            </p>
          )}
          {notes.slice(0, 5).map((note) => (
            <div key={note.id} className="p-2 rounded-lg bg-white/[.03] border border-white/[.06]">
              <p className="text-xs text-white/70">{note.content}</p>
              <span className="text-[10px] text-white/30 mt-1 block">
                {formatRelative(note.createdAt)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reminders */}
      <div>
        <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
          Reminders
        </h3>
        <div className="space-y-1.5">
          {reminders.length === 0 && (
            <p className="text-xs text-white/30 py-2 text-center">
              {isSaved ? "No reminders yet." : "Save the contact first."}
            </p>
          )}
          {reminders.filter((r) => !r.done).slice(0, 3).map((reminder) => (
            <div key={reminder.id} className="p-2 rounded-lg bg-white/[.03] border border-white/[.06]">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]">⏰</span>
                <span className="text-xs text-white/80">{reminder.title}</span>
              </div>
              <span className="text-[10px] text-white/30 ml-4">
                Due {formatDate(reminder.dueAt)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 text-center">
        <a
          href={`http://localhost:3000/contact/${contact?.id || ""}`}
          target="_blank"
          className="text-xs text-white/30 hover:text-white/60 transition no-underline"
        >
          Open in Dashboard →
        </a>
      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────
function formatRelative(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ── Mount ─────────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById("root")!).render(<SidePanel />);
