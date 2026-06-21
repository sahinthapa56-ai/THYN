"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LayoutDashboard, DollarSign, Users, FileText, TrendingUp, Settings, User, BarChart3, Activity, Plus, CheckSquare, Square, Trash2 } from "lucide-react"
import { NavBar, SiteFooter, useStars, useToast, ToastBar, drawRevenueChart, getCRM, getActivity, getAuthUser, getTasks, saveTasks, logActivity } from "@/lib/shared"
import type { CRMClient, AuthUser, TaskItem } from "@/lib/shared"

const kpiData = [
  { label: "Monthly Revenue", value: "$18,420", delta: "↑ 34% vs last month", icon: DollarSign, color: "#c8ff57" },
  { label: "Active Clients", value: "18", delta: "↑ 3 new this month", icon: Users, color: "#57ffee" },
  { label: "Proposals Sent", value: "42", delta: "↑ 12 this week", icon: FileText, color: "#ff9f57" },
  { label: "Conversion Rate", value: "91%", delta: "↑ 9% above avg", icon: TrendingUp, color: "#c857ff" },
  { label: "Invoices Pending", value: "$4.2K", delta: "3 awaiting payment", icon: BarChart3, color: "#ff5757" },
]

const recentProposals = [
  { name: "Nova Labs — AI Platform", value: "$12,000", time: "3 days ago", status: "Won" as const },
  { name: "Orbit Studio — Redesign", value: "$6,500", time: "5 days ago", status: "Pending" as const },
  { name: "Zenith Agency — SEO", value: "$3,200", time: "1 week ago", status: "Sent" as const },
  { name: "Peak Brands — Branding", value: "$8,800", time: "2 weeks ago", status: "Won" as const },
  { name: "Nebula Corp — Dashboard", value: "$15,000", time: "3 weeks ago", status: "Pending" as const },
]

const sidebarLinks = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
  { label: "Pricing AI", icon: DollarSign, href: "/pricing-ai" },
  { label: "Proposals", icon: FileText, href: "/proposals" },
  { label: "Invoices", icon: DollarSign, href: "/invoices" },
  { label: "CRM", icon: Users, href: "/crm" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
  { label: "Inbox", icon: LayoutDashboard, href: "/inbox" },
  { label: "Notes", icon: FileText, href: "/notes" },
  { label: "Profile", icon: User, href: "/profile" },
  { label: "Settings", icon: Settings, href: "/settings" },
]

