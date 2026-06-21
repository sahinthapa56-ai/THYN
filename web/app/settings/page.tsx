"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/api"
import { formatDate, type Profile } from "@/lib/shared"

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Token state
  const [token, setToken] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Health check
  const [healthStatus, setHealthStatus] = useState<
    "checking" | "ok" | "error"
  >("checking")

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session) return

        setToken(session.access_token)

        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
          }/auth/me`,
          {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }
        )
        if (res.ok) {
          const data = await res.json()
          setProfile(data.profile)
        }
      } catch (err) {
        setError("Could not load profile")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Health check
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
          }/health`
        )
        if (res.ok) {
          const data = await res.json()
          setHealthStatus(data.status === "ok" ? "ok" : "error")
        } else {
          setHealthStatus("error")
        }
      } catch {
        setHealthStatus("error")
      }
    }
    check()
  }, [])

  const copyToken = async () => {
    if (token) {
      await navigator.clipboard.writeText(token)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-sm text-white/40">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      {/* Connection Status */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-white mb-3">
          Connection Status
        </h2>
        <div className="flex items-center gap-2 p-3 bg-white/[.02] border border-white/10 rounded-xl">
          <div
            className={`w-2 h-2 rounded-full ${
              healthStatus === "checking"
                ? "bg-yellow-500 animate-pulse"
                : healthStatus === "ok"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />
          <span className="text-sm text-white/60">
            {healthStatus === "checking"
              ? "Checking API connection..."
              : healthStatus === "ok"
              ? "Backend API connected"
              : "Cannot reach backend API"}
          </span>
          {healthStatus === "error" && (
            <span className="text-xs text-white/30 ml-auto">
              Check that the backend is running on port 3001
            </span>
          )}
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white/[.02] border border-white/10 rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-white mb-4">Account</h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            {error}
          </div>
        )}

        {profile ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm text-white/40">Name</span>
              <span className="text-sm text-white/80">{profile.name}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm text-white/40">Email</span>
              <span className="text-sm text-white/80">{profile.email}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-white/40">Joined</span>
              <span className="text-sm text-white/80">
                {profile ? formatDate(profile.createdAt!) : "—"}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 py-2">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-white">
              ?
            </div>
            <div>
              <p className="text-sm text-white/80">
                Signed in with Google
              </p>
              <p className="text-xs text-white/40">
                Profile synced from Supabase
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Access Token */}
      <div className="bg-white/[.02] border border-white/10 rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-white mb-1">
          Extension Access Token
        </h2>
        <p className="text-xs text-white/40 mb-4">
          Copy this token into the THYN extension to authenticate.
        </p>

        {token ? (
          <div className="flex gap-2">
            <div className="flex-1 p-3 bg-white/[.03] border border-white/10 rounded-lg">
              <code className="text-xs text-white/50 break-all select-all font-mono">
                {token.slice(0, 40)}...
              </code>
            </div>
            <button
              onClick={copyToken}
              className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-white/30">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Loading token...
          </div>
        )}
      </div>

      {/* API Info */}
      <div className="bg-white/[.02] border border-white/10 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">
          API Configuration
        </h2>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-white/40">API URL</span>
            <code className="text-white/50 font-mono">
              {process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}
            </code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/40">Supabase URL</span>
            <code className="text-white/50 font-mono">
              {process.env.NEXT_PUBLIC_SUPABASE_URL || "not set"}
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}
