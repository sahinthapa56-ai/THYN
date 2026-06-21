"use client"

import { useRef, useState, useEffect } from "react"
import { NavBar, SiteFooter, useStars, useToast, ToastBar, getAuthUser, saveAuthUser, clearAuthUser, saveProfile, defaultProfile, getPlan, getPlanLabel, setPlan, getRemainingCredits } from "@/lib/shared"
import type { AuthUser } from "@/lib/shared"

export default function AuthPage() {
  const starsRef = useRef<HTMLCanvasElement>(null)
  const { toast, showToast } = useToast()
  useStars(starsRef)

  const [tab, setTab] = useState<"register" | "login">("register")
  const [user, setUser] = useState<AuthUser | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setUser(getAuthUser()); setMounted(true) }, [])

  const register = () => {
    const name = (document.getElementById("reg-name") as HTMLInputElement)?.value
    const email = (document.getElementById("reg-email") as HTMLInputElement)?.value
    const password = (document.getElementById("reg-password") as HTMLInputElement)?.value
    if (!name || !email || !password) { showToast("Fill all fields"); return }
    const u = { name, email }
    saveAuthUser(u)
    saveProfile(defaultProfile(name, email))
    setUser(u)
    showToast("Account created! Welcome to SHNTHA.")
  }

  const login = () => {
    const email = (document.getElementById("login-email") as HTMLInputElement)?.value
    const password = (document.getElementById("login-password") as HTMLInputElement)?.value
    if (!email || !password) { showToast("Fill all fields"); return }
    const saved = getAuthUser()
    if (saved) { setUser(saved); showToast(`Welcome back, ${saved.name}!`) }
    else showToast("No account found. Create one first.")
  }

  const logout = () => {
    clearAuthUser()
    setUser(null)
    showToast("Signed out")
  }

  if (!mounted) return <div className="min-h-screen" />

  return (
    <>
      <div className="fixed inset-0 opacity-[0.035] pointer-events-none z-[-1]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <canvas ref={starsRef} className="fixed inset-0 z-[-2]" />
      <ToastBar toast={toast} />
      <NavBar />

      <section className="pt-32 pb-20">
        <div className="container">
          <h2 className="title reveal">Create Your Account</h2>
          <p className="subtitle reveal">Join freelancers using SHNTHA to win more clients and earn more. Start your 4-month free trial today — no credit card required.</p>

          <div className="max-w-[520px] mx-auto rounded-[28px] p-10 reveal"
            style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.18)" }}>
            {user ? (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#c8ff57] flex items-center justify-center text-black text-2xl font-bold mx-auto mb-3">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-lg font-semibold text-[#7dff9f]">Welcome, {user.name}!</div>
                <div className="text-sm text-white/60 mt-1">{user.email}</div>
                <div className="mt-4 px-4 py-2 rounded-xl bg-white/[.04] border border-white/10 inline-block">
                  <span className="text-xs text-white/60">Plan: </span>
                  <span className="text-xs font-semibold text-[#c8ff57]">{getPlanLabel(getPlan())}</span>
                  {getPlan() === "free" && (
                    <span className="text-xs text-white/40 ml-2">({getRemainingCredits()} credits left)</span>
                  )}
                </div>
                {getPlan() === "free" && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-white/40">Upgrade to unlock unlimited generations:</p>
                    <div className="flex gap-2 justify-center flex-wrap">
                      <button onClick={() => { setPlan("premium"); showToast("Upgraded to Premium!"); }}
                        className="px-4 py-2 rounded-xl bg-[#c8ff57] text-black text-xs font-semibold hover:bg-[#d8ff70] transition">Premium $19/mo</button>
                      <button onClick={() => { setPlan("elite"); showToast("Upgraded to Elite!"); }}
                        className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/15 transition border border-white/10">Elite $49/mo</button>
                      <button onClick={() => { setPlan("team"); showToast("Enterprise plan selected!"); }}
                        className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/15 transition border border-white/10">Enterprise</button>
                    </div>
                  </div>
                )}
                <div className="flex gap-3 justify-center mt-6">
                  <a href="/dashboard"
                    className="px-5 py-2.5 rounded-xl bg-[#c8ff57] text-black text-sm font-semibold no-underline hover:bg-[#d8ff70] transition">Go to Dashboard</a>
                  <button onClick={logout}
                    className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-sm text-white/60 hover:bg-white/15 transition">Sign Out</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex gap-0 mb-7 bg-white/[.04] rounded-xl p-1">
                  <button onClick={() => setTab("register")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${tab === "register" ? "bg-white/10 text-white" : "text-white/60"}`}>Create Account</button>
                  <button onClick={() => setTab("login")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${tab === "login" ? "bg-white/10 text-white" : "text-white/60"}`}>Sign In</button>
                </div>
                {tab === "register" ? (
                  <div className="flex flex-col gap-1">
                    <label className="form-label">Full Name</label>
                    <input id="reg-name" placeholder="Your full name"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25" />
                    <label className="form-label">Email Address</label>
                    <input id="reg-email" type="email" placeholder="you@email.com"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25" />
                    <label className="form-label">Password</label>
                    <input id="reg-password" type="password" placeholder="Create a strong password"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25" />
                    <button className="gen-btn mt-5" onClick={register}>Start 4-Month Free Trial →</button>
                    <p className="text-[11px] text-white/30 text-center mt-3">$19/mo after trial. Cancel anytime. No credit card needed.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <label className="form-label">Email Address</label>
                    <input id="login-email" type="email" placeholder="you@email.com"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25" />
                    <label className="form-label">Password</label>
                    <input id="login-password" type="password" placeholder="Your password"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25" />
                    <button className="gen-btn mt-5" onClick={login}>Sign In →</button>
                    <p className="text-[11px] text-white/30 text-center mt-3">Demo: just enter the email you registered with</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
