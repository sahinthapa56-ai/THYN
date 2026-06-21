"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Sync session with our backend
        const syncSession = async () => {
          try {
            await fetch("http://localhost:3001/auth/session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ access_token: session.access_token }),
            })
          } catch {
            // Backend might not be running — that's fine for now
          }
          router.push("/dashboard")
        }
        syncSession()
      }
    })

    // Handle the hash fragment from OAuth redirect
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.push("/dashboard")
      }
    })
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-6 h-6 border-2 border-white/20 border-t-white rounded-full" />
    </div>
  )
}
