"use client"

import { useSession, signInWithGoogle } from "@/lib/shared"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthPage() {
  const { session, loading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session && !loading) router.push("/dashboard")
  }, [session, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-white/20 border-t-white rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <h1 className="text-4xl font-bold tracking-tight mb-2">THYN</h1>
        <p className="text-white/50 text-sm mb-8">
          Relationship Memory for LinkedIn
        </p>

        <button
          onClick={signInWithGoogle}
          className="w-full px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-[11px] text-white/30 mt-4">
          Sign in with your Google account to save and manage LinkedIn contacts.
        </p>
      </div>
    </div>
  )
}
