"use client"

import { useRef, useState } from "react"
import { Copy } from "lucide-react"
import { NavBar, SiteFooter, useStars, useToast, ToastBar, copyText, generateProposal, logActivity, getCRM, saveCRM, canUse, useCredit, UsageIndicator } from "@/lib/shared"

export default function ProposalsPage() {
  const starsRef = useRef<HTMLCanvasElement>(null)
  const { toast, showToast } = useToast()
  useStars(starsRef)

  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState("")

  const form = useRef({ client: "", project: "", tone: "Professional", budget: "", timeline: "", details: "" })

  const generate = async () => {
    if (!canUse()) { showToast("You've used all 5 free generations. Upgrade to continue."); return }
    setLoading(true)
    setOutput("")
    await new Promise(r => setTimeout(r, 800 + Math.random() * 1200))
    const result = generateProposal({
      client: form.current.client,
      project: form.current.project,
      tone: form.current.tone,
      budget: form.current.budget,
      timeline: form.current.timeline,
      details: form.current.details,
    })
    setOutput(result)
    useCredit()
    // Add to CRM
    const crm = getCRM()
    crm.unshift({
      client: form.current.client || "Client",
      project: form.current.project || "Web Project",
      value: form.current.budget || "TBD",
      status: "Proposal",
      date: new Date().toLocaleDateString(),
    })
    saveCRM(crm)
    logActivity(`Generated proposal for ${form.current.client || "Client"} — ${form.current.project || "Web Project"}`)
    showToast("Proposal generated!")
    setLoading(false)
  }

  return (
    <>
      <div className="fixed inset-0 opacity-[0.035] pointer-events-none z-[-1]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <canvas ref={starsRef} className="fixed inset-0 z-[-2]" />
      <ToastBar toast={toast} />
      <NavBar />

      <section className="pt-32 pb-20">
        <div className="container">
          <h2 className="title reveal">AI Proposal Generator</h2>
          <p className="subtitle reveal">Generate cinematic, professional proposals in seconds — ready to send to any client. Part of your SHNTHA subscription.</p>

          <div className="grid lg:grid-cols-2 gap-6 reveal">
            <div className="card">
              <h3 className="text-xl mb-1">Proposal Inputs</h3>
              <p className="text-xs text-white/60 mb-1">AI crafts the perfect proposal</p>

              <label className="form-label">Client Name</label>
              <input placeholder="e.g. Nova Labs" onChange={e => form.current.client = e.target.value}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25" />

              <label className="form-label">Project Type</label>
              <input placeholder="e.g. AI SaaS Platform" onChange={e => form.current.project = e.target.value}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25" />

              <label className="form-label">Proposal Tone</label>
              <select onChange={e => form.current.tone = e.target.value}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25">
                {["Professional", "Luxury / Premium", "Creative / Bold", "Corporate", "Friendly / Casual"].map(o =>
                  <option key={o} value={o}>{o}</option>
                )}
              </select>

              <label className="form-label">Budget Range</label>
              <input placeholder="e.g. $8,000–$12,000" onChange={e => form.current.budget = e.target.value}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25" />

              <label className="form-label">Timeline</label>
              <input placeholder="e.g. 4 weeks" onChange={e => form.current.timeline = e.target.value}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25" />

              <label className="form-label">Project Details</label>
              <textarea rows={5} placeholder="Describe what the client needs, their goals, and key deliverables..."
                onChange={e => form.current.details = e.target.value}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25 resize-y" />

              <div className="flex items-center gap-1.5 py-2" style={{ display: loading ? "flex" : "none" }}>
                {[0, 1, 2].map(i => <span key={i} className="w-[7px] h-[7px] rounded-full bg-[#c8ff57] animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
              </div>
              <button className="gen-btn" onClick={generate} disabled={loading}>📄 Generate Proposal</button>
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
                <div className="output-placeholder">Your AI-generated proposal will appear here.<br /><span className="text-xs opacity-50">Fill in the form and click Generate</span></div>
              )}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
