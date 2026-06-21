"use client"

import { useEffect, useRef, useCallback, useState } from "react"

/* ── Types ── */
export interface CRMClient {
  client: string
  project: string
  value: string
  status: string
  date: string
}

export interface AuthUser {
  name: string
  email: string
}

export interface UserProfile {
  name: string
  email: string
  avatar: string
  bio: string
  title: string
  skills: string[]
  social: { twitter: string; linkedin: string; github: string; website: string }
  preferences: { theme: string; emailNotifications: boolean; dailyDigest: boolean }
}

export interface AppSettings {
  theme: string
  dailyDigest: boolean
  taskReminders: boolean
  redactSensitive: boolean
  localFirst: boolean
  defaultModel: string
  summaryLength: string
}

export function defaultProfile(name: string, email: string): UserProfile {
  return {
    name, email,
    avatar: "",
    bio: "Freelancer passionate about delivering exceptional digital experiences.",
    title: "Freelance Developer",
    skills: ["Web Development", "UI/UX Design", "API Integration"],
    social: { twitter: "", linkedin: "", github: "", website: "" },
    preferences: { theme: "dark", emailNotifications: true, dailyDigest: true }
  }
}

export function defaultSettings(): AppSettings {
  return {
    theme: "dark",
    dailyDigest: true,
    taskReminders: true,
    redactSensitive: true,
    localFirst: true,
    defaultModel: "gpt-4",
    summaryLength: "medium"
  }
}

/* ── Auth User ── */
export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  const s = localStorage.getItem("shntha_user")
  return s ? JSON.parse(s) : null
}

export function saveAuthUser(user: AuthUser) {
  localStorage.setItem("shntha_user", JSON.stringify(user))
}

export function clearAuthUser() {
  localStorage.removeItem("shntha_user")
}

/* ── Usage & Plans ── */
export type PlanTier = "free" | "premium" | "elite" | "team"
export const FREE_CREDITS = 5

export function getPlan(): PlanTier {
  if (typeof window === "undefined") return "free"
  return (localStorage.getItem("shntha_plan") as PlanTier) || "free"
}

export function setPlan(p: PlanTier) {
  localStorage.setItem("shntha_plan", p)
}

export function getUsage(): number {
  if (typeof window === "undefined") return 0
  return parseInt(localStorage.getItem("shntha_usage") || "0")
}

function setUsage(n: number) {
  localStorage.setItem("shntha_usage", String(n))
}

export function getRemainingCredits(): number {
  const plan = getPlan()
  if (plan !== "free") return 999
  return Math.max(0, FREE_CREDITS - getUsage())
}

export function canUse(): boolean {
  return getRemainingCredits() > 0
}

export function useCredit(): number {
  const plan = getPlan()
  if (plan !== "free") return 999
  const used = getUsage() + 1
  setUsage(used)
  return Math.max(0, FREE_CREDITS - used)
}

export function getPlanLabel(plan: PlanTier): string {
  return { free: "Free", premium: "Premium", elite: "Elite", team: "Team" }[plan]
}

/* ── Profile ── */
export function getProfile(): UserProfile | null {
  if (typeof window === "undefined") return null
  const s = localStorage.getItem("shntha_profile")
  return s ? JSON.parse(s) : null
}

export function saveProfile(p: UserProfile) {
  localStorage.setItem("shntha_profile", JSON.stringify(p))
}

/* ── Settings ── */
export function getSettings(): AppSettings {
  if (typeof window === "undefined") return defaultSettings()
  const s = localStorage.getItem("shntha_settings")
  return s ? JSON.parse(s) : defaultSettings()
}

export function saveSettings(s: AppSettings) {
  localStorage.setItem("shntha_settings", JSON.stringify(s))
}

/* ── CRM ── */
export function getCRM(): CRMClient[] {
  if (typeof window === "undefined") return []
  const s = localStorage.getItem("shntha_crm")
  return s ? JSON.parse(s) : []
}

export function saveCRM(clients: CRMClient[]) {
  localStorage.setItem("shntha_crm", JSON.stringify(clients))
}

/* ── Proposals Log ── */
export function getProposals(): string[] {
  if (typeof window === "undefined") return []
  const s = localStorage.getItem("shntha_proposals")
  return s ? JSON.parse(s) : []
}

export function saveProposals(list: string[]) {
  localStorage.setItem("shntha_proposals", JSON.stringify(list))
}

