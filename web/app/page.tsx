"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Brain, FileText, Bot, BarChart3 } from "lucide-react"
import { useStars, NavBar, SiteFooter } from "@/lib/shared"

const features = [
  { icon: Brain, title: "AI Pricing Intelligence", description: "Generate accurate regional pricing recommendations using project complexity, market data, and experience level." },
  { icon: FileText, title: "Proposal Generation Engine", description: "Create premium client-ready proposals instantly with AI-powered structure, tone optimization, and strategic positioning." },
  { icon: Bot, title: "Freelance AI Assistant", description: "Your built-in freelance strategist for pricing negotiation, productivity, client communication, and business growth." },
  { icon: BarChart3, title: "Analytics Dashboard", description: "Monitor revenue growth, conversion rates, proposal performance, and all critical freelancer business metrics in real time." },
]

export default function Home() {
  const starsRef = useRef<HTMLCanvasElement>(null)
  useStars(starsRef)

  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.3])

  return (
    <>
      <div className="fixed inset-0 opacity-[0.035] pointer-events-none z-[-1]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <canvas ref={starsRef} className="fixed inset-0 z-[-2]" />

      <NavBar />

      {/* Hero */}
      <section className="min-h-screen flex items-center pt-28 overflow-hidden relative">
        <div className="glow-accent" style={{ top: -200, left: -200 }} />
        <motion.div className="container grid lg:grid-cols-[1.15fr_0.85fr] gap-16 items-center" style={{ y: heroY, opacity: heroOpacity }}>
          <div>
            <div className="badge">
              <span className="badge-dot" />
              AI Freelancer Operating System — 4 Months Free
            </div>
            <h1 className="font-serif italic text-[clamp(48px,7.5vw,118px)] leading-[.93] tracking-[-3px] mb-6">
              Venture Past<br />Freelancing<br />
              <em className="not-italic text-[#c8ff57]">Into Limitless</em><br />Opportunity.
            </h1>
            <p className="max-w-[680px] text-lg text-white/60 mb-9 leading-relaxed">
              SHNTHA transforms uncertainty into clarity with AI-powered pricing, proposals, contracts, CRM workflows, analytics, and full freelancer automation. Start your 4-month free trial today.
            </p>
            <div className="flex gap-3.5 flex-wrap">
              <a href="/auth" className="btn btn-primary">Start Your Voyage →</a>
              <a href="/proposals" className="btn btn-secondary">Try AI Demo</a>
            </div>
            <div className="grid grid-cols-3 gap-3.5 mt-12">
              <div className="card"><p className="text-sm text-white/60 font-semibold text-[15px]">Built for modern freelancers</p></div>
              <div className="card"><p className="text-sm text-white/60 font-semibold text-[15px]">AI-powered proposal workflows</p></div>
              <div className="card"><p className="text-sm text-white/60 font-semibold text-[15px]">4-month free trial — no credit card</p></div>
            </div>
          </div>
          <div className="dashboard-preview reveal">
            <div className="preview-header">
              <div>
                <h3 className="text-xl font-serif italic">Freelancer Command Center</h3>
                <p className="text-xs text-white/60 mt-0.5">Live AI Operating Dashboard</p>
              </div>
              <div className="live-dot" />
            </div>
            <div className="preview-card">
              <div className="kpi-label">Monthly Revenue</div>
              <div className="kpi">$18,420</div>
              <div className="kpi-change">↑ 34% vs last month</div>
            </div>
            <div className="preview-card">
              <div className="kpi-label">AI Suggested Rate</div>
              <div className="kpi">$120/hr</div>
              <div className="kpi-change">↑ Premium positioning active</div>
            </div>
            <div className="preview-card">
              <div className="kpi-label">Proposal Conversion</div>
              <div className="kpi">94%</div>
              <div className="kpi-change">↑ 9% above industry avg</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features">
        <div className="glow-accent" style={{ top: 0, right: -200, opacity: 0.6 }} />
        <div className="container">
          <h2 className="title reveal">Everything Your Freelance Business Needs</h2>
          <p className="subtitle reveal">A premium AI operating system built for freelancers, creators, consultants, and modern agencies.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title} className="card reveal"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}>
                <f.icon size={28} className="mb-3.5 text-[#c8ff57]" />
                <h3 className="text-xl mb-2.5">{f.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{f.description}</p>
                <a href={`/${f.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                  className="inline-flex items-center gap-1 text-xs text-[#c8ff57] mt-3 hover:underline no-underline">
                  Open {f.title.split(" ")[0]} →
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing">
        <div className="container">
          <h2 className="title reveal">Simple, Transparent Pricing</h2>
          <p className="subtitle reveal">Try free with 5 generations, then choose the plan that fits your freelance business.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-[18px] max-w-[1200px] mx-auto reveal">
            {[
              {
                tier: "Free", price: "$0", per: "5 generations", badge: "GET STARTED", border: false,
                features: ["5 AI generations total", "AI Pricing Calculator", "AI Proposal Generator", "Full CRM (unlimited)", "Dashboard & Analytics", "Invoices & Inbox", "Notes & Profile"],
                cta: "Sign Up Free", href: "/auth", highlight: false,
              },
              {
                tier: "Premium", price: "$19", per: "month", badge: "BEST VALUE", border: true,
                features: ["Unlimited AI generations", "Everything in Free", "Advanced Analytics", "Smart Contract Builder", "Email Follow-up Automation", "Priority Support", "Team Collaboration (up to 3)"],
                cta: "Choose Premium →", href: "#", highlight: true,
              },
              {
                tier: "Elite", price: "$49", per: "month", badge: "PRO", border: false,
                features: ["Everything in Premium", "Unlimited team members", "Custom AI model tuning", "Dedicated account manager", "White-label proposals", "API access", "SLA guarantee"],
                cta: "Choose Elite →", href: "#", highlight: false,
              },
              {
                tier: "Enterprise", price: "Custom", per: "contact us", badge: "TEAMS", border: false,
                features: ["Everything in Elite", "On-premise deployment", "Custom integrations", "SSO & SAML", "Audit logs", "24/7 phone support", "Custom SLA"],
                cta: "Contact Sales →", href: "#", highlight: false,
              },
            ].map((t, i) => (
              <motion.div key={t.tier} className="rounded-[28px] p-8 flex flex-col"
                style={{
                  background: t.highlight ? "rgba(200,255,87,.04)" : "rgba(255,255,255,.05)",
                  border: t.highlight ? "1px solid #c8ff57" : "1px solid rgba(255,255,255,.1)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}>
                <span className={"inline-block self-start px-3 py-1 rounded-full text-[11px] font-bold tracking-wide mb-4 " + (t.highlight ? "bg-[#c8ff57] text-black" : "bg-white/10 text-white/60")}>{t.badge}</span>
                <h3 className="text-xl font-bold">{t.tier}</h3>
                <div className="text-[52px] font-serif my-3 leading-none">{t.price}<span className="text-sm text-white/60 font-sans">/{t.per}</span></div>
                <ul className="mt-4 space-y-2 flex-1">
                  {t.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/60 py-1.5 border-b border-white/[.05] last:border-b-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8ff57" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>{f}
                    </li>
                  ))}
                </ul>
                {t.href ? (
                  <a href={t.href} className={"block w-full mt-6 py-3.5 rounded-xl font-semibold text-sm transition text-center no-underline " + (t.highlight ? "bg-[#c8ff57] text-black hover:bg-[#d8ff70]" : "border border-white/10 bg-white/10 text-white hover:bg-white/15")}>
                    {t.cta}
                  </a>
                ) : (
                  <button onClick={() => alert("Stripe checkout — configure in production")}
                    className={"w-full mt-6 py-3.5 rounded-xl font-semibold text-sm transition " + (t.highlight ? "bg-[#c8ff57] text-black hover:bg-[#d8ff70]" : "border border-white/10 bg-white/10 text-white hover:bg-white/15")}>
                    {t.cta}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
