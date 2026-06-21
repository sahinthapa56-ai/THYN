"use client"

import { useSession } from "@/lib/shared"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "@/lib/shared"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { session } = useSession()

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

  const navItems = [
    { href: "/dashboard", label: "Contacts" },
    { href: "/settings", label: "Settings" },
  ]

  // Don't show shell on auth pages
  if (pathname.startsWith("/auth")) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 border-r border-white/10 bg-white/[.02] flex flex-col p-4 shrink-0">
        <Link
          href="/dashboard"
          className="text-xl font-bold tracking-tight mb-8 no-underline text-white"
        >
          THYN
        </Link>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg text-sm no-underline transition ${
                pathname.startsWith(item.href)
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium">
              {session.user?.email?.charAt(0).toUpperCase() || "?"}
            </div>
            <span className="text-xs text-white/50 truncate flex-1">
              {session.user?.email}
            </span>
          </div>
          <button
            onClick={signOut}
            className="w-full mt-1 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/80 hover:bg-white/5 transition text-left"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
