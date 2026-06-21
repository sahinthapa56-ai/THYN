import React, { useState, useEffect, useCallback } from "react"
import { createRoot } from "react-dom/client"

// ── Config ─────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001"

// ── Types ──────────────────────────────────────────────────
interface LinkedInProfile {
  name: string
  headline: string | null
  company: string | null
  position: string | null
  location: string | null
  avatarUrl: string | null
  summary: string | null
  linkedinUrl: string
}

interface Contact {
  id: string
  name: string
  headline: string | null
  company: string | null
  linkedinUrl: string
}

interface Note {
  id: string
  content: string
  createdAt: string
}

interface Reminder {
  id: string
  title: string
  note: string | null
  dueAt: string
  done: boolean
}

// ── API helper ─────────────────────────────────────────────
async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  // Read token from storage
  const token = await new Promise<string | null>((resolve) => {
    chrome.storage.local.get("authToken", (data) => {
      resolve(data.authToken || null)
    })
  })

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error || `API ${res.status}`)
  }

  return res.json()
}

// ── Views ──────────────────────────────────────────────────

function TokenPrompt({ onTokenSet }: { onTokenSet: () => void }) {
  const [token, setToken] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!token.trim()) return
    setSaving(true)
    setError(null)

    // Verify token by making a test API call
    try {
      const res = await fetch(`${API_BASE}/health`, {
        headers: { Authorization: `Bearer ${token.trim()}` },
      })
      if (!res.ok) throw new Error("Invalid token")
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not verify token"
      )
      setSaving(false)
      return
    }

    await new Promise<void>((resolve) => {
      chrome.storage.local.set({ authToken: token.trim() }, resolve)
    })
    setSaving(false)
    onTokenSet()
  }

  return (
    <div className="p-4 flex flex-col h-full">
      <h1 className="text-lg font-bold text-white mb-1">THYN</h1>
      <p className="text-xs text-white/40 mb-6">
        Enter your access token from the web app (Settings → Copy Token).
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      <input
        type="text"
        placeholder="Paste your token here..."
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="w-full px-4 py-3 bg-white/[.05] border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition mb-4"
      />

      <button
        onClick={handleSave}
        disabled={!token.trim() || saving}
        className="w-full py-3 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {saving ? "Verifying..." : "Save Token"}
      </button>

      <div className="mt-auto pt-4 border-t border-white/10">
        <p className="text-[11px] text-white/30 leading-relaxed">
          Token is stored locally and never shared.
        </p>
      </div>
    </div>
  )
}

function ContactSaved({
  contact,
  onSaveAnother,
}: {
  contact: Contact
  onSaveAnother: () => void
}) {
  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Saved!</h2>
          <p className="text-[11px] text-white/40">{contact.name}</p>
        </div>
      </div>
      <div className="flex-1" />
      <button
        onClick={onSaveAnother}
        className="w-full py-2.5 border border-white/10 text-white rounded-xl text-sm hover:bg-white/5 transition"
      >
        Save another
      </button>
    </div>
  )
}

function NotLinkedIn() {
  return (
    <div className="p-4 flex flex-col h-full">
      <div className="text-center py-12">
        <div className="text-4xl mb-3">🔗</div>
        <h2 className="text-sm font-semibold text-white mb-2">
          Not a LinkedIn profile
        </h2>
        <p className="text-xs text-white/40 leading-relaxed">
          Visit a LinkedIn profile page to save a contact.
        </p>
      </div>
    </div>
  )
}