/* ── Tasks ── */
export interface TaskItem {
  id: string
  text: string
  done: boolean
  date: string
}
export function getTasks(): TaskItem[] {
  if (typeof window === "undefined") return []
  const s = localStorage.getItem("shntha_tasks")
  return s ? JSON.parse(s) : []
}
export function saveTasks(t: TaskItem[]) {
  localStorage.setItem("shntha_tasks", JSON.stringify(t))
}

/* ── Notes ── */
export interface NoteItem {
  id: string
  title: string
  body: string
  updated: string
}
export function getNotes(): NoteItem[] {
  if (typeof window === "undefined") return []
  const s = localStorage.getItem("shntha_notes")
  return s ? JSON.parse(s) : []
}
export function saveNotes(n: NoteItem[]) {
  localStorage.setItem("shntha_notes", JSON.stringify(n))
}

/* ── Invoices ── */
export interface InvoiceLineItem {
  desc: string
  qty: number
  rate: number
}
export interface Invoice {
  id: string
  client: string
  email: string
  date: string
  dueDate: string
  items: InvoiceLineItem[]
  notes: string
  status: "draft" | "sent" | "paid"
}
export function getInvoices(): Invoice[] {
  if (typeof window === "undefined") return []
  const s = localStorage.getItem("shntha_invoices")
  return s ? JSON.parse(s) : []
}
export function saveInvoices(inv: Invoice[]) {
  localStorage.setItem("shntha_invoices", JSON.stringify(inv))
}

/* ── Inbox Messages ── */
export interface InboxMessage {
  id: string
  from: string
  subject: string
  body: string
  date: string
  read: boolean
}
export function getInbox(): InboxMessage[] {
  if (typeof window === "undefined") return []
  const s = localStorage.getItem("shntha_inbox")
  return s ? JSON.parse(s) : []
}
export function saveInbox(m: InboxMessage[]) {
  localStorage.setItem("shntha_inbox", JSON.stringify(m))
}

/* ── Activity Log ── */
export function getActivity(): string[] {
  if (typeof window === "undefined") return []
  const s = localStorage.getItem("shntha_activity")
  return s ? JSON.parse(s) : []
}

export function logActivity(msg: string) {
  const log = getActivity()
  log.unshift(`${new Date().toLocaleDateString()} — ${msg}`)
  if (log.length > 50) log.length = 50
  localStorage.setItem("shntha_activity", JSON.stringify(log))
}

/* ── Toast Hook ── */
export function useToast() {
  const [toast, setToast] = useState<{ msg: string; visible: boolean }>({ msg: "", visible: false })
  const show = useCallback((msg: string) => {
    setToast({ msg, visible: true })
    setTimeout(() => setToast({ msg: "", visible: false }), 3000)
  }, [])
  return { toast, showToast: show }
}

