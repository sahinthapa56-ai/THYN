"use client"

import { useEffect, useState, useCallback } from "react"
import { getContacts, deleteContact } from "@/lib/api"
import { formatRelative, type Contact } from "@/lib/shared"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const router = useRouter()

  const loadContacts = useCallback(async () => {
    try {
      setError(null)
      const data = await getContacts()
      setContacts(data.contacts)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contacts")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadContacts()
  }, [loadContacts])

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm("Delete this contact?")) return
    try {
      await deleteContact(id)
      setContacts((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      alert("Failed to delete contact")
    }
  }

  const filtered = search
    ? contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.company?.toLowerCase().includes(search.toLowerCase()) ||
          c.headline?.toLowerCase().includes(search.toLowerCase())
      )
    : contacts

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-sm text-white/40">Loading contacts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold text-white mb-2">
            Connection Error
          </h2>
          <p className="text-sm text-white/50 mb-6">{error}</p>
          <button
            onClick={loadContacts}
            className="px-4 py-2 bg-white/10 text-white rounded-xl text-sm hover:bg-white/20 transition"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Contacts</h1>
          <p className="text-sm text-white/40 mt-0.5">
            {contacts.length} saved contact{contacts.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Search */}
      {contacts.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/[.03] border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition"
          />
        </div>
      )}

      {/* Empty state */}
      {contacts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">👤</div>
          <h2 className="text-lg font-semibold text-white mb-2">
            No contacts yet
          </h2>
          <p className="text-sm text-white/40 max-w-sm mb-6">
            Install the THYN Chrome extension, visit a LinkedIn profile, and
            save your first contact.
          </p>
          <p className="text-xs text-white/30">
            Or use the extension sidebar to add one from any{" "}
            <code className="text-white/50">linkedin.com/in/*</code> profile.
          </p>
        </div>
      )}

      {/* Search empty */}
      {contacts.length > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-white/40">
            No contacts match "{search}"
          </p>
          <button
            onClick={() => setSearch("")}
            className="mt-3 text-sm text-blue-400 hover:text-blue-300 transition"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Contact list */}
      {filtered.length > 0 && (
        <div className="grid gap-3">
          {filtered.map((contact) => (
            <Link
              key={contact.id}
              href={`/contact/${contact.id}`}
              className="group flex items-center gap-4 p-4 bg-white/[.02] border border-white/10 rounded-xl hover:bg-white/[.04] hover:border-white/20 transition-all no-underline"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                {contact.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition">
                  {contact.name}
                </h3>
                {contact.headline && (
                  <p className="text-xs text-white/40 truncate mt-0.5">
                    {contact.headline}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  {contact.company && (
                    <span className="text-[11px] text-white/30">
                      {contact.company}
                    </span>
                  )}
                  <span className="text-[11px] text-white/20">
                    {formatRelative(contact.createdAt)}
                  </span>
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex gap-2 text-[11px] text-white/30">
                  {contact._count && (
                    <>
                      <span>{contact._count.notes} notes</span>
                      <span>{contact._count.reminders} reminders</span>
                    </>
                  )}
                </div>
                <button
                  onClick={(e) => handleDelete(contact.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Delete contact"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
