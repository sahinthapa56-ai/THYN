"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getContact, createNote, deleteNote, createReminder, markReminderDone, deleteReminder } from "@/lib/api"
import { formatDate, formatRelative } from "@/lib/shared"
import Link from "next/link"

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
  createdAt: string
}

interface Contact {
  id: string
  name: string
  headline: string | null
  company: string | null
  position: string | null
  location: string | null
  linkedinUrl: string
  avatarUrl: string | null
  summary: string | null
  notes: Note[]
  reminders: Reminder[]
}

export default function ContactPage() {
  const params = useParams()
  const router = useRouter()
  const [contact, setContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)
  const [noteInput, setNoteInput] = useState("")
  const [reminderTitle, setReminderTitle] = useState("")
  const [reminderNote, setReminderNote] = useState("")
  const [reminderDate, setReminderDate] = useState("")
  const [showReminderForm, setShowReminderForm] = useState(false)

  const loadContact = () => {
    const id = typeof params.id === "string" ? params.id : ""
    if (!id) return
    getContact(id)
      .then((data) => setContact(data.contact))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadContact()
  }, [params.id])

  const handleAddNote = async () => {
    if (!noteInput.trim() || !contact) return
    await createNote(contact.id, noteInput.trim())
    setNoteInput("")
    loadContact()
  }

  const handleDeleteNote = async (id: string) => {
    await deleteNote(id)
    loadContact()
  }

  const handleAddReminder = async () => {
    if (!reminderTitle.trim() || !reminderDate || !contact) return
    await createReminder({
      contactId: contact.id,
      title: reminderTitle.trim(),
      note: reminderNote.trim() || undefined,
      dueAt: new Date(reminderDate).toISOString(),
    })
    setReminderTitle("")
    setReminderNote("")
    setReminderDate("")
    setShowReminderForm(false)
    loadContact()
  }

  const handleToggleReminder = async (id: string) => {
    await markReminderDone(id)
    loadContact()
  }

  const handleDeleteReminder = async (id: string) => {
    await deleteReminder(id)
    loadContact()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-6 h-6 border-2 border-white/20 border-t-white rounded-full" />
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-sm text-white/50">
        <p>Contact not found.</p>
        <Link href="/dashboard" className="mt-2 text-white/70 underline">
          Back to contacts
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition no-underline mb-6"
      >
        ← Back to contacts
      </Link>

      {/* Profile header */}
      <div className="flex items-center gap-5 mb-8">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-xl font-medium shrink-0 text-white/60">
          {contact.avatarUrl ? (
            <img
              src={contact.avatarUrl}
              alt=""
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            contact.name.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{contact.name}</h1>
          {contact.headline && (
            <p className="text-sm text-white/60 mt-0.5">{contact.headline}</p>
          )}
          <div className="flex gap-3 mt-1.5 text-xs text-white/40">
            {contact.company && <span>{contact.company}</span>}
            {contact.location && <span>{contact.location}</span>}
          </div>
          <a
            href={contact.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-xs text-blue-400 hover:text-blue-300 transition"
          >
            View LinkedIn Profile →
          </a>
        </div>
      </div>

      {/* Summary */}
      {contact.summary && (
        <div className="mb-8 p-4 rounded-xl bg-white/[.03] border border-white/[.06]">
          <p className="text-sm text-white/70 leading-relaxed">{contact.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notes */}
        <div>
          <h2 className="text-sm font-semibold mb-3 text-white/70 uppercase tracking-wider">
            Notes
          </h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Add a note..."
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-white/25 placeholder:text-white/30"
            />
            <button
              onClick={handleAddNote}
              disabled={!noteInput.trim()}
              className="px-4 py-2 rounded-lg bg-white/10 text-xs font-medium text-white/80 hover:bg-white/20 transition disabled:opacity-30"
            >
              Add
            </button>
          </div>

          <div className="space-y-2">
            {contact.notes.length === 0 ? (
              <p className="text-xs text-white/30 py-4 text-center">No notes yet.</p>
            ) : (
              contact.notes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 rounded-lg bg-white/[.03] border border-white/[.06] group"
                >
                  <p className="text-sm text-white/80">{note.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-white/30">
                      {formatRelative(note.createdAt)}
                    </span>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-[10px] text-red-400/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reminders */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
              Reminders
            </h2>
            <button
              onClick={() => setShowReminderForm(!showReminderForm)}
              className="text-xs text-white/50 hover:text-white/80 transition"
            >
              {showReminderForm ? "Cancel" : "+ Add"}
            </button>
          </div>

          {showReminderForm && (
            <div className="mb-4 p-3 rounded-lg bg-white/[.03] border border-white/10 space-y-2">
              <input
                type="text"
                placeholder="Title"
                value={reminderTitle}
                onChange={(e) => setReminderTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-white/25 placeholder:text-white/30"
              />
              <input
                type="text"
                placeholder="Note (optional)"
                value={reminderNote}
                onChange={(e) => setReminderNote(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-white/25 placeholder:text-white/30"
              />
              <input
                type="datetime-local"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-white/25"
              />
              <button
                onClick={handleAddReminder}
                disabled={!reminderTitle.trim() || !reminderDate}
                className="w-full py-2 rounded-lg bg-white/10 text-xs font-medium text-white/80 hover:bg-white/20 transition disabled:opacity-30"
              >
                Save Reminder
              </button>
            </div>
          )}

          <div className="space-y-2">
            {contact.reminders.length === 0 ? (
              <p className="text-xs text-white/30 py-4 text-center">No reminders yet.</p>
            ) : (
              contact.reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`p-3 rounded-lg border group ${
                    reminder.done
                      ? "bg-white/[.01] border-white/[.04]"
                      : "bg-white/[.03] border-white/[.06]"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => handleToggleReminder(reminder.id)}
                      className={`mt-0.5 w-4 h-4 rounded-full border shrink-0 flex items-center justify-center transition ${
                        reminder.done
                          ? "bg-green-500/30 border-green-500/50"
                          : "border-white/20 hover:border-white/40"
                      }`}
                    >
                      {reminder.done && (
                        <svg className="w-2.5 h-2.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm ${
                          reminder.done
                            ? "text-white/30 line-through"
                            : "text-white/80"
                        }`}
                      >
                        {reminder.title}
                      </div>
                      {reminder.note && (
                        <div className="text-xs text-white/40 mt-0.5">
                          {reminder.note}
                        </div>
                      )}
                      <div className="text-[10px] text-white/30 mt-1">
                        Due {formatDate(reminder.dueAt)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="text-[10px] text-red-400/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                    >
                      Del
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