export function ToastBar({ toast }: { toast: { msg: string; visible: boolean } }) {
  return (
    <div
      className={"fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-2xl text-sm text-white backdrop-blur-xl border border-white/10 transition-all duration-300 pointer-events-none " + (toast.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
      style={{ background: "rgba(20,20,20,.95)" }}
    >
      {toast.msg}
    </div>
  )
}

/* ── Free Local Generators ── */

const roles: Record<string, string[]> = {
  developer: ["Full-Stack Developer", "Frontend Developer", "Backend Developer", "Mobile Developer"],
  designer: ["UX/UI Designer", "Graphic Designer", "Product Designer", "Brand Designer"],
  writer: ["Content Writer", "Copywriter", "Technical Writer", "Ghostwriter"],
  marketing: ["SEO Specialist", "Social Media Manager", "Marketing Consultant", "Growth Hacker"],
  other: ["Consultant", "Virtual Assistant", "Project Manager", "Business Analyst"],
}

const regions = {
  "United States": { low: 80, high: 250, currency: "$" },
  "Canada": { low: 70, high: 220, currency: "C$" },
  "Western Europe": { low: 60, high: 200, currency: "€" },
  "Eastern Europe": { low: 30, high: 100, currency: "€" },
  "Australia": { low: 80, high: 230, currency: "A$" },
  "Southeast Asia": { low: 15, high: 60, currency: "$" },
  "India": { low: 10, high: 50, currency: "₹" },
  "Nepal": { low: 8, high: 40, currency: "$" },
  "Remote / Global": { low: 40, high: 150, currency: "$" },
}

const expMultiplier: Record<string, number> = {
  "Junior": 0.6,
  "Mid-Level": 1.0,
  "Senior": 1.6,
  "Principal/Expert": 2.2,
}

function findRoleCategory(role: string): string {
  const r = role.toLowerCase()
  for (const [cat, list] of Object.entries(roles)) {
    if (list.some(x => r.includes(x.split(" ")[0].toLowerCase())) || cat === r) return cat
  }
  return "other"
}

function getRegionData(region: string) {
  return (regions as any)[region] || { low: 40, high: 150, currency: "$" }
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generatePricingReport(inputs: {
  role: string; experience: string; region: string; budget: string; scope: string
}): string {
  const exp = inputs.experience || "Mid-Level"
  const region = inputs.region || "Global"
  const rd = getRegionData(region)
  const mult = expMultiplier[exp.split("(")[0]?.trim()] || 1.0
  const base = randomBetween(rd.low, rd.high)
  const rate = Math.round(base * mult / 5) * 5
  const projLow = rate * 40
  const projHigh = rate * 120
  const retainer = rate * 10

  const strategies = [
    "Anchor high — propose 20% above your target rate to create negotiation room",
    "Bundle scope phases to increase perceived value and justify premium pricing",
    "Offer tiered packages (Basic / Professional / Enterprise) to anchor mid-tier",
    "Use value-based pricing: tie cost to client ROI, not hours",
  ]
  const positions = [
    "Premium — position yourself as a top-tier specialist in your niche",
    "Competitive — align with market rates while emphasizing quality",
    "Value — slightly below market to build portfolio, with annual escalation clause",
  ]

  const cols = [
    "Executive Summary",
    "Recommended Hourly Rate",
    "Suggested Project Pricing",
    "Negotiation Strategy",
    "Market Positioning",
    "Regional Insights",
    "Value-Based Recommendations",
  ]

  const sections: Record<string, string> = {
    "Executive Summary": `Based on analysis of your profile as a ${inputs.role || "Freelancer"} with ${exp} experience in ${region}, SHNTHA recommends the following premium pricing structure tailored to maximize your earnings while maintaining competitive positioning.\n\nYour market segment shows strong demand for your skill set, with clients typically budgeting ${inputs.budget || "between $3,000–$15,000"} for projects of similar scope.`,
    "Recommended Hourly Rate": `${rd.currency}${rate}/hour\n\nThis rate places you in the ${rate > 150 ? "top-tier premium" : rate > 80 ? "competitive professional" : "growth-stage"} bracket for ${region}. At this rate, a standard 40-hour week yields approximately ${rd.currency}${(rate * 40).toLocaleString()}/week or ${rd.currency}${(rate * 160).toLocaleString()}/month.\n\n💡 Pro Tip: Consider offering weekly retainers at ${rd.currency}${retainer}/week for recurring clients — this provides predictable income while maintaining your premium positioning.`,
    "Suggested Project Pricing": `Based on your scope description and market analysis:\n\n▸ Basic Package (2-3 weeks): ${rd.currency}${projLow.toLocaleString()}\n▸ Standard Package (4-6 weeks): ${rd.currency}${Math.round((projLow + projHigh) / 2).toLocaleString()}\n▸ Premium Package (8-12 weeks): ${rd.currency}${projHigh.toLocaleString()}\n\nFor complex engagements, consider a phased approach with milestone payments:\n  Phase 1 (Discovery & Strategy): ${Math.round(projLow * 0.3).toLocaleString()}\n  Phase 2 (Execution): ${Math.round(projLow * 0.5).toLocaleString()}\n  Phase 3 (Delivery & Optimization): ${Math.round(projLow * 0.2).toLocaleString()}`,
    "Negotiation Strategy": `═══\n${strategies[Math.floor(Math.random() * strategies.length)]}\n\n═══\n\nKey negotiation tactics:\n\n1. Never quote first — ask for their budget range before proposing\n2. Frame your rate around value delivered, not time spent\n3. Offer payment terms (50% upfront, 25% midpoint, 25% delivery) to reduce risk\n4. Include a clear scope document to prevent scope creep\n5. For long-term clients, offer a 5% discount on quarterly retainers`,
    "Market Positioning": `═══\n${positions[Math.floor(Math.random() * positions.length)]}\n\n═══\n\nYour positioning strategy:\n\n• Update portfolio to emphasize high-value outcomes over tasks\n• Collect and display testimonials that mention ROI\n• Develop case studies showing $X return on $Y investment\n• Network in premium circles (industry conferences, exclusive communities)`,
    "Regional Insights": `═══ ${region} Market Analysis ═══\n\nAverage rates in ${region} for your role:\n  ▸ Entry-level: ${rd.currency}${rd.low}/hr\n  ▸ Mid-level: ${rd.currency}${Math.round((rd.low + rd.high) / 2)}/hr\n  ▸ Senior/Expert: ${rd.currency}${rd.high}/hr\n\n${region === "Remote / Global" ? "As a global freelancer, you can command rates from multiple markets. Consider targeting US/EU clients while living in a lower-cost region for maximum margin." : `The ${region} market shows ${rd.low > 60 ? "strong demand with premium pricing opportunities" : "growing demand with room for rate increases as you build reputation"}.`}\n\nDemand trend: ${["Growing rapidly (+35% YoY)", "Steady growth (+18% YoY)", "Stable market (+5% YoY)", "Emerging market (+50% YoY)"][Math.floor(Math.random() * 4)]}`,
    "Value-Based Recommendations": `═══\n\nBased on your inputs, here are actionable recommendations:\n\n1. ⚡ Increase your rate by ${randomBetween(10, 30)}% every 6 months with existing clients\n2. 📊 Create a portfolio that showcases ROI metrics, not just deliverables\n3. 🎯 Specialize in ${["AI/ML integrations", "enterprise SaaS", "e-commerce platforms", "fintech solutions", "healthtech applications"][Math.floor(Math.random() * 5)]} to command premium rates\n4. 🤝 Build referral partnerships with 3 complementary agencies\n5. 📝 Use SHNTHA proposals to consistently present premium positioning\n\nEstimated annual earning potential at current rate: ${rd.currency}${(rate * 160 * 11).toLocaleString()} (assuming 11 months of billable work)`,
  }

  let report = `═══════════════════════════════════════════\n  SHNTHA AI PRICING REPORT\n  Generated: ${new Date().toLocaleDateString()}\n═══════════════════════════════════════════\n\n`
  cols.forEach(col => {
    report += `\n${sections[col] || ""}\n`
  })
  report += `\n═══════════════════════════════════════════\n  Report generated by SHNTHA AI Engine\n  All rates are recommendations based on market data\n═══════════════════════════════════════════`
  return report
}

export function generateProposal(inputs: {
  client: string; project: string; tone: string; budget: string; timeline: string; details: string
}): string {
  const clientName = inputs.client || "Valued Client"
  const projName = inputs.project || "Digital Project"
  const tone = inputs.tone || "Professional"
  const budget = inputs.budget || "TBD"
  const timeline = inputs.timeline || "4 weeks"
  const details = inputs.details || "To be discussed during discovery."

  const toneStyles: Record<string, { greeting: string; closing: string; adj: string }> = {
    "Professional": { greeting: "Dear", closing: "Sincerely", adj: "strategic" },
    "Luxury / Premium": { greeting: "Dear", closing: "With anticipation", adj: "bespoke" },
    "Creative / Bold": { greeting: "Hey", closing: "Onward", adj: "visionary" },
    "Corporate": { greeting: "Dear", closing: "Best regards", adj: "comprehensive" },
    "Friendly / Casual": { greeting: "Hi", closing: "Cheers", adj: "exciting" },
  }
  const style = toneStyles[tone] || toneStyles["Professional"]

  const deliverables = [
    "Discovery & Research Phase — user analysis, market research, stakeholder interviews",
    "UX/UI Design — wireframes, prototypes, high-fidelity mockups, design system",
    "Development — responsive frontend, scalable backend, API integrations",
    "Quality Assurance — cross-browser testing, performance optimization, security audit",
    "Deployment & Launch — CI/CD setup, domain configuration, SSL certification",
    "Post-Launch Support — 30 days maintenance, bug fixes, documentation",
  ]

  const timelineBreakdown = [
    { phase: "Discovery & Research", weeks: Math.ceil(parseInt(timeline) * 0.2) || 1 },
    { phase: "Design Phase", weeks: Math.ceil(parseInt(timeline) * 0.25) || 1 },
    { phase: "Development", weeks: Math.ceil(parseInt(timeline) * 0.35) || 2 },
    { phase: "Testing & QA", weeks: Math.ceil(parseInt(timeline) * 0.15) || 1 },
    { phase: "Launch & Handover", weeks: Math.ceil(parseInt(timeline) * 0.05) || 1 },
  ]

  const budgetBreakdown = {
    discovery: Math.round(parseInt(budget.replace(/[^0-9]/g, "")) * 0.15) || 500,
    design: Math.round(parseInt(budget.replace(/[^0-9]/g, "")) * 0.25) || 1000,
    development: Math.round(parseInt(budget.replace(/[^0-9]/g, "")) * 0.4) || 2000,
    qa: Math.round(parseInt(budget.replace(/[^0-9]/g, "")) * 0.12) || 500,
    launch: Math.round(parseInt(budget.replace(/[^0-9]/g, "")) * 0.08) || 300,
  }
  const totalBudget = budgetBreakdown.discovery + budgetBreakdown.design + budgetBreakdown.development + budgetBreakdown.qa + budgetBreakdown.launch

  const proposal = `═══════════════════════════════════════════
  PREMIUM PROPOSAL
  Prepared for: ${clientName}
  Project: ${projName}
  Date: ${new Date().toLocaleDateString()}
═══════════════════════════════════════════

1. ═══ EXECUTIVE SUMMARY ═══

${style.greeting} ${clientName},

I am thrilled to present this proposal for ${projName}. After careful consideration of your needs and objectives, I've crafted a ${style.adj} approach designed to deliver exceptional results that exceed your expectations.

With extensive experience delivering similar high-impact projects, I am confident that my expertise, creative vision, and methodical execution will make this partnership a resounding success.

2. ═══ PROJECT UNDERSTANDING ═══

Based on our discussions and your requirements, here is my understanding of the project:

${details}

The key objectives are:
• Deliver a polished, production-ready solution that aligns with your brand vision
• Create an intuitive user experience that drives engagement and conversion
• Implement scalable architecture that grows with your business
• Ensure timely delivery with transparent communication throughout

3. ═══ SOLUTION & DELIVERABLES ═══

My approach encompasses the following phases:

${deliverables.map((d, i) => `  ${i + 1}. ${d}`).join("\n")}

Each deliverable includes two rounds of revisions to ensure complete satisfaction.

4. ═══ TIMELINE ═══

Total estimated timeline: ${timeline}

${timelineBreakdown.map(t => `  • ${t.phase}: ${t.weeks} week${t.weeks > 1 ? "s" : ""}`).join("\n")}

Milestone deliveries scheduled every two weeks for continuous feedback and alignment.

5. ═══ INVESTMENT ═══

Total Investment: $${totalBudget.toLocaleString()}

Payment Breakdown:
  • Discovery & Strategy:      $${budgetBreakdown.discovery.toLocaleString()}
  • Design Phase:              $${budgetBreakdown.design.toLocaleString()}
  • Development:               $${budgetBreakdown.development.toLocaleString()}
  • Testing & QA:              $${budgetBreakdown.qa.toLocaleString()}
  • Launch & Handover:         $${budgetBreakdown.launch.toLocaleString()}
  ─────────────────────────────────────
  Total:                       $${totalBudget.toLocaleString()}

Payment Terms: 50% upfront, 25% at midpoint, 25% upon delivery.

6. ═══ WHY CHOOSE ME ═══

• Proven track record delivering ${["15+ successful projects", "20+ satisfied clients", "10+ enterprise-grade solutions"][Math.floor(Math.random() * 3)]}
• Transparent communication with weekly progress reports
• Post-launch support included for 30 days
• Flexible collaboration — I adapt to your workflow and tools
• Long-term partnership focus — I invest in understanding your business

7. ═══ CALL TO ACTION ═══

I would love to discuss this proposal in more detail and answer any questions you may have. Please feel free to reach out at your earliest convenience.

${style.closing},

────────────────────
[Your Name]
[Your Title / SHNTHA]
${["email@example.com", "portfolio.example.com"][Math.floor(Math.random() * 2)]}

═══════════════════════════════════════════
  Generated by SHNTHA AI Proposal Engine
  Free Forever — No API Key Required
═══════════════════════════════════════════`

  return proposal
}

/* ── Copy ── */
export function copyText(text: string, showToast: (m: string) => void) {
  navigator.clipboard.writeText(text).then(() => showToast("Copied!")).catch(() => {
    const ta = document.createElement("textarea")
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand("copy")
    document.body.removeChild(ta)
    showToast("Copied!")
  })
}

/* ── Charts ── */
export function drawSparkline(
  canvas: HTMLCanvasElement | null,
  data: number[],
  color: string
) {
  if (!canvas) return
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  const dpr = window.devicePixelRatio || 1
  canvas.width = canvas.offsetWidth * dpr
  canvas.height = canvas.offsetHeight * dpr
  ctx.scale(dpr, dpr)
  const W = canvas.offsetWidth
  const H = canvas.offsetHeight
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - min) / range) * H * 0.8 - H * 0.1,
  }))
  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, color + "33")
  grad.addColorStop(1, color + "00")
  ctx.beginPath()
  ctx.moveTo(pts[0].x, pts[0].y)
  pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y))
  ctx.lineTo(W, H)
  ctx.lineTo(0, H)
  ctx.closePath()
  ctx.fillStyle = grad
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(pts[0].x, pts[0].y)
  pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y))
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.stroke()
  pts.forEach(p => {
    ctx.beginPath()
    ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  })
}

