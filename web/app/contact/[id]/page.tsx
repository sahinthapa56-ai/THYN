"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  getContact,
  createNote,
  deleteNote,
  createReminder,
  markReminderDone,
  deleteReminder,
} from "@/lib/api"
import {
  formatDate,
  formatRelative,
  formatDateTime,
  type Contact,
  type Note,
  type Reminder,
} from "@/lib/shared"

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [contact, setContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Note form
  const [noteContent, setNoteContent] = useState("")
  const [savingNote, setSavingNote] = useState(false)

  // Reminder form
  const [showReminderForm, setShowReminderForm] = useState(false)
  const [reminderTitle, setReminderTitle] = useState("")
  const [reminderNote, setReminderNote] = useState("")
  const [reminderDate, setReminderDate] = useState("")
  const [savingReminder, setSavingReminder] = useState(false)

  const loadContact = useCallback(async () => {
    try {
      setError(null)
      const data = await getContact(id)
      setContact(data.contact)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contact")
      if (String(err).includes("404")) {
        setTimeout(() => router.push("/dashboard"), 2000)
      }
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    loadContact()
  }, [loadContact])

  // ── Notes ──

  const handleAddNote = async () => {
    if (!noteContent.trim()) return
    setSavingNote(true)
    try {
      const data = await createNote(id, noteContent.trim())
      setContact((prev) =>
        prev
          ? {
              ...prev,
              notes: [data.note, ...(prev.notes || [])],
            }
          : prev
      )
      setNoteContent("")
    } catch (err) {
      alert("Failed to save note")
    } finally {
      setSavingNote(false)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Delete this note?")) return
    try {
      await deleteNote(noteId)
      setContact((prev) =>
        prev
          ? {
              ...prev,
              notes: (prev.notes || []).filter((n) => n.id !== noteId),
            }
          : prev
      )
    } catch {
      alert("Failed to delete note")
    }
  }

  // ── Reminders ──

  const handleAddReminder = async () => {
    if (!reminderTitle.trim() || !reminderDate) return
    setSavingReminder(true)
    try {
      const data = await createReminder({
        contactId: id,
        title: reminderTitle.trim(),
        note: reminderNote.trim() || undefined,
        dueAt: new Date(reminderDate).toISOString(),
      })
      setContact((prev) =>
        prev
          ? {
              ...prev,
              reminders: [
                ...(prev.reminders || []),
                { ...data.reminder, contact: undefined },
              ],
            }
          : prev
      )
      setReminderTitle("")
      setReminderNote("")
      setReminderDate("")
      setShowReminderForm(false)
    } catch {
      alert("Failed to create reminder")
    } finally {
      setSavingReminder(false)
    }
  }

  const handleMarkDone = async (reminderId: string) => {
    try {
      await markReminderDone(reminderId)
      setContact((prev) =>
        prev
          ? {
              ...prev,
              reminders: (prev.reminders || []).map((r) =>
                r.id === reminderId ? { ...r, done: true } : r
              ),
            }
          : prev
      )
    } catch {
      alert("Failed to update reminder")
    }
  }

  const handleDeleteReminder = async (reminderId: string) => {
    if (!confirm("Delete this reminder?")) return
    try {
      await deleteReminder(reminderId)
      setContact((prev) =>
        prev
          ? {
              ...prev,
              reminders: (prev.reminders || []).filter(
                (r) => r.id !== reminderId
              ),
            }
          : prev
      )
    } catch {
      alert("Failed to delete reminder")
    }
  }

  // ── Timeline ──

  const timeline = [
    ...(contact
      ? [
          {
            type: "contact_created" as const,
            label: "Contact saved",
            date: contact.createdAt,
          },
          ...(contact.notes || []).map((n) => ({
            type: "note" as const,
            label: "Note: " + n.content.slice(0, 80),
            date: n.createdAt,
            id: n.id,
          })),
          ...(contact.reminders || []).map((r) => ({
            type: "reminder" as const,
            label: "Reminder: " + r.title,
            date: r.createdAt,
            done: r.done,
            id: r.id,
          })),
        ]
      : []),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // ── Render ──

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-sm text-white/40">Loading contact...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold text-white mb-2">Error</h2>
          <p className="text-sm text-white/50 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={loadContact}
              className="px-4 py-2 bg-white/10 text-white rounded-xl text-sm hover:bg-white/20 transition"
            >
              Retry
            </button>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-white/10 text-white/60 rounded-xl text-sm hover:bg-white/20 transition no-underline"
            >
              Back to contacts
            </Link>
          </div>
          <p className="text-xs text-white/20 mt-4">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  if (!contact) return null

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition no-underline mb-6"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to contacts
      </Link>

      {/* Profile header */}
      <div className="flex items-start gap-5 mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shrink-0">
          {contact.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-white">{contact.name}</h1>
          {contact.headline && (
            <p className="text-sm text-white/50 mt-1">{contact.headline}</p>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {contact.company && (
              <span className="text-xs text-white/40">{contact.company}</span>
            )}
            {contact.position && (
              <span className="text-xs text-white/30">· {contact.position}</span>
            )}
            {contact.location && (
              <span className="text-xs text-white/30">· {contact.location}</span>
            )}
          </div>
          <a
            href={contact.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 text-xs text-blue-400 hover:text-blue-300 transition"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
            </svg>
            View LinkedIn profile
          </a>
        </div>
      </div>

      {/* Tags */}
      {contact.tags && contact.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {contact.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/50"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {contact.summary && (
        <div className="mb-6 p-4 bg-white/[.02] border border-white/10 rounded-xl">
          <p className="text-sm text-white/60 leading-relaxed">
            {contact.summary}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* ── Notes ── */}
        <div className="bg-white/[.02] border border-white/10 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Notes</h2>

          {/* Add note */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Add a note..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
              className="flex-1 px-3 py-2 bg-white/[.03] border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition"
            />
            <button
              onClick={handleAddNote}
              disabled={!noteContent.trim() || savingNote}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {savingNote ? "..." : "Add"}
            </button>
          </div>

          {/* Note list */}
          {(!contact.notes || contact.notes.length === 0) && (
            <p className="text-sm text-white/30 text-center py-6">
              No notes yet. Add one above.
            </p>
          )}

          <div className="space-y-2">
            {(contact.notes || []).map((note) => (
              <div
                key={note.id}
                className="group flex items-start gap-2 p-3 rounded-lg bg-white/[.02] border border-white/5 hover:border-white/10 transition"
              >
                <p className="flex-1 text-sm text-white/70 leading-relaxed min-w-0">
                  {note.content}
                  <span className="block text-[11px] text-white/30 mt-1">
                    {formatRelative(note.createdAt)}
                  </span>
                </p>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-white/30 hover:text-red-400 transition-all"
                >
                  <svg
                    className="w-3.5 h-3.5"
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
          </div>
        </div>

        {/* ── Reminders ── */}
        <div className="bg-white/[.02] border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Reminders</h2>
            <button
              onClick={() => setShowReminderForm(!showReminderForm)}
              className="text-xs text-blue-400 hover:text-blue-300 transition"
            >
              {showReminderForm ? "Cancel" : "+ New"}
            </button>
          </div>

          {/* Add reminder form */}
          {showReminderForm && (
            <div className="mb-4 p-3 bg-white/[.03] rounded-lg border border-white/10 space-y-2">
              <input
                type="text"
                placeholder="Reminder title"
                value={reminderTitle}
                onChange={(e) => setReminderTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white/[.03] border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition"
              />
              <input
                type="text"
                placeholder="Optional note"
                value={reminderNote}
                onChange={(e) => setReminderNote(e.target.value)}
                className="w-full px-3 py-2 bg-white/[.03] border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition"
              />
              <input
                type="datetime-local"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="w-full px-3 py-2 bg-white/[.03] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white/30 transition [color-scheme:dark]"
              />
              <button
                onClick={handleAddReminder}
                disabled={!reminderTitle.trim() || !reminderDate || savingReminder}
                className="w-full py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {savingReminder ? "Creating..." : "Set Reminder"}
              </button>
            </div>
          )}

          {/* Reminder list */}
          {(!contact.reminders || contact.reminders.length === 0) && (
            <p className="text-sm text-white/30 text-center py-6">
              No reminders. Create one above.
            </p>
          )}

          <div className="space-y-2">
            {(contact.reminders || [])
              .sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1))
              .map((reminder) => (
                <div
                  key={reminder.id}
                  className={`group flex items-start gap-3 p-3 rounded-lg border transition ${
                    reminder.done
                      ? "bg-white/[.01] border-white/5 opacity-50"
                      : "bg-white/[.02] border-white/10 hover:border-white/20"
                  }`}
                >
                  <button
                    onClick={() => handleMarkDone(reminder.id)}
                    disabled={reminder.done}
                    className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                      reminder.done
                        ? "bg-green-500 border-green-500"
                        : "border-white/30 hover:border-blue-400"
                    }`}
                  >
                    {reminder.done && (
                      <svg
                        className="w-2.5 h-2.5 text-white"
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
                      className={`text-sm ${
                        reminder.done ? "line-through text-white/30" : "text-white/70"
                      }`}
                    >
                      {reminder.title}
                    </p>
                    {reminder.note && (
                      <p className="text-xs text-white/40 mt-0.5">
                        {reminder.note}
                      </p>
                    )}
                    <p className="text-[11px] text-white/30 mt-1">
                      Due {formatDate(reminder.dueAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteReminder(reminder.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-white/30 hover:text-red-400 transition-all"
                  >
                    <svg
                      className="w-3.5 h-3.5"
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
          </div>
        </div>
      </div>

      {/* ── Timeline ── */}
      <div className="bg-white/[.02] border border-white/10 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Timeline</h2>

        <div className="relative pl-6 space-y-4">
          {/* Vertical line */}
          <div className="absolute left-2.5 top-2 bottom-0 w-px bg-white/10" />

          {timeline.map((event, i) => (
            <div key={i} className="relative flex items-start gap-3">
              {/* Dot */}
              <div
                className={`absolute -left-[18px] w-2.5 h-2.5 rounded-full border-2 mt-1 ${
                  event.type === "contact_created"
                    ? "bg-blue-500 border-blue-500"
                    : event.type === "reminder" && event.done
                    ? "bg-green-500 border-green-500"
                    : event.type === "reminder" && !event.done
                    ? "bg-yellow-500 border-yellow-500"
                    : "bg-white/10 border-white/20"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/60 truncate">
                    {event.label.slice(0, 100)}
                    {event.label.length > 100 ? "..." : ""}
                  </span>
                </div>
                <span className="text-[10px] text-white/30">
                  {formatRelative(event.date)}
                </span>
              </div>
            </div>
          ))}

          {timeline.length === 0 && (
            <p className="text-sm text-white/30 text-center py-6">
              No activity yet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
