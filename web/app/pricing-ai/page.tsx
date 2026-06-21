"use client"

import { useRef, useState } from "react"
import { Copy } from "lucide-react"
import { NavBar, SiteFooter, useStars, useToast, ToastBar, copyText, generatePricingReport, logActivity, canUse, useCredit, UsageIndicator } from "@/lib/shared"

export default function PricingAIPage() {
  const starsRef = useRef<HTMLCanvasElement>(null)
  const { toast, showToast } = useToast()
  useStars(starsRef)

  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState("")

  const form = useRef({ role: "", experience: "", region: "", budget: "", scope: "" })

  const generate = async () => {
    if (!canUse()) { showToast("You've used all 5 free generations. Upgrade to continue."); return }
    setLoading(true)
    setOutput("")
    await new Promise(r => setTimeout(r, 800 + Math.random() * 1200))
    const result = generatePricingReport({
      role: form.current.role,
      experience: form.current.experience,
      region: form.current.region,
      budget: form.current.budget,
      scope: form.current.scope,
    })
    setOutput(result)
    useCredit()
    logActivity(`Generated pricing report for ${form.current.role || "Freelancer"} role`)
    showToast("Pricing report generated!")
    setLoading(false)
  }

  const inputs = [
    { label: "Freelancer Role", placeholder: "e.g. Full-Stack Developer, UX Designer", field: "role" as const },
    { label: "Client Budget", placeholder: "e.g. $5,000 or Unknown", field: "budget" as const },
  ]
  const selects = [
    { label: "Experience Level", field: "experience" as const, options: ["", "0–2 Years (Junior)", "3–5 Years (Mid-Level)", "6–10 Years (Senior)", "10+ Years (Principal/Expert)"] },
    { label: "Region", field: "region" as const, options: ["", "Nepal", "India", "Southeast Asia", "Eastern Europe", "Western Europe", "United States", "Canada", "Australia", "Remote / Global"] },
  ]

  return (
    <>
      <div className="fixed inset-0 opacity-[0.035] pointer-events-none z-[-1]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <canvas ref={starsRef} className="fixed inset-0 z-[-2]" />
      <ToastBar toast={toast} />
      <NavBar />

      <section className="pt-32 pb-20">
        <div className="container">
          <h2 className="title reveal">AI Pricing Calculator</h2>
          <p className="subtitle reveal">Enter your details and get AI-powered rate recommendations and negotiation strategy — included in your SHNTHA plan.</p>

          <div className="grid lg:grid-cols-2 gap-6 reveal">
            <div className="card">
              <h3 className="text-xl mb-1">Pricing Inputs</h3>
              <p className="text-xs text-white/60 mb-1">AI analyzes your role, region & scope</p>
              {inputs.map(i => (
                <div key={i.field}>
                  <label className="form-label">{i.label}</label>
                  <input placeholder={i.placeholder}
                    onChange={e => form.current[i.field] = e.target.value}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25" />
                </div>
              ))}
              {selects.map(s => (
                <div key={s.field}>
                  <label className="form-label">{s.label}</label>
                  <select onChange={e => form.current[s.field] = e.target.value}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25">
                    {s.options.map(o => <option key={o} value={o}>{o || `Select ${s.label}`}</option>)}
                  </select>
                </div>
              ))}
              <label className="form-label">Project Scope</label>
              <textarea rows={4} placeholder="Describe the project scope, deliverables, and timeline..."
                onChange={e => form.current.scope = e.target.value}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25 resize-y" />
              <div className="flex items-center gap-1.5 py-2" style={{ display: loading ? "flex" : "none" }}>
                {[0, 1, 2].map(i => <span key={i} className="w-[7px] h-[7px] rounded-full bg-[#c8ff57] animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
              </div>
              <button className="gen-btn" onClick={generate} disabled={loading}>⚡ Generate AI Pricing</button>
              <UsageIndicator />
            </div>

            <div className="card output-panel">
              {output ? (
                <>
                  <div className="text-sm whitespace-pre-wrap leading-relaxed text-[#ddd]">{output}</div>
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button onClick={() => copyText(output, showToast)}
                      className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-xs text-white hover:bg-white/15 transition">
                      <Copy size={12} className="inline mr-1" />Copy
                    </button>
                  </div>
                </>
              ) : (
                <div className="output-placeholder">AI pricing report will appear here.<br /><span className="text-xs opacity-50">Fill in your details and click Generate</span></div>
              )}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
