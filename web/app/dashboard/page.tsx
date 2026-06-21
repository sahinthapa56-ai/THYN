"use client"

import { useEffect, useState } from "react"
import { getContacts } from "@/lib/api"
import { formatRelative } from "@/lib/shared"
import Link from "next/link"

interface Contact {
  id: string
  name: string
  headline: string | null
  company: string | null
  linkedinUrl: string
  avatarUrl: string | null
  location: string | null
  updatedAt: string
  _count: { notes: number; reminders: number }
}

export default function DashboardPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    getContacts()
      .then((data) => setContacts(data.contacts))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = search
    ? contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          (c.company?.toLowerCase() || "").includes(search.toLowerCase()) ||
          (c.headline?.toLowerCase() || "").includes(search.toLowerCase())
      )
    : contacts

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contacts</h1>
          <p className="text-sm text-white/50 mt-1">
            {contacts.length} saved LinkedIn connection
            {contacts.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search contacts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-white/25 placeholder:text-white/30"
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-6 h-6 border-2 border-white/20 border-t-white rounded-full" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-3">👋</div>
          <p className="text-white/50 text-sm">
            {search
              ? "No contacts match your search."
              : "No contacts yet. Open a LinkedIn profile with the THYN extension to save one."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((contact) => (
            <Link
              key={contact.id}
              href={`/contact/${contact.id}`}
              className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/[.03] border border-white/[.06] hover:bg-white/[.06] hover:border-white/20 transition no-underline"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium shrink-0 text-white/60">
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
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-white">{contact.name}</div>
                <div className="text-xs text-white/40 truncate">
                  {contact.headline || contact.company || "LinkedIn Connection"}
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/30">
                {contact._count.notes > 0 && (
                  <span>{contact._count.notes} notes</span>
                )}
                {contact._count.reminders > 0 && (
                  <span>{contact._count.reminders} reminders</span>
                )}
                <span>{formatRelative(contact.updatedAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
