"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mail, MailOpen, Trash2, Send, ArrowLeft } from "lucide-react"
import { NavBar, SiteFooter, useStars, useToast, ToastBar, getInbox, saveInbox, logActivity } from "@/lib/shared"
import type { InboxMessage } from "@/lib/shared"

export default function InboxPage() {
  const starsRef = useRef<HTMLCanvasElement>(null)
  const { toast, showToast } = useToast()
  useStars(starsRef)

  const [messages, setMessages] = useState<InboxMessage[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [showCompose, setShowCompose] = useState(false)
  const [compose, setCompose] = useState({ to: "", subject: "", body: "" })

  useEffect(() => {
    const existing = getInbox()
    if (existing.length === 0) {
      const seed: InboxMessage[] = [
        { id: "1", from: "Nova Labs", subject: "Proposal Feedback — AI Platform Project", body: "Hi there,\n\nWe reviewed your proposal for the AI Platform project and we're impressed! Could we schedule a call next week to discuss next steps?\n\nBest,\nSarah Chen\nNova Labs", date: "2 hours ago", read: false },
        { id: "2", from: "Orbit Studio", subject: "Contract Signing — Redesign Project", body: "Hello,\n\nWe're ready to move forward with the redesign project. Please find the signed contract attached. Let's kick off next Monday!\n\nCheers,\nMike\nOrbit Studio", date: "1 day ago", read: false },
        { id: "3", from: "Zenith Agency", subject: "Invoice #0042 — Payment Confirmation", body: "Hi,\n\nJust confirming that payment for invoice #0042 has been processed. Thank you for the excellent work on the SEO campaign!\n\nRegards,\nJames\nZenith Agency", date: "3 days ago", read: true },
        { id: "4", from: "Peak Brands", subject: "New Project Inquiry — Brand Refresh", body: "Hello,\n\nWe came across your profile and would love to discuss a brand refresh project. Are you available for a discovery call this week?\n\nBest,\nAmanda\nPeak Brands", date: "5 days ago", read: true },
      ]
      saveInbox(seed)
      setMessages(seed)
    } else {
      setMessages(existing)
    }
  }, [])

  const markRead = (id: string) => {
    const updated = messages.map(m => m.id === id ? { ...m, read: true } : m)
    setMessages(updated)
    saveInbox(updated)
  }

  const deleteMessage = (id: string) => {
    const updated = messages.filter(m => m.id !== id)
    setMessages(updated)
    saveInbox(updated)
    if (selected === id) setSelected(null)
    showToast("Message deleted")
  }

  const sendMessage = () => {
    if (!compose.to.trim() || !compose.subject.trim()) { showToast("Fill in recipient and subject"); return }
    const msg: InboxMessage = {
      id: Date.now().toString(),
      from: compose.to.trim(),
      subject: compose.subject.trim(),
      body: compose.body.trim() || "(No message body)",
      date: "Just now",
      read: false,
    }
    const updated = [msg, ...messages]
    setMessages(updated)
    saveInbox(updated)
    logActivity(`Sent message to ${compose.to}`)
    setCompose({ to: "", subject: "", body: "" })
    setShowCompose(false)
    showToast("Message sent!")
  }

  const unread = messages.filter(m => !m.read).length

  return (
    <>
      <div className="fixed inset-0 opacity-[0.035] pointer-events-none z-[-1]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <ToastBar toast={toast} />
      <NavBar />

      <section className="pt-32 pb-20">
        <div className="container max-w-4xl">
          <div className="flex items-center justify-between mb-8 reveal">
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="p-2 rounded-xl hover:bg-white/10 transition-all"><ArrowLeft size={18} /></a>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Inbox</h1>
                <p className="text-sm text-white/60 mt-0.5">{unread > 0 ? `${unread} unread messages` : "All caught up!"}</p>
              </div>
            </div>
            <button onClick={() => setShowCompose(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c8ff57] text-black text-sm font-semibold hover:bg-[#d8ff70] transition">
              <Send size={14} />Compose
            </button>
          </div>

          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-5 reveal">
            {/* Message List */}
            <div className="rounded-[22px] p-3" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)" }}>
              <div className="space-y-1 max-h-[600px] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-xs text-white/30 text-center py-12">No messages yet</div>
                ) : messages.map(m => (
                  <div key={m.id} onClick={() => { setSelected(m.id); markRead(m.id) }}
                    className={"px-3.5 py-3 rounded-xl cursor-pointer transition group " + (selected === m.id ? "bg-white/10" : "hover:bg-white/[.04]")}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {m.read ? <MailOpen size={14} className="text-white/30" /> : <Mail size={14} className="text-[#c8ff57]" />}
                        <span className={"text-sm " + (m.read ? "text-white/60" : "text-white font-semibold")}>{m.from}</span>
                      </div>
                      <button onClick={e => { e.stopPropagation(); deleteMessage(m.id) }} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-500/20 rounded transition-all">
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div className={"text-xs mt-0.5 truncate pl-6 " + (m.read ? "text-white/40" : "text-white/70")}>{m.subject}</div>
                    <div className="text-[10px] text-white/30 pl-6 mt-0.5">{m.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Detail */}
            <div className="rounded-[22px] p-6 min-h-[400px]" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)" }}>
              {selected ? (() => {
                const m = messages.find(x => x.id === selected)
                if (!m) return <div className="text-sm text-white/20 text-center py-16">Select a message</div>
                return (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-semibold">{m.subject}</h3>
                      <span className="text-xs text-white/40">{m.date}</span>
                    </div>
                    <div className="text-sm text-[#c8ff57] mb-4">From: {m.from}</div>
                    <div className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">{m.body}</div>
                  </div>
                )
              })() : (
                <div className="flex items-center justify-center h-full text-sm text-white/20">Select a message to read</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowCompose(false)}>
          <div className="w-full max-w-lg rounded-[28px] p-6" style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,.15)" }}
            onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">New Message</h2>
            <input placeholder="To (name)" value={compose.to} onChange={e => setCompose(p => ({ ...p, to: e.target.value }))}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25 mb-3" />
            <input placeholder="Subject" value={compose.subject} onChange={e => setCompose(p => ({ ...p, subject: e.target.value }))}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25 mb-3" />
            <textarea placeholder="Message" value={compose.body} onChange={e => setCompose(p => ({ ...p, body: e.target.value }))} rows={6}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25 resize-y mb-4" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowCompose(false)} className="px-5 py-2.5 rounded-xl bg-white/10 text-white/60 text-sm hover:bg-white/15 transition">Cancel</button>
              <button onClick={sendMessage} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c8ff57] text-black text-sm font-semibold hover:bg-[#d8ff70] transition">
                <Send size={14} />Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </>
  )
}
