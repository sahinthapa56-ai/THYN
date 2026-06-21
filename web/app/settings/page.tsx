"use client"

import { useSession } from "@/lib/shared"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/api"

export default function SettingsPage() {
  const { session, loading } = useSession()
  const [copied, setCopied] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-6 h-6 border-2 border-white/20 border-t-white rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-xl font-bold tracking-tight mb-6">Settings</h1>

      {/* Account */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
          Account
        </h2>
        <div className="p-4 rounded-xl bg-white/[.03] border border-white/[.06] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">Email</span>
            <span className="text-sm font-medium">{session?.user?.email || "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">Signed in via</span>
            <span className="text-sm font-medium">Google (Supabase)</span>
          </div>
        </div>
      </section>

      {/* Extension */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
          Extension
        </h2>
        <div className="p-4 rounded-xl bg-white/[.03] border border-white/[.06]">
          <p className="text-sm text-white/60 mb-3">
            Install the THYN Chrome extension to save contacts directly from
            LinkedIn.
          </p>
          <a
            href="#"
            className="inline-block px-4 py-2 rounded-lg bg-white/10 text-xs font-medium text-white/80 hover:bg-white/20 transition no-underline"
          >
            Download Extension
          </a>
        </div>
      </section>

      {/* Auth Token */}
      <section>
        <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
          Access Token
        </h2>
        <div className="p-4 rounded-xl bg-white/[.03] border border-white/[.06]">
          <p className="text-xs text-white/40 mb-2">
            Use this token to authenticate the THYN extension with your account.
          </p>
          <button
            onClick={async () => {
              const {
                data: { session },
              } = await supabase.auth.getSession()
              if (session?.access_token) {
                await navigator.clipboard.writeText(session.access_token)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }
            }}
            className="px-4 py-2 rounded-lg bg-white/10 text-xs font-medium text-white/80 hover:bg-white/20 transition"
          >
            {copied ? "Copied!" : "Copy Token"}
          </button>
        </div>
      </section>
    </div>
  )
}
