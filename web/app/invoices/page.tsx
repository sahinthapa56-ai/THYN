"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Printer, Trash2, Eye, FileText } from "lucide-react"
import { NavBar, SiteFooter, useStars, useToast, ToastBar, getInvoices, saveInvoices, getCRM, logActivity, canUse, useCredit, UsageIndicator } from "@/lib/shared"
import type { Invoice, InvoiceLineItem } from "@/lib/shared"

const emptyItem: InvoiceLineItem = { desc: "", qty: 1, rate: 0 }

function calcTotal(items: InvoiceLineItem[]) {
  return items.reduce((s, i) => s + i.qty * i.rate, 0)
}

export default function InvoicesPage() {
  const starsRef = useRef<HTMLCanvasElement>(null)
  const { toast, showToast } = useToast()
  useStars(starsRef)

  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [editing, setEditing] = useState<Invoice | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [client, setClient] = useState("")
  const [email, setEmail] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [items, setItems] = useState<InvoiceLineItem[]>([{ ...emptyItem }])
  const [notes, setNotes] = useState("")
  const [preview, setPreview] = useState<Invoice | null>(null)

  useEffect(() => { setInvoices(getInvoices()) }, [])

  const addItem = () => setItems([...items, { ...emptyItem }])
  const updateItem = (i: number, f: Partial<InvoiceLineItem>) => {
    const c = [...items]; c[i] = { ...c[i], ...f }; setItems(c)
  }
  const removeItem = (i: number) => { if (items.length > 1) setItems(items.filter((_, idx) => idx !== i)) }

  const resetForm = () => {
    setClient(""); setEmail(""); setDueDate(""); setItems([{ ...emptyItem }]); setNotes(""); setEditing(null)
  }

  const saveInvoice = () => {
    if (!client.trim()) { showToast("Enter client name"); return }
    if (!editing && !canUse()) { showToast("You've used all 5 free generations. Upgrade to continue."); return }
    const inv: Invoice = {
      id: editing?.id || Date.now().toString(),
      client: client.trim(),
      email,
      date: editing?.date || new Date().toLocaleDateString(),
      dueDate,
      items: items.filter(i => i.desc.trim()),
      notes,
      status: editing?.status || "draft",
    }
    if (!inv.items.length) { showToast("Add at least one line item"); return }
    let updated: Invoice[]
    if (editing) {
      updated = invoices.map(i => i.id === editing.id ? inv : i)
    } else {
      updated = [inv, ...invoices]
      useCredit()
    }
    setInvoices(updated)
    saveInvoices(updated)
    logActivity(editing ? `Updated invoice for ${inv.client}` : `Created invoice for ${inv.client}`)
    showToast(editing ? "Invoice updated!" : "Invoice created!")
    resetForm()
    setShowForm(false)
  }

  const deleteInvoice = (id: string) => {
    const updated = invoices.filter(i => i.id !== id)
    setInvoices(updated)
    saveInvoices(updated)
    showToast("Invoice deleted")
  }

  const markPaid = (id: string) => {
    const updated = invoices.map(i => i.id === id ? { ...i, status: "paid" as const } : i)
    setInvoices(updated)
    saveInvoices(updated)
    showToast("Marked as paid")
  }

  const statusColor = (s: string) =>
    s === "paid" ? "text-[#7dff9f] bg-[#7dff9f]/10" : s === "sent" ? "text-[#57c8ff] bg-[#57c8ff]/10" : "text-white/40 bg-white/5"

  return (
    <>
      <div className="fixed inset-0 opacity-[0.035] pointer-events-none z-[-1]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <ToastBar toast={toast} />
      <NavBar />

      <section className="pt-32 pb-20">
        <div className="container max-w-5xl">
          <div className="flex items-center justify-between mb-8 reveal">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
              <p className="text-sm text-white/60 mt-0.5">Create, send, and track invoices</p>
            </div>
            <button onClick={() => { resetForm(); setShowForm(true) }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c8ff57] text-black text-sm font-semibold hover:bg-[#d8ff70] transition">
              <Plus size={14} />New Invoice
            </button>
          </div>

          {/* Invoice Form */}
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-[22px] p-6 mb-6" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)" }}>
              <h2 className="text-lg font-semibold mb-4">{editing ? "Edit Invoice" : "New Invoice"}</h2>
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="form-label">Client Name</label>
                  <input value={client} onChange={e => setClient(e.target.value)} placeholder="Client name"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25" />
                </div>
                <div>
                  <label className="form-label">Client Email</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder="client@email.com"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25" />
                </div>
                <div>
                  <label className="form-label">Due Date</label>
                  <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25" />
                </div>
              </div>

              <label className="form-label">Line Items</label>
              <div className="space-y-2 mb-4">
                {items.map((item, i) => (
                  <div key={i} className="flex gap-2 items-end">
                    <input placeholder="Description" value={item.desc} onChange={e => updateItem(i, { desc: e.target.value })}
                      className="flex-[3] bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25" />
                    <input type="number" placeholder="Qty" value={item.qty} onChange={e => updateItem(i, { qty: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="w-16 bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-white/25 text-center" />
                    <input type="number" placeholder="Rate" value={item.rate} onChange={e => updateItem(i, { rate: parseInt(e.target.value) || 0 })}
                      className="w-24 bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-white/25 text-center" />
                    <div className="text-sm text-white/60 w-20 text-right py-3">${(item.qty * item.rate).toLocaleString()}</div>
                    <button onClick={() => removeItem(i)} className="p-3 text-red-400 hover:bg-red-500/20 rounded-xl transition"><Trash2 size={14} /></button>
                  </div>
                ))}
                <button onClick={addItem} className="text-xs text-[#c8ff57] hover:underline">+ Add line item</button>
              </div>

              <div className="text-right text-lg font-semibold mb-4">Total: ${calcTotal(items).toLocaleString()}</div>

              <div className="mb-4">
                <label className="form-label">Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Payment terms, thank you note..."
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25" />
              </div>

              <div className="flex gap-3 justify-end">
                <button onClick={() => { resetForm(); setShowForm(false) }} className="px-5 py-2.5 rounded-xl bg-white/10 text-white/60 text-sm hover:bg-white/15 transition">Cancel</button>
                <button onClick={saveInvoice} className="px-5 py-2.5 rounded-xl bg-[#c8ff57] text-black text-sm font-semibold hover:bg-[#d8ff70] transition">
                  {editing ? "Update Invoice" : "Create Invoice"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Invoice List */}
          <div className="space-y-3 reveal">
            {invoices.length === 0 && !showForm ? (
              <div className="text-center py-16 text-sm text-white/30">
                <FileText size={40} className="mx-auto mb-3 opacity-30" />
                No invoices yet. Create your first invoice to get started.
              </div>
            ) : invoices.map((inv, i) => (
              <motion.div key={inv.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-[22px] p-5" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)" }}>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#c8ff57]/10 flex items-center justify-center">
                      <FileText size={18} className="text-[#c8ff57]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{inv.client}</div>
                      <div className="text-xs text-white/60">{inv.date} {inv.dueDate ? `· Due: ${inv.dueDate}` : ""}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">${calcTotal(inv.items).toLocaleString()}</span>
                    <span className={"px-2.5 py-1 rounded-full text-[11px] font-semibold " + statusColor(inv.status)}>{inv.status}</span>
                    <button onClick={() => { setPreview(inv) }} className="p-2 rounded-xl hover:bg-white/10 transition"><Eye size={14} className="text-white/60" /></button>
                    {inv.status !== "paid" && (
                      <button onClick={() => markPaid(inv.id)} className="px-3 py-1.5 rounded-lg bg-[#7dff9f]/10 text-[#7dff9f] text-[11px] font-semibold hover:bg-[#7dff9f]/20 transition">Mark Paid</button>
                    )}
                    <button onClick={() => deleteInvoice(inv.id)} className="p-2 rounded-xl text-red-400 hover:bg-red-500/20 transition"><Trash2 size={14} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setPreview(null)}>
          <div className="w-full max-w-[700px] rounded-[28px] p-8 max-h-[90vh] overflow-y-auto" style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,.15)" }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif italic">INVOICE</h2>
              <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-sm hover:bg-white/15 transition">
                <Printer size={14} />Print / PDF
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
              <div><div className="text-white/40 text-xs">Bill To</div><div className="font-semibold">{preview.client}</div><div className="text-white/60">{preview.email}</div></div>
              <div className="text-right"><div className="text-white/40 text-xs">Invoice Date</div><div>{preview.date}</div>{preview.dueDate && <><div className="text-white/40 text-xs mt-1">Due Date</div><div>{preview.dueDate}</div></>}</div>
            </div>
            <table className="w-full border-collapse mb-6">
              <thead><tr><th className="text-left py-2 text-xs text-white/40 uppercase border-b border-white/10">Description</th><th className="text-right py-2 text-xs text-white/40 uppercase border-b border-white/10">Qty</th><th className="text-right py-2 text-xs text-white/40 uppercase border-b border-white/10">Rate</th><th className="text-right py-2 text-xs text-white/40 uppercase border-b border-white/10">Amount</th></tr></thead>
              <tbody>
                {preview.items.map((item, i) => (
                  <tr key={i}><td className="py-2.5 text-sm border-b border-white/5">{item.desc}</td><td className="py-2.5 text-sm text-right border-b border-white/5">{item.qty}</td><td className="py-2.5 text-sm text-right border-b border-white/5">${item.rate.toLocaleString()}</td><td className="py-2.5 text-sm text-right font-semibold border-b border-white/5">${(item.qty * item.rate).toLocaleString()}</td></tr>
                ))}
              </tbody>
              <tfoot><tr><td colSpan={3} className="py-3 text-sm text-right font-semibold">Total:</td><td className="py-3 text-sm text-right font-bold text-[#c8ff57]">${calcTotal(preview.items).toLocaleString()}</td></tr></tfoot>
            </table>
            {preview.notes && <div className="text-xs text-white/40 border-t border-white/10 pt-4">{preview.notes}</div>}
            <button onClick={() => setPreview(null)} className="mt-6 w-full py-3 rounded-xl bg-white/10 text-sm hover:bg-white/15 transition">Close</button>
          </div>
        </div>
      )}

      <SiteFooter />
    </>
  )
}