function MainView({
  profile,
  contact,
  onSaved,
}: {
  profile: LinkedInProfile
  contact: Contact | null
  onSaved: () => void
}) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [noteText, setNoteText] = useState("")
  const [savingNote, setSavingNote] = useState(false)
  const [tab, setTab] = useState<"profile" | "notes" | "reminders">(
    contact ? "notes" : "profile"
  )

  const isSaved = !!contact

  // Load notes/reminders if contact exists
  useEffect(() => {
    if (!contact) return
    api<{ notes: Note[] }>(`/notes/contact/${contact.id}`)
      .then((d) => setNotes(d.notes))
      .catch(() => {})
    api<{ reminders: Reminder[] }>(`/reminders?contactId=${contact.id}`)
      .then((d) => setReminders(d.reminders))
      .catch(() => {})
  }, [contact])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await api("/contacts", {
        method: "POST",
        body: JSON.stringify(profile),
      })
      onSaved()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save contact"
      )
    } finally {
      setSaving(false)
    }
  }

  const handleAddNote = async () => {
    if (!noteText.trim() || !contact) return
    setSavingNote(true)
    try {
      const data = await api<{ note: Note }>("/notes", {
        method: "POST",
        body: JSON.stringify({
          contactId: contact.id,
          content: noteText.trim(),
        }),
      })
      setNotes((prev) => [data.note, ...prev])
      setNoteText("")
    } catch {
      // silent
    } finally {
      setSavingNote(false)
    }
  }

  const handleDeleteNote = async (id: string) => {
    try {
      await api(`/notes/${id}`, { method: "DELETE" })
      setNotes((prev) => prev.filter((n) => n.id !== id))
    } catch {
      // silent
    }
  }

  const handleDoneReminder = async (id: string) => {
    try {
      await api(`/reminders/${id}/done`, { method: "PUT" })
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, done: true } : r))
      )
    } catch {
      // silent
    }
  }

  const handleDeleteReminder = async (id: string) => {
    try {
      await api(`/reminders/${id}`, { method: "DELETE" })
      setReminders((prev) => prev.filter((r) => r.id !== id))
    } catch {
      // silent
    }
  }

  return (
    <div className="p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-semibold text-white truncate">
            {profile.name}
          </h1>
          {profile.headline && (
            <p className="text-[11px] text-white/50 truncate mt-0.5">
              {profile.headline}
            </p>
          )}
          <div className="flex items-center gap-3 mt-1">
            {profile.company && (
              <span className="text-[10px] text-white/30">
                {profile.company}
              </span>
            )}
            {profile.location && (
              <span className="text-[10px] text-white/20">
                {profile.location}
              </span>
            )}
          </div>
        </div>
        {isSaved && (
          <div className="px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="text-[10px] text-green-400 font-medium">
              Saved
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[11px] text-red-400">
          {error}
        </div>
      )}

      {/* Save button (if not saved) */}
      {!isSaved && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed mb-4"
        >
          {saving ? "Saving..." : "Save Contact"}
        </button>
      )}

      {/* Tabs (when saved) */}
      {isSaved && (
        <>
          <div className="flex gap-1 mb-3 border-b border-white/10">
            {(["profile", "notes", "reminders"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-2 text-xs font-medium transition border-b-2 -mb-px ${
                  tab === t
                    ? "text-white border-blue-400"
                    : "text-white/30 border-transparent hover:text-white/60"
                }`}
              >
                {t === "profile"
                  ? "Profile"
                  : t === "notes"
                  ? `Notes (${notes.length})`
                  : `Reminders (${reminders.length})`}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pb-2">
            {tab === "profile" && (
              <div className="space-y-2 text-xs text-white/50">
                {profile.summary && (
                  <p className="leading-relaxed">{profile.summary}</p>
                )}
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    className="block text-blue-400 hover:text-blue-300 mt-2"
                  >
                    View LinkedIn →
                  </a>
                )}
              </div>
            )}

            {tab === "notes" && (
              <>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Add a note..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleAddNote()
                    }
                    className="flex-1 px-3 py-2 bg-white/[.03] border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!noteText.trim() || savingNote}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition disabled:opacity-40"
                  >
                    {savingNote ? "..." : "Add"}
                  </button>
                </div>
                {notes.length === 0 && (
                  <p className="text-xs text-white/30 text-center py-6">
                    No notes yet.
                  </p>
                )}
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="group flex items-start gap-2 p-2.5 rounded-lg bg-white/[.02] border border-white/5"
                  >
                    <p className="flex-1 text-xs text-white/60 min-w-0">
                      {note.content}
                    </p>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </>
            )}

            {tab === "reminders" && (
              <>
                {reminders.length === 0 && (
                  <p className="text-xs text-white/30 text-center py-6">
                    No reminders. Use the contact detail page in the web app
                    to create one.
                  </p>
                )}
                {reminders.map((r) => (
                  <div
                    key={r.id}
                    className={`group flex items-start gap-2.5 p-2.5 rounded-lg border ${
                      r.done
                        ? "bg-white/[.01] border-white/5 opacity-50"
                        : "bg-white/[.02] border-white/10"
                    }`}
                  >
                    <button
                      onClick={() => handleDoneReminder(r.id)}
                      className={`mt-0.5 w-3.5 h-3.5 rounded-full border-2 shrink-0 transition ${
                        r.done
                          ? "bg-green-500 border-green-500"
                          : "border-white/30 hover:border-blue-400"
                      }`}
                    >
                      {r.done && (
                        <svg
                          className="w-2 h-2 text-white mx-auto mt-[1px]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs ${
                          r.done
                            ? "line-through text-white/30"
                            : "text-white/60"
                        }`}
                      >
                        {r.title}
                      </p>
                      {r.note && (
                        <p className="text-[10px] text-white/30 mt-0.5">
                          {r.note}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteReminder(r.id)}
                      className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ── App ─────────────────────────────────────────────────────

function App() {
  const [hasToken, setHasToken] = useState<boolean | null>(null)
  const [profile, setProfile] = useState<LinkedInProfile | null>(null)
  const [contact, setContact] = useState<Contact | null>(null)
  const [isLinkedIn, setIsLinkedIn] = useState<boolean | null>(null)
  const [view, setView] = useState<"loading" | "app">("loading")

  // Check for token
  useEffect(() => {
    chrome.storage.local.get("authToken", (data) => {
      setHasToken(!!data.authToken)
    })
  }, [])

  // Get profile from storage
  useEffect(() => {
    const check = () => {
      chrome.storage.local.get("linkedinProfile", (data) => {
        if (data.linkedinProfile) {
          setProfile(data.linkedinProfile)
        }
      })
    }
    check()
    const interval = setInterval(check, 2000)
    return () => clearInterval(interval)
  }, [])

  // Check if we're on a LinkedIn profile
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url || ""
      setIsLinkedIn(url.includes("linkedin.com/in/"))
    })
  }, [])

  // Check if contact already exists
  useEffect(() => {
    if (!profile || !hasToken) return
    const check = async () => {
      try {
        const data = await api<{ contacts: Contact[] }>(
          `/contacts?linkedinUrl=${encodeURIComponent(profile.linkedinUrl)}`
        )
        if (data.contacts?.length > 0) {
          setContact(data.contacts[0])
        }
      } catch {
        // Not found / not saved yet
      }
    }
    check()
  }, [profile, hasToken])

  const handleSaved = async () => {
    if (!profile) return
    try {
      const data = await api<{ contacts: Contact[] }>(
        `/contacts?linkedinUrl=${encodeURIComponent(profile.linkedinUrl)}`
      )
      if (data.contacts?.length > 0) {
        setContact(data.contacts[0])
      }
    } catch {
      // silent
    }
  }

  if (hasToken === null) return null

  if (!hasToken) {
    return <TokenPrompt onTokenSet={() => setHasToken(true)} />
  }

  if (isLinkedIn === false) {
    return <NotLinkedIn />
  }

  if (!profile) {
    return (
      <div className="p-4 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-xs text-white/40">
            Loading profile...
          </p>
        </div>
      </div>
    )
  }

  return (
    <MainView
      profile={profile}
      contact={contact}
      onSaved={handleSaved}
    />
  )
}

// ── Mount ───────────────────────────────────────────────────

const root = document.getElementById("root")
if (root) {
  root.innerHTML = ""
  createRoot(root).render(<App />)
}