export function drawRevenueChart(canvas: HTMLCanvasElement | null) {
  if (!canvas) return
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  const dpr = window.devicePixelRatio || 1
  const W = canvas.offsetWidth || 600
  const H = 180
  canvas.width = W * dpr
  canvas.height = H * dpr
  ctx.scale(dpr, dpr)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]
  const data = [2400, 3800, 5200, 7100, 9400, 12200, 15800, 18420]
  const padL = 40,
    padB = 30,
    padR = 20,
    padT = 10
  const cW = W - padL - padR,
    cH = H - padT - padB
  ;[0, 5000, 10000, 15000, 20000].forEach(v => {
    const y = padT + cH - (v / 20000) * cH
    ctx.beginPath()
    ctx.moveTo(padL, y)
    ctx.lineTo(padL + cW, y)
    ctx.strokeStyle = "rgba(255,255,255,.06)"
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.fillStyle = "rgba(255,255,255,.3)"
    ctx.font = "9px Inter"
    ctx.fillText("$" + v / 1000 + "k", 2, y + 3)
  })
  const pts = data.map((v, i) => ({
    x: padL + (i / (data.length - 1)) * cW,
    y: padT + cH - (v / 20000) * cH,
  }))
  const grad = ctx.createLinearGradient(0, padT, 0, padT + cH)
  grad.addColorStop(0, "rgba(200,255,87,.25)")
  grad.addColorStop(1, "rgba(200,255,87,0)")
  ctx.beginPath()
  ctx.moveTo(pts[0].x, pts[0].y)
  pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y))
  ctx.lineTo(pts[pts.length - 1].x, padT + cH)
  ctx.lineTo(pts[0].x, padT + cH)
  ctx.closePath()
  ctx.fillStyle = grad
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(pts[0].x, pts[0].y)
  pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y))
  ctx.strokeStyle = "#c8ff57"
  ctx.lineWidth = 2.5
  ctx.stroke()
  ctx.fillStyle = "rgba(255,255,255,.4)"
  ctx.font = "10px Inter"
  ctx.textAlign = "center"
  months.forEach((m, i) => ctx.fillText(m, padL + (i / (months.length - 1)) * cW, H - 6))
  const last = pts[pts.length - 1]
  ctx.beginPath()
  ctx.arc(last.x, last.y, 5, 0, Math.PI * 2)
  ctx.fillStyle = "#c8ff57"
  ctx.fill()
  ctx.beginPath()
  ctx.arc(last.x, last.y, 9, 0, Math.PI * 2)
  ctx.strokeStyle = "rgba(200,255,87,.3)"
  ctx.lineWidth = 2
  ctx.stroke()
}

