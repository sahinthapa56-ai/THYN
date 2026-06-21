"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Bell, Shield, Palette, Globe, CreditCard, Users, Monitor, Moon, Sun, Download, Upload } from "lucide-react"
import { NavBar, SiteFooter, useToast, ToastBar, getSettings, saveSettings, getAuthUser, exportAllData, importAllData } from "@/lib/shared"
import type { AppSettings, AuthUser } from "@/lib/shared"

export default function SettingsPage() {
  const { toast, showToast } = useToast()
  const [settings, setSettings] = useState<AppSettings>(getSettings)
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    setUser(getAuthUser())
    setSettings(getSettings())
  }, [])

  const toggle = (key: keyof AppSettings) => {
    const updated = { ...settings, [key]: !settings[key] }
    setSettings(updated)
    saveSettings(updated)
    showToast("Setting updated")
  }

  const sections = [
    {
      icon: Palette,
      title: "Appearance",
      items: [
        {
          label: "Theme",
          desc: settings.theme === "dark" ? "Dark mode active" : settings.theme === "light" ? "Light mode active" : "System preference",
          type: "custom" as const,
          render: () => (
            <div className="flex gap-2">
              {[
                { value: "dark", icon: Moon, label: "Dark" },
                { value: "light", icon: Sun, label: "Light" },
                { value: "system", icon: Monitor, label: "System" },
              ].map(t => (
                <button key={t.value} onClick={() => { const u = { ...settings, theme: t.value }; setSettings(u); saveSettings(u); showToast(`Theme: ${t.label}`) }}
                  className={"flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition " + (settings.theme === t.value ? "bg-[#c8ff57] text-black" : "bg-white/10 text-white/60 hover:bg-white/15")}>
                  <t.icon size={14} />{t.label}
                </button>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      icon: Bell,
      title: "Notifications",
      items: [
        { label: "Daily Digest", desc: "Get a daily summary of your activity", type: "toggle" as const, key: "dailyDigest" as keyof AppSettings },
        { label: "Task Reminders", desc: "Get reminded about pending tasks", type: "toggle" as const, key: "taskReminders" as keyof AppSettings },
      ],
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      items: [
        { label: "Redact Sensitive Data", desc: "Auto-redact emails, phone numbers, and tokens", type: "toggle" as const, key: "redactSensitive" as keyof AppSettings },
        { label: "Local-First Mode", desc: "Keep data local by default", type: "toggle" as const, key: "localFirst" as keyof AppSettings },
      ],
    },
    {
      icon: Globe,
      title: "AI Preferences",
      items: [
        { label: "Default Model", desc: settings.defaultModel, type: "link" as const, onClick: () => {
          const models = ["gpt-4", "gpt-3.5-turbo", "claude-sonnet", "local-ai"]
          const idx = models.indexOf(settings.defaultModel)
          const next = models[(idx + 1) % models.length]
          const u = { ...settings, defaultModel: next }
          setSettings(u)
          saveSettings(u)
          showToast(`Model: ${next}`)
        }},
        { label: "Summary Length", desc: settings.summaryLength, type: "link" as const, onClick: () => {
          const lengths = ["short", "medium", "detailed"]
          const idx = lengths.indexOf(settings.summaryLength)
          const next = lengths[(idx + 1) % lengths.length]
          const u = { ...settings, summaryLength: next }
          setSettings(u)
          saveSettings(u)
          showToast(`Summary: ${next}`)
        }},
      ],
    },
    {
      icon: CreditCard,
      title: "Billing",
      items: [
        { label: "Current Plan", desc: "Free Forever — unlimited features", type: "link" as const },
        { label: "Usage", desc: "No limits on this plan", type: "link" as const },
      ],
    },
    {
      icon: Users,
      title: "Account",
      items: [
        { label: "Signed in as", desc: user?.email || "Not signed in", type: "link" as const },
        { label: "Manage Profile", desc: "Edit your name, bio, and skills", type: "link" as const, onClick: () => { window.location.href = "/profile" }},
      ],
    },
    {
      icon: Download,
      title: "Data",
      items: [
        { label: "Export All Data", desc: "Download your data as JSON backup", type: "custom" as const, render: () => (
          <button onClick={() => exportAllData(showToast)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold hover:bg-white/15 transition">
            <Download size={14} />Export
          </button>
        )},
        { label: "Import Data", desc: "Restore from a previous backup", type: "custom" as const, render: () => (
          <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold hover:bg-white/15 transition cursor-pointer">
            <Upload size={14} />Import
            <input type="file" accept=".json" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (f) { try { await importAllData(f, showToast) } catch { showToast("Invalid file") } } }} />
          </label>
        )},
      ],
    },
  ]

  return (
    <>
      <div className="fixed inset-0 opacity-[0.035] pointer-events-none z-[-1]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <ToastBar toast={toast} />
      <NavBar />

      <section className="pt-32 pb-20">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
            <a href="/dashboard" className="p-2 rounded-xl hover:bg-white/10 transition-all">
              <ArrowLeft size={18} />
            </a>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
              <p className="text-sm text-white/60 mt-0.5">Manage your SHNTHA workspace preferences</p>
            </div>
          </motion.div>

          <div className="space-y-4">
            {sections.map((section) => (
              <motion.div key={section.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-[28px] p-6" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)" }}>
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/[.07]">
                  <section.icon size={18} className="text-[#c8ff57]" />
                  <h2 className="text-sm font-semibold">{section.title}</h2>
                </div>
                <div className="space-y-4">
                  {section.items.map((item: any) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-white/60 mt-0.5">{item.desc}</p>
                      </div>
                      {item.type === "toggle" && (
                        <div onClick={() => toggle(item.key)} className={"w-10 h-5 rounded-full relative cursor-pointer transition-colors " + ((settings as any)[item.key] ? "bg-[#c8ff57]" : "bg-white/20")}>
                          <div className={"w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all " + ((settings as any)[item.key] ? "right-0.5" : "left-0.5")} />
                        </div>
                      )}
                      {item.type === "link" && (
                        <button onClick={item.onClick} className="text-xs text-white/60 hover:text-white transition-colors">
                          Configure
                        </button>
                      )}
                      {item.type === "custom" && item.render()}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
