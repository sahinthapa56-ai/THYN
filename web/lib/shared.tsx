"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/api"

// ── Types ──────────────────────────────────────────────────

export interface Profile {
  id: string
  email: string
  name: string
  avatar: string
  supabaseId: string
  createdAt?: string
}

export interface Contact {
  id: string
  profileId: string
  linkedinUrl: string
  name: string
  headline: string | null
  company: string | null
  position: string | null
  location: string | null
  avatarUrl: string | null
  summary: string | null
  tags: string[]
  createdAt: string
  updatedAt: string
  _count?: { notes: number; reminders: number }
  notes?: Note[]
  reminders?: Reminder[]
}

export interface Note {
  id: string
  contactId: string
  profileId: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface Reminder {
  id: string
  contactId: string
  profileId: string
  title: string
  note: string | null
  dueAt: string
  done: boolean
  createdAt: string
  updatedAt: string
  contact?: { name: string; linkedinUrl: string }
}

// ── Auth ──────────────────────────────────────────────────

export function useSession() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => listener?.subscription.unsubscribe()
  }, [])

  return { session, loading }
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })
  if (error) throw error
}

export async function signOut() {
  await supabase.auth.signOut()
}

// ── Utility ───────────────────────────────────────────────

export function formatRelative(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString()
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