export default function DashboardPage() {
  const starsRef = useRef<HTMLCanvasElement>(null)
  const revenueRef = useRef<HTMLCanvasElement>(null)
  const { toast, showToast } = useToast()
  useStars(starsRef)

  const [clients, setClients] = useState<CRMClient[]>([])
  const [activity, setActivity] = useState<string[]>([])
  const [user, setUser] = useState<AuthUser | null>(null)
  const [greeting, setGreeting] = useState("")
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [newTask, setNewTask] = useState("")

  useEffect(() => {
    setUser(getAuthUser())
    setClients(getCRM())
    setActivity(getActivity())
    setTasks(getTasks())
    setTimeout(() => drawRevenueChart(revenueRef.current), 300)

    const h = new Date().getHours()
    if (h < 12) setGreeting("Good morning")
    else if (h < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  const addTask = () => {
    if (!newTask.trim()) return
    const updated: TaskItem[] = [...tasks, { id: Date.now().toString(), text: newTask.trim(), done: false, date: new Date().toLocaleDateString() }]
    setTasks(updated)
    saveTasks(updated)
    setNewTask("")
    logActivity(`Added task: ${newTask.trim()}`)
  }

  const toggleTask = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
    setTasks(updated)
    saveTasks(updated)
  }

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id)
    setTasks(updated)
    saveTasks(updated)
  }

  const pipelineTotal = clients.reduce((sum, c) => {
    const n = parseFloat(String(c.value).replace(/[^0-9.]/g, ""))
    return sum + (isNaN(n) ? 0 : n)
  }, 0)

  return (
    <>
      <div className="fixed inset-0 opacity-[0.035] pointer-events-none z-[-1]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <canvas ref={starsRef} className="fixed inset-0 z-[-2]" />
      <ToastBar toast={toast} />
      <NavBar />

      <section className="pt-28 pb-20">
        <div className="container">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 reveal">
            <div>
              <h1 className="text-3xl font-serif italic">{greeting}, {user?.name?.split(" ")[0] || "Freelancer"}</h1>
              <p className="text-sm text-white/60 mt-1">Here&apos;s your business overview for today.</p>
            </div>
            <div className="flex gap-3">
              <a href="/pricing-ai" className="btn btn-primary text-sm px-5 py-2.5">AI Pricing</a>
              <a href="/proposals" className="btn btn-secondary text-sm px-5 py-2.5">New Proposal</a>
            </div>
          </div>

          {/* KPI Row */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-[18px] reveal">
            {kpiData.map(k => (
              <motion.div key={k.label} className="kpi-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between">
                  <div className="label">{k.label}</div>
                  <k.icon size={16} style={{ color: k.color }} />
                </div>
                <div className="value">{k.value}</div>
                <div className="delta">{k.delta}</div>
              </motion.div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-[2fr_1fr] gap-5 mt-7 reveal">
            {/* Revenue Chart */}
            <div className="chart-card">
              <div className="flex items-center justify-between mb-[18px]">
                <div className="text-base font-semibold">Revenue Growth</div>
                <a href="/analytics" className="text-xs text-[#c8ff57] no-underline hover:underline">View Analytics →</a>
              </div>
              <canvas ref={revenueRef} style={{ width: "100%", height: 200 }} />
            </div>

            {/* Recent Proposals */}
            <div className="chart-card">
              <div className="flex items-center justify-between mb-[18px]">
                <div className="text-base font-semibold">Recent Proposals</div>
                <a href="/proposals" className="text-xs text-[#c8ff57] no-underline hover:underline">View All →</a>
              </div>
              {recentProposals.map((p, i) => (
                <div key={i} className="flex justify-between items-center py-3.5 border-b border-white/[.04] last:border-b-0">
                  <div>
                    <div className="text-sm font-semibold">{p.name}</div>
                    <div className="text-xs text-white/60">{p.value} · {p.time}</div>
                  </div>
                  <span className={`pill ${p.status === 'Won' ? 'pill-won' : p.status === 'Pending' ? 'pill-pending' : 'pill-sent'}`}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid lg:grid-cols-3 gap-5 mt-7 reveal">
            {/* Task Manager */}
            <div className="chart-card">
              <div className="flex items-center justify-between mb-4">
                <div className="text-base font-semibold">Tasks</div>
                <span className="text-xs text-white/40">{tasks.filter(t => !t.done).length} pending</span>
              </div>
              <div className="flex gap-2 mb-4">
                <input placeholder="Add a task..." value={newTask} onChange={e => setNewTask(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addTask()}
                  className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-white/25" />
                <button onClick={addTask} className="px-3 py-2.5 rounded-xl bg-[#c8ff57]/15 text-[#c8ff57] hover:bg-[#c8ff57]/25 transition">
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-1 max-h-[200px] overflow-y-auto">
                {tasks.length === 0 ? (
                  <div className="text-xs text-white/30 text-center py-6">No tasks yet. Add your first task above.</div>
                ) : tasks.map(t => (
                  <div key={t.id} className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/[.03] group">
                    <button onClick={() => toggleTask(t.id)} className="flex-shrink-0">
                      {t.done ? <CheckSquare size={16} className="text-[#c8ff57]" /> : <Square size={16} className="text-white/30" />}
                    </button>
                    <span className={"text-sm flex-1 " + (t.done ? "line-through text-white/30" : "text-white/80")}>{t.text}</span>
                    <button onClick={() => deleteTask(t.id)} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-500/20 rounded transition-all">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pipeline Overview */}
            <div className="chart-card">
              <div className="text-base font-semibold mb-4">Pipeline Overview</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 rounded-xl bg-white/[.03]">
                  <div>
                    <div className="text-sm text-white/60">Total Pipeline</div>
                    <div className="text-2xl font-serif mt-1">${pipelineTotal.toLocaleString()}</div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[#c8ff57]/10 text-[#c8ff57] text-xs font-semibold">{clients.length} clients</div>
                </div>
                <div className="flex justify-between items-center p-4 rounded-xl bg-white/[.03]">
                  <div>
                    <div className="text-sm text-white/60">Active Clients</div>
                    <div className="text-2xl font-serif mt-1">{clients.filter(c => c.status === "Active").length}</div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[#57ffee]/10 text-[#57ffee] text-xs font-semibold">{Math.round(clients.filter(c => c.status === "Active").length / Math.max(clients.length, 1) * 100)}%</div>
                </div>
                <div className="flex justify-between items-center p-4 rounded-xl bg-white/[.03]">
                  <div>
                    <div className="text-sm text-white/60">In Proposals</div>
                    <div className="text-2xl font-serif mt-1">{clients.filter(c => c.status === "Proposal").length}</div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[#ffc857]/10 text-[#ffc857] text-xs font-semibold">Pending</div>
                </div>
              </div>
              <a href="/crm" className="block text-center mt-4 text-xs text-[#c8ff57] no-underline hover:underline">Manage CRM →</a>
            </div>

            {/* Activity Feed */}
            <div className="chart-card">
              <div className="flex items-center justify-between mb-4">
                <div className="text-base font-semibold">Recent Activity</div>
                <Activity size={16} className="text-white/30" />
              </div>
              <div className="space-y-2 max-h-[220px] overflow-y-auto">
                {activity.length > 0 ? activity.slice(0, 8).map((a, i) => (
                  <div key={i} className="flex items-start gap-3 py-2.5 border-b border-white/[.03] last:border-b-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c8ff57] mt-1.5 flex-shrink-0" />
                    <span className="text-xs text-white/70 leading-relaxed">{a}</span>
                  </div>
                )) : (
                  <div className="text-xs text-white/30 text-center py-6">No activity yet. Generate a proposal or pricing report to see your activity here.</div>
                )}
              </div>
            </div>
          </div>

          {/* CRM Table Summary */}
          {clients.length > 0 && (
            <div className="chart-card mt-7 reveal">
              <div className="flex items-center justify-between mb-4">
                <div className="text-base font-semibold">Recent Clients</div>
                <a href="/crm" className="text-xs text-[#c8ff57] no-underline hover:underline">View All →</a>
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-4 text-xs text-white/60 uppercase tracking-wider font-semibold border-b border-white/[.07]">Client</th>
                    <th className="text-left py-3 px-4 text-xs text-white/60 uppercase tracking-wider font-semibold border-b border-white/[.07]">Project</th>
                    <th className="text-left py-3 px-4 text-xs text-white/60 uppercase tracking-wider font-semibold border-b border-white/[.07]">Value</th>
                    <th className="text-left py-3 px-4 text-xs text-white/60 uppercase tracking-wider font-semibold border-b border-white/[.07]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.slice(0, 5).map((c, i) => (
                    <tr key={i} className="hover:bg-white/[.02]">
                      <td className="py-3 px-4 text-sm text-[#ddd] border-b border-white/[.04]">{c.client}</td>
                      <td className="py-3 px-4 text-sm text-[#ddd] border-b border-white/[.04]">{c.project}</td>
                      <td className="py-3 px-4 text-sm text-[#ddd] border-b border-white/[.04]">{c.value}</td>
                      <td className="py-3 px-4 border-b border-white/[.04]">
                        <span className={`status-badge ${c.status === 'Active' ? 'status-active' : c.status === 'Proposal' ? 'status-proposal' : c.status === 'Invoice Sent' ? 'status-invoice' : 'status-closed'}`}>{c.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