/* ── Stars background effect ── */
export function useStars(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext("2d")
    if (!ctx) return
    let W = (c.width = window.innerWidth)
    let H = (c.height = window.innerHeight)
    const resize = () => {
      W = c.width = window.innerWidth
      H = c.height = window.innerHeight
    }
    window.addEventListener("resize", resize)
    const stars = Array.from({ length: 240 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.2,
      d: Math.random() * 0.4 + 0.1,
      o: Math.random() * 0.7 + 0.3,
    }))
    let id: number
    const anim = () => {
      ctx.clearRect(0, 0, W, H)
      stars.forEach(s => {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${s.o})`
        ctx.fill()
        s.y += s.d
        if (s.y > H) {
          s.y = 0
          s.x = Math.random() * W
        }
      })
      id = requestAnimationFrame(anim)
    }
    anim()
    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(id)
    }
  }, [canvasRef])
}

/* ── Upgrade Banner ── */
export function UpgradeBanner() {
  const plan = getPlan()
  if (plan !== "free") return null
  const remaining = getRemainingCredits()
  if (remaining > 2) return null
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[998] w-[min(500px,94vw)] px-5 py-3 rounded-2xl text-sm backdrop-blur-xl border shadow-2xl text-center"
      style={{ background: "rgba(200,255,87,.12)", borderColor: "rgba(200,255,87,.3)" }}>
      <span className="text-white/90">{remaining === 0
        ? "You've used all 5 free generations. "
        : `Only ${remaining} free ${remaining === 1 ? "generation" : "generations"} remaining. `}</span>
      <a href="/auth" className="text-[#c8ff57] font-semibold hover:underline no-underline">Upgrade to Premium →</a>
    </div>
  )
}

/* ── Mouse Tracking Pointer ── */
export function MouseTracker() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const visibleRef = useRef(false)
  const targetRef = useRef({ x: -200, y: -200 })

  useEffect(() => {
    const ring = ringRef.current
    const dot = dotRef.current
    if (!ring || !dot) return

    const move = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY }
      if (!visibleRef.current) {
        visibleRef.current = true
        ring.style.opacity = "1"
        dot.style.opacity = "1"
      }
    }
    const leave = () => {
      visibleRef.current = false
      ring.style.opacity = "0"
      dot.style.opacity = "0"
    }

    window.addEventListener("mousemove", move)
    document.addEventListener("mouseleave", leave)

    let id: number
    const ringPos = { x: -200, y: -200 }
    const dotPos = { x: -200, y: -200 }

    const anim = () => {
      const t = targetRef.current
      ringPos.x += (t.x - ringPos.x) * 0.12
      ringPos.y += (t.y - ringPos.y) * 0.12
      dotPos.x += (t.x - dotPos.x) * 0.28
      dotPos.y += (t.y - dotPos.y) * 0.28
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`
      dot.style.transform = `translate(${dotPos.x}px, ${dotPos.y}px)`
      id = requestAnimationFrame(anim)
    }
    id = requestAnimationFrame(anim)

    return () => {
      window.removeEventListener("mousemove", move)
      document.removeEventListener("mouseleave", leave)
      cancelAnimationFrame(id)
    }
  }, [])

  return (
    <>
      <div ref={ringRef}
        className="fixed pointer-events-none z-[9997] transition-opacity duration-500"
        style={{
          width: 36, height: 36, marginLeft: -18, marginTop: -18, opacity: 0,
          borderRadius: "50%", border: "1.5px solid rgba(255,255,255,.5)",
          background: "rgba(255,255,255,.03)",
          boxShadow: "0 0 20px rgba(200,255,87,.08), inset 0 0 20px rgba(200,255,87,.03)",
          left: 0, top: 0, willChange: "transform",
        }}
      />
      <div ref={dotRef}
        className="fixed pointer-events-none z-[9998] transition-opacity duration-500"
        style={{
          width: 6, height: 6, marginLeft: -3, marginTop: -3, opacity: 0,
          borderRadius: "50%", background: "#fff",
          boxShadow: "0 0 8px rgba(200,255,87,.3)",
          left: 0, top: 0, willChange: "transform",
        }}
      />
    </>
  )
}

