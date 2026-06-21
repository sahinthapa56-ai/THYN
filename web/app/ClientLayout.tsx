"use client"

import { useSession, signOut } from "@/lib/shared"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { session, loading } = useSession()
  const pathname = usePathname()

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-sm text-white/40">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {session && <AppShell session={session}>{children}</AppShell>}
      {!session && children}
    </>
  )
}

function AppShell({
  session,
  children,
}: {
  session: any
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [copied, setCopied] = useState(false)

  const navItems = [
    { href: "/dashboard", label: "Contacts", icon: "👥" },
    { href: "/settings", label: "Settings", icon: "⚙️" },
  ]

  // Don't show shell on auth pages
  if (pathname.startsWith("/auth")) {
    return <>{children}</>
  }

  const copyToken = async () => {
    const { data } = await (await import("@/lib/api")).supabase.auth.getSession()
    if (data.session?.access_token) {
      await navigator.clipboard.writeText(data.session.access_token)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#050505]">
      {/* Sidebar */}
      <aside className="w-56 border-r border-white/10 bg-white/[.02] flex flex-col shrink-0">
        {/* Logo */}
        <div className="p-4 border-b border-white/5">
          <Link
            href="/dashboard"
            className="text-xl font-bold tracking-tight no-underline text-white"
          >
            THYN
          </Link>
          <p className="text-[10px] text-white/30 mt-0.5 tracking-wide uppercase">
            Relationship Memory
          </p>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 p-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm no-underline transition-all ${
                pathname.startsWith(item.href)
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {session.user?.email?.charAt(0).toUpperCase() || "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white/50 truncate">
                {session.user?.email}
              </p>
            </div>
          </div>
          <div className="mt-1.5 flex gap-1.5">
            <button
              onClick={copyToken}
              className="flex-1 px-2.5 py-1.5 rounded-lg text-[11px] text-white/40 hover:text-white/80 hover:bg-white/5 transition text-left"
              title="Copy access token for extension"
            >
              {copied ? "✓ Copied!" : "Copy Token"}
            </button>
            <button
              onClick={signOut}
              className="px-2.5 py-1.5 rounded-lg text-[11px] text-white/40 hover:text-red-400 hover:bg-red-500/5 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
