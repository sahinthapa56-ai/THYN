"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Edit3, Trash2, Save, ArrowLeft } from "lucide-react"
import { NavBar, SiteFooter, useStars, useToast, ToastBar, getNotes, saveNotes, logActivity } from "@/lib/shared"
import type { NoteItem } from "@/lib/shared"

export default function NotesPage() {
  const starsRef = useRef<HTMLCanvasElement>(null)
  const { toast, showToast } = useToast()
  useStars(starsRef)

  const [notes, setNotes] = useState<NoteItem[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

  useEffect(() => {
    setNotes(getNotes())
  }, [])

  const activeNote = notes.find(n => n.id === active)

  const create = () => {
    const n: NoteItem = { id: Date.now().toString(), title: "Untitled Note", body: "", updated: new Date().toLocaleString() }
    const updated = [n, ...notes]
    setNotes(updated)
    saveNotes(updated)
    setActive(n.id)
    setTitle(n.title)
    setBody(n.body)
    logActivity("Created new note")
    showToast("Note created")
  }

  const save = () => {
    if (!active) return
    const updated = notes.map(n => n.id === active ? { ...n, title, body, updated: new Date().toLocaleString() } : n)
    setNotes(updated)
    saveNotes(updated)
    logActivity("Saved note: " + title)
    showToast("Note saved!")
  }

  const remove = (id: string) => {
    const updated = notes.filter(n => n.id !== id)
    setNotes(updated)
    saveNotes(updated)
    if (active === id) { setActive(null); setTitle(""); setBody("") }
    showToast("Note deleted")
  }

  return (
    <>
      <div className="fixed inset-0 opacity-[0.035] pointer-events-none z-[-1]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <ToastBar toast={toast} />
      <NavBar />

      <section className="pt-32 pb-20">
        <div className="container max-w-5xl">
          <div className="flex items-center justify-between mb-8 reveal">
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="p-2 rounded-xl hover:bg-white/10 transition-all"><ArrowLeft size={18} /></a>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Notes</h1>
                <p className="text-sm text-white/60 mt-0.5">Scratchpad for ideas, meeting notes, and quick captures</p>
              </div>
            </div>
            <button onClick={create} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c8ff57] text-black text-sm font-semibold hover:bg-[#d8ff70] transition">
              <Plus size={14} />New Note
            </button>
          </div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-5 reveal">
            <div className="rounded-[22px] p-4" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)" }}>
              <div className="space-y-1 max-h-[500px] overflow-y-auto">
                {notes.length === 0 ? (
                  <div className="text-xs text-white/30 text-center py-8">No notes yet. Create your first note.</div>
                ) : notes.map(n => (
                  <div key={n.id} onClick={() => { setActive(n.id); setTitle(n.title); setBody(n.body) }}
                    className={"px-3.5 py-3 rounded-xl cursor-pointer transition group " + (active === n.id ? "bg-white/10" : "hover:bg-white/[.04]")}>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium truncate flex-1">{n.title}</div>
                      <button onClick={e => { e.stopPropagation(); remove(n.id) }} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-500/20 rounded transition-all">
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div className="text-[11px] text-white/40 mt-0.5">{n.updated}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[22px] p-6" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)" }}>
              {activeNote ? (
                <div>
                  <input value={title} onChange={e => setTitle(e.target.value)}
                    className="w-full bg-transparent text-xl font-semibold text-white outline-none border-none mb-3" />
                  <div className="text-[11px] text-white/40 mb-4">Last updated: {activeNote.updated}</div>
                  <textarea value={body} onChange={e => setBody(e.target.value)} rows={18}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25 resize-y" />
                  <div className="flex justify-end mt-3">
                    <button onClick={save} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c8ff57] text-black text-sm font-semibold hover:bg-[#d8ff70] transition">
                      <Save size={14} />Save Note
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[400px] text-sm text-white/20">Select a note or create a new one</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