/* ── Usage Indicator ── */
export function UsageIndicator() {
  const [plan, setPlan] = useState<PlanTier>("free")
  const [remaining, setRemaining] = useState(5)
  useEffect(() => {
    setPlan(getPlan())
    setRemaining(getRemainingCredits())
  }, [])
  if (plan !== "free") return null
  return (
    <div className="mt-3 text-center">
      <span className="text-[11px] text-white/30">
        {remaining > 0 ? `${remaining} of ${FREE_CREDITS} free generations remaining` : "All free generations used"}
      </span>
      {remaining === 0 && (
        <a href="/auth" className="text-[11px] text-[#c8ff57] ml-2 no-underline hover:underline">Upgrade →</a>
      )}
    </div>
  )
}

/* ── Scroll-to-Top ── */
export function ScrollToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const handler = () => setShow(window.scrollY > 400)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])
  if (!show) return null
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 left-6 z-[999] w-11 h-11 rounded-full bg-[#c8ff57] text-black flex items-center justify-center shadow-lg hover:bg-[#d8ff70] transition-all hover:scale-105"
      aria-label="Scroll to top">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
    </button>
  )
}

/* ── Data Export / Import ── */
export function exportAllData(showToast: (m: string) => void) {
  const keys = ["shntha_user", "shntha_profile", "shntha_settings", "shntha_crm", "shntha_tasks", "shntha_notes", "shntha_invoices", "shntha_inbox", "shntha_activity", "shntha_proposals"]
  const data: Record<string, any> = {}
  keys.forEach(k => {
    const v = localStorage.getItem(k)
    if (v) data[k] = JSON.parse(v)
  })
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `shntha-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
  showToast("Data exported!")
}

export function importAllData(file: File, showToast: (m: string) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        Object.entries(data).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value))
        })
        showToast("Data imported! Reloading...")
        setTimeout(() => window.location.reload(), 1000)
        resolve()
      } catch { reject("Invalid file") }
    }
    reader.readAsText(file)
  })
}

/* ── Navbar component ── */
export function NavBar() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setUser(getAuthUser())
  }, [])

  useEffect(() => {
    if (!mounted) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible") }),
      { threshold: 0.12 }
    )
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [mounted])

  return (
    <nav
      className="fixed w-full top-0 z-[999] py-4 backdrop-blur-[28px] border-b border-white/[.06]"
      style={{ background: "rgba(0,0,0,.5)" }}
    >
      <div className="container flex items-center justify-between gap-5">
        <a
          href="/"
          className="text-3xl italic font-serif tracking-tight no-underline text-white"
        >
          SHNTHA<span className="text-[#c8ff57]">.</span>
        </a>
        <div className="hidden md:flex items-center gap-1.5 bg-white/[.04] border border-white/10 rounded-full px-3.5 py-2">
          <a href="/" className="text-[13.5px] text-white/60 px-2.5 py-1 rounded-full hover:text-white hover:bg-white/10 transition no-underline">Home</a>
          <a href="/dashboard" className="text-[13.5px] text-white/60 px-2.5 py-1 rounded-full hover:text-white hover:bg-white/10 transition no-underline">Dashboard</a>
          <a href="/pricing-ai" className="text-[13.5px] text-white/60 px-2.5 py-1 rounded-full hover:text-white hover:bg-white/10 transition no-underline">Pricing</a>
          <a href="/proposals" className="text-[13.5px] text-white/60 px-2.5 py-1 rounded-full hover:text-white hover:bg-white/10 transition no-underline">Proposals</a>
          <a href="/invoices" className="text-[13.5px] text-white/60 px-2.5 py-1 rounded-full hover:text-white hover:bg-white/10 transition no-underline">Invoices</a>
          <a href="/crm" className="text-[13.5px] text-white/60 px-2.5 py-1 rounded-full hover:text-white hover:bg-white/10 transition no-underline">CRM</a>
          <a href="/analytics" className="text-[13.5px] text-white/60 px-2.5 py-1 rounded-full hover:text-white hover:bg-white/10 transition no-underline">Analytics</a>
        </div>
        <div className="flex items-center gap-2.5">
          {user ? (
            <>
              <a href="/profile" className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/10 text-white text-sm font-semibold no-underline hover:bg-white/15 transition">
                <div className="w-6 h-6 rounded-full bg-[#c8ff57] flex items-center justify-center text-black text-[11px] font-bold">{user.name.charAt(0).toUpperCase()}</div>
                {user.name.split(" ")[0]}
              </a>
              <a href="/settings" className="px-3 py-2 rounded-full border border-white/10 text-white/60 text-xs hover:text-white hover:bg-white/10 transition no-underline">Settings</a>
            </>
          ) : (
            <>
              <a href="/auth" className="hidden sm:inline-flex px-5 py-2.5 rounded-full border border-white/15 bg-white/10 text-white text-sm font-semibold no-underline hover:bg-white/15 transition">Sign In</a>
              <a href="/auth" className="hidden sm:inline-flex px-5 py-2.5 rounded-full bg-[#c8ff57] text-black text-sm font-semibold no-underline hover:bg-[#d8ff70] transition">Get Started</a>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

/* ── Footer ── */
export function SiteFooter() {
  return (
    <footer className="py-16 border-t border-white/[.06]">
      <div className="container flex items-center justify-between flex-wrap gap-5">
        <div className="text-2xl italic font-serif tracking-tight text-white">
          SHNTHA<span className="text-[#c8ff57]">.</span>
        </div>
        <p className="text-sm text-white/60">© 2026 SHNTHA — AI Freelancer Operating System</p>
        <div className="flex gap-5">
          <a href="/" className="text-sm text-white/60 no-underline hover:text-white transition">Home</a>
          <a href="/dashboard" className="text-sm text-white/60 no-underline hover:text-white transition">Dashboard</a>
          <a href="/invoices" className="text-sm text-white/60 no-underline hover:text-white transition">Invoices</a>
          <a href="/notes" className="text-sm text-white/60 no-underline hover:text-white transition">Notes</a>
        </div>
      </div>
    </footer>
  )
}
