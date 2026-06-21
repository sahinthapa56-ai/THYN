"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Save, Plus, X, Globe, Twitter, Linkedin, Github } from "lucide-react"
import { NavBar, SiteFooter, useStars, useToast, ToastBar, getAuthUser, getProfile, saveProfile, logActivity } from "@/lib/shared"
import type { AuthUser, UserProfile } from "@/lib/shared"

const skillOptions = [
  "Web Development", "UI/UX Design", "API Integration", "Mobile Development",
  "Data Science", "Machine Learning", "Cloud Architecture", "DevOps",
  "Graphic Design", "Content Writing", "SEO", "Digital Marketing",
  "Brand Strategy", "Product Management", "Consulting", "Video Production",
]

export default function ProfilePage() {
  const starsRef = useRef<HTMLCanvasElement>(null)
  const { toast, showToast } = useToast()
  useStars(starsRef)

  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [newSkill, setNewSkill] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const u = getAuthUser()
    setUser(u)
    setProfile(getProfile())
  }, [])

  const updateField = (field: keyof UserProfile, value: any) => {
    if (!profile) return
    setProfile({ ...profile, [field]: value })
  }

  const updateSocial = (platform: keyof UserProfile["social"], value: string) => {
    if (!profile) return
    setProfile({ ...profile, social: { ...profile.social, [platform]: value } })
  }

  const addSkill = () => {
    if (!profile || !newSkill.trim() || profile.skills.includes(newSkill.trim())) return
    setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] })
    setNewSkill("")
  }

  const removeSkill = (skill: string) => {
    if (!profile) return
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) })
  }

  const handleSave = () => {
    if (!profile) return
    setSaving(true)
    saveProfile(profile)
    logActivity("Updated profile information")
    showToast("Profile saved!")
    setTimeout(() => setSaving(false), 500)
  }

  if (!user || !profile) {
    return (
      <>
        <div className="fixed inset-0 opacity-[0.035] pointer-events-none z-[-1]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        <NavBar />
        <section className="pt-32 pb-20">
          <div className="container text-center">
            <h2 className="title">Sign In Required</h2>
            <p className="subtitle">Create an account or sign in to view and edit your profile.</p>
            <a href="/auth" className="btn btn-primary">Get Started →</a>
          </div>
        </section>
        <SiteFooter />
      </>
    )
  }

  return (
    <>
      <div className="fixed inset-0 opacity-[0.035] pointer-events-none z-[-1]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <canvas ref={starsRef} className="fixed inset-0 z-[-2]" />
      <ToastBar toast={toast} />
      <NavBar />

      <section className="pt-32 pb-20">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="p-2 rounded-xl hover:bg-white/10 transition-all">
                <ArrowLeft size={18} />
              </a>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Your Profile</h1>
                <p className="text-sm text-white/60 mt-0.5">Manage your personal information and public presence</p>
              </div>
            </div>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c8ff57] text-black text-sm font-semibold hover:bg-[#d8ff70] transition disabled:opacity-50">
              <Save size={14} />{saving ? "Saved!" : "Save Profile"}
            </button>
          </motion.div>

          {/* Avatar & Basic Info */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-[28px] p-8 mb-5" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)" }}>
            <div className="flex items-start gap-6 flex-wrap">
              <div className="w-20 h-20 rounded-full bg-[#c8ff57] flex items-center justify-center text-black text-3xl font-bold flex-shrink-0">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Full Name</label>
                    <input value={profile.name} onChange={e => updateField("name", e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25" />
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input value={profile.email} onChange={e => updateField("email", e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-label">Professional Title</label>
                    <input value={profile.title} onChange={e => updateField("title", e.target.value)} placeholder="e.g. Senior Full-Stack Developer"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-label">Bio</label>
                    <textarea value={profile.bio} onChange={e => updateField("bio", e.target.value)} rows={3} placeholder="Tell potential clients about yourself..."
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25 resize-y" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-[28px] p-8 mb-5" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)" }}>
            <h2 className="text-base font-semibold mb-4">Skills & Expertise</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.skills.map(s => (
                <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#c8ff57]/10 text-[#c8ff57] text-xs font-semibold">
                  {s}
                  <button onClick={() => removeSkill(s)} className="hover:text-white transition"><X size={12} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <select value={newSkill} onChange={e => setNewSkill(e.target.value)}
                className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25">
                <option value="">Add a skill...</option>
                {skillOptions.filter(s => !profile.skills.includes(s)).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={addSkill} className="px-4 py-3 rounded-xl bg-white/10 text-white/80 text-sm hover:bg-white/15 transition">
                <Plus size={16} />
              </button>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-[28px] p-8" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)" }}>
            <h2 className="text-base font-semibold mb-4">Social Links</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { key: "website" as const, icon: Globe, placeholder: "https://yourwebsite.com" },
                { key: "twitter" as const, icon: Twitter, placeholder: "https://twitter.com/yourhandle" },
                { key: "linkedin" as const, icon: Linkedin, placeholder: "https://linkedin.com/in/yourprofile" },
                { key: "github" as const, icon: Github, placeholder: "https://github.com/yourhandle" },
              ].map(s => (
                <div key={s.key}>
                  <label className="form-label capitalize flex items-center gap-2">
                    <s.icon size={14} className="text-[#c8ff57]" />{s.key}
                  </label>
                  <input value={(profile.social as any)[s.key]} onChange={e => updateSocial(s.key, e.target.value)} placeholder={s.placeholder}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/25" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
