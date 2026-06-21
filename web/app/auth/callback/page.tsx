"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/api"

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<"processing" | "error">("processing")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      // Supabase automatically handles the OAuth redirect
      // The session is set via the hash fragment
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        setError(error.message)
        setStatus("error")
        return
      }

      if (data.session) {
        // Exchange token with backend to create profile
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/session`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                access_token: data.session.access_token,
              }),
            }
          )
        } catch {
          // Profile creation is non-critical; backend will create on first API call
        }

        router.replace("/dashboard")
      } else {
        // Fallback: wait for onAuthStateChange
        const { data: listener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === "SIGNED_IN" && session) {
              listener?.subscription.unsubscribe()
              router.replace("/dashboard")
            }
          }
        )
      }
    }

    handleCallback()
  }, [router])

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] p-4">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-xl font-semibold text-white mb-2">
            Authentication Failed
          </h1>
          <p className="text-sm text-white/50 mb-6">{error}</p>
          <button
            onClick={() => router.push("/auth")}
            className="px-4 py-2 bg-white/10 text-white rounded-xl text-sm hover:bg-white/20 transition"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-sm text-white/50">Completing sign in...</p>
      </div>
    </div>
  )
}
