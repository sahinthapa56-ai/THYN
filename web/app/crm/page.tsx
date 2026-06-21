"use client"

import { useRef, useState, useEffect } from "react"
import { Plus, Trash2, Search } from "lucide-react"
import { NavBar, SiteFooter, useStars, useToast, ToastBar, getCRM, saveCRM, logActivity } from "@/lib/shared"
import type { CRMClient } from "@/lib/shared"

export default function CRMPage() {
  const starsRef = useRef<HTMLCanvasElement>(null)
  const { toast, showToast } = useToast()
  useStars(starsRef)

  const [clients, setClients] = useState<CRMClient[]>([])
  const [form, setForm] = useState({ client: "", project: "", value: "", status: "Proposal" })
  const [search, setSearch] = useState("")

  useEffect(() => {
    const saved = getCRM()
    setClients(saved.length ? saved : [
      { client: "Nova Labs", project: "AI Platform", value: "$12,000", status: "Active", date: "Jan 15" },
      { client: "Orbit Studio", project: "Redesign", value: "$6,500", status: "Proposal", date: "Feb 3" },
      { client: "Zenith Agency", project: "SEO Campaign", value: "$3,200", status: "Invoice Sent", date: "Jan 28" },
      { client: "Peak Brands", project: "Branding Kit", value: "$8,800", status: "Active", date: "Feb 10" },
    ])
  }, [])

  const addClient = () => {
    if (!form.client.trim()) { showToast("Enter client name"); return }
    const updated = [...clients, { ...form, project: form.project || "TBD", value: form.value || "TBD", date: new Date().toLocaleDateString() }]
    setClients(updated)
    saveCRM(updated)
    setForm({ client: "", project: "", value: "", status: "Proposal" })
    logActivity(`Added client: ${form.client}`)
    showToast("Client added!")
  }

  const deleteClient = (index: number) => {
    const name = clients[index].client
    const updated = clients.filter((_, i) => i !== index)
    setClients(updated)
    saveCRM(updated)
    logActivity(`Deleted client: ${name}`)
    showToast("Client deleted")
  }

  const filtered = clients.filter(c =>
    c.client.toLowerCase().includes(search.toLowerCase()) ||
    c.project.toLowerCase().includes(search.toLowerCase()) ||
    c.status.toLowerCase().includes(search.toLowerCase())
  )

  const pipelineTotal = clients.reduce((sum, c) => {
    const n = parseFloat(String(c.value).replace(/[^0-9.]/g, ""))
    return sum + (isNaN(n) ? 0 : n)
  }, 0)

  const statusClass = (s: string) =>
    s === "Active" ? "status-active" : s === "Proposal" ? "status-proposal" : s === "Invoice Sent" ? "status-invoice" : "status-closed"

  return (
    <>
      <div className="fixed inset-0 opacity-[0.035] pointer-events-none z-[-1]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <canvas ref={starsRef} className="fixed inset-0 z-[-2]" />
      <ToastBar toast={toast} />
      <NavBar />

      <section className="pt-32 pb-20">
        <div className="container">
          <h2 className="title reveal">Client CRM System</h2>
          <p className="subtitle reveal">Manage projects, clients, invoices, and communication pipelines from one command center.</p>

          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-[22px] reveal">
            <div className="card">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h3 className="text-lg">Active Clients</h3>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-[200px] bg-[#0a0a0a] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white outline-none focus:border-white/25" />
                </div>
              </div>
              <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-3.5 px-4 text-xs text-white/60 uppercase tracking-wider font-semibold border-b border-white/[.07]">Client</th>
                    <th className="text-left py-3.5 px-4 text-xs text-white/60 uppercase tracking-wider font-semibold border-b border-white/[.07]">Project</th>
                    <th className="text-left py-3.5 px-4 text-xs text-white/60 uppercase tracking-wider font-semibold border-b border-white/[.07]">Value</th>
                    <th className="text-left py-3.5 px-4 text-xs text-white/60 uppercase tracking-wider font-semibold border-b border-white/[.07]">Status</th>
                    <th className="text-left py-3.5 px-4 text-xs text-white/60 uppercase tracking-wider font-semibold border-b border-white/[.07] w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} className="py-8 text-center text-sm text-white/30">No clients found</td></tr>
                  ) : filtered.map((c, i) => (
                    <tr key={i} className="group hover:bg-white/[.02]">
                      <td className="py-3.5 px-4 text-sm text-[#ddd] border-b border-white/[.04]">{c.client}</td>
                      <td className="py-3.5 px-4 text-sm text-[#ddd] border-b border-white/[.04]">{c.project}</td>
                      <td className="py-3.5 px-4 text-sm text-[#ddd] border-b border-white/[.04]">{c.value}</td>
                      <td className="py-3.5 px-4 border-b border-white/[.04]">
                        <span className={`status-badge ${statusClass(c.status)}`}>{c.status}</span>
                      </td>
                      <td className="py-3.5 px-4 border-b border-white/[.04]">
                        <button onClick={() => deleteClient(clients.indexOf(c))}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg mb-4">Add New Client</h3>
              <div className="flex flex-col gap-2.5">
                <input placeholder="Client Name" value={form.client}
                  onChange={e => setForm(p => ({ ...p, client: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25" />
                <input placeholder="Project Type" value={form.project}
                  onChange={e => setForm(p => ({ ...p, project: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25" />
                <input placeholder="Project Value" value={form.value}
                  onChange={e => setForm(p => ({ ...p, value: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25" />
                <select value={form.status}
                  onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25">
                  {["Proposal", "Active", "Invoice Sent", "Closed"].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <button onClick={addClient} className="py-2.5 rounded-xl bg-[#c8ff57]/15 text-[#c8ff57] font-semibold text-sm hover:bg-[#c8ff57]/25 transition">
                  <Plus size={14} className="inline mr-1" />Add Client
                </button>
              </div>

              <div className="mt-6">
                <div className="preview-card">
                  <div className="kpi-label">Total Pipeline</div>
                  <div className="kpi">${pipelineTotal.toLocaleString()}</div>
                </div>
                <div className="preview-card mt-3">
                  <div className="kpi-label">Leads This Month</div>
                  <div className="kpi">18</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
