"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// ── Intersection Observer for reveal animations ──
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ── FAQ Accordion ──
function FAQ({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-3 max-w-3xl mx-auto">
      {items.map((item, i) => (
        <div
          key={i}
          className="glass glass-hover rounded-2xl overflow-hidden transition-all duration-300"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left text-white font-medium text-base no-underline hover:no-underline transition-colors"
          >
            <span>{item.q}</span>
            <svg
              className={`w-4 h-4 text-[#A1A1AA] shrink-0 transition-transform duration-300 ${
                open === i ? "rotate-180" : ""
              }`}
              viewBox="0 0 16 16"
              fill="none"
            >
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              open === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <p className="px-6 pb-5 text-sm text-[#A1A1AA] leading-relaxed">
              {item.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

const faqItems = [
  {
    q: "What is THYN?",
    a: "THYN is a relationship memory system for LinkedIn. It helps you remember every person you connect with, the context of your conversations, and when to follow up — directly from your LinkedIn profile.",
  },
  {
    q: "How does THYN work?",
    a: "Install the Chrome extension. When you visit any LinkedIn profile, THYN's sidebar appears with a summary of your relationship — notes, reminders, and past interactions. You can add new notes or set follow-up reminders with one click.",
  },
  {
    q: "Is THYN free?",
    a: "THYN has a Free plan that includes 13 contacts, basic notes, and 3 reminders. Our Pro plan ($18.79/month) offers unlimited contacts, notes, reminders, and full search.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. THYN uses Supabase with Row Level Security — you can only see your own data. All data is encrypted in transit and at rest. We never share or sell your personal information.",
  },
  {
    q: "Does THYN store my LinkedIn data?",
    a: "THYN only stores what you choose to save — names, LinkedIn URLs, and the notes/reminders you create. We do not bulk-scrape profiles or store any data without your explicit action.",
  },
  {
    q: "Which browsers are supported?",
    a: "THYN is currently available as a Chrome extension (Manifest V3). Firefox and Edge support are on our roadmap.",
  },
  {
    q: "Can I use THYN without the extension?",
    a: "Yes. The web app at app.thyn.so gives you full access to your dashboard, contacts, notes, and reminders. The extension adds the LinkedIn sidebar for saving contacts as you browse.",
  },
  {
    q: "How do I export my data?",
    a: "You can export all your data from the Settings page. We support JSON and CSV formats for contacts, notes, and reminders.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Yes, anytime. Your Pro features remain active until the end of your billing period, then your account reverts to the Free plan. No questions asked.",
  },
  {
    q: "What if I find a bug or have a feature request?",
    a: "Reach out via our Contact page or email us directly. We respond to all feedback within 24 hours.",
  },
];

// ── Feature card data ──
const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#8B7FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#8B7FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#8B7FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#8B7FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Relationship Memory",
    desc: "Every person you save comes with full context — where you met, what you discussed, and your last interaction. Never draw a blank again.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 20H21" stroke="#8B7FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16.5 3.5C16.8978 3.10217 17.4374 2.87868 18 2.87868C18.2786 2.87868 18.5544 2.93355 18.8118 3.04015C19.0692 3.14676 19.303 3.30302 19.5 3.5C19.697 3.69698 19.8532 3.93083 19.9598 4.1882C20.0665 4.44557 20.1213 4.72142 20.1213 5C20.1213 5.27858 20.0665 5.55443 19.9598 5.8118C19.8532 6.06917 19.697 6.30302 19.5 6.5L7 19L2 20L3 15L16.5 3.5Z" stroke="#8B7FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Contact Notes",
    desc: "Add rich notes to any contact. Track conversation topics, personal details, decisions, and action items. Everything stays in one place.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 6V12L16 14" stroke="#8B7FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="9" stroke="#8B7FFF" strokeWidth="1.5"/>
      </svg>
    ),
    title: "Smart Reminders",
    desc: "Set follow-up reminders so you never miss a check-in. THYN notifies you when it's time to reconnect, right in your browser.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 3V21H21" stroke="#8B7FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 16L11 11L14 14L21 7" stroke="#8B7FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Relationship Timeline",
    desc: "See the full history of your interactions with any contact — notes added, reminders set, and milestones hit. Context at a glance.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="8" stroke="#8B7FFF" strokeWidth="1.5"/>
        <path d="M21 21L16.65 16.65" stroke="#8B7FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Fast Search",
    desc: "Search across all your contacts, notes, and reminders instantly. Find anyone you've saved in milliseconds.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="#8B7FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="#8B7FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Tags & Organization",
    desc: "Organize contacts with custom tags. Filter by category, relationship type, or any tag you create. Your CRM, your way.",
  },
];

// ── Stats ──
const stats = [
  { value: "10K+", label: "Connections Saved" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.8★", label: "User Rating" },
  { value: "≤1s", label: "Sync Time" },
];

export default function HomePage() {
  useReveal();

  return (
    <>
      <Header />

      {/* ─── HERO ─── */}
      <section className="min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Glow orbs */}
        <div className="glow-orb glow-orb-primary top-[-200px] left-[-200px]" />
        <div className="glow-orb glow-orb-accent bottom-[-200px] right-[-200px]" />

        <div className="wrapper text-center relative z-10">
          {/* Badge */}
          <div className="badge mx-auto w-fit mb-8 reveal">
            <span className="badge-dot" />
            Now available on Chrome Web Store
          </div>

          {/* Headline */}
          <h1 className="h-hero max-w-[900px] mx-auto mb-6 reveal">
            Remember Every<br />
            <span className="text-gradient-hero">Important Relationship.</span>
          </h1>

          {/* Subheadline */}
          <p className="body-lg max-w-[640px] mx-auto mb-10 reveal">
            THYN helps founders, recruiters, and professionals remember people, conversations, notes, and follow-ups directly from LinkedIn.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 flex-wrap reveal">
            <Link href="/auth" className="btn btn-primary btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Get Started Free
            </Link>
            <Link href="#how-it-works" className="btn btn-secondary btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>
              </svg>
              View Demo
            </Link>
          </div>

          {/* Hero visual — Extension mockup */}
          <div className="mt-16 max-w-[800px] mx-auto reveal">
            <div className="glass rounded-2xl p-2 shadow-glow overflow-hidden">
              <div className="bg-[#0A0A0A]/80 rounded-xl p-6 border border-white/[0.04]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <div className="flex-1 flex justify-center">
                    <div className="text-xs text-[#A1A1AA] bg-white/[0.04] px-4 py-1.5 rounded-full border border-white/[0.06]">
                      linkedin.com/in/sarah-chen
                    </div>
                  </div>
                </div>
                <div className="flex gap-6">
                  {/* LinkedIn mockup */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6D5DFC]/40 to-[#A78BFA]/40" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3 w-32 bg-white/10 rounded-full" />
                        <div className="h-2.5 w-24 bg-white/5 rounded-full" />
                      </div>
                    </div>
                    <div className="h-2.5 bg-white/5 rounded-full w-3/4" />
                    <div className="h-2.5 bg-white/5 rounded-full w-1/2" />
                    <div className="h-2.5 bg-white/5 rounded-full w-5/6" />
                  </div>
                  {/* THYN sidebar */}
                  <div className="w-48 shrink-0 bg-[#6D5DFC]/10 rounded-xl border border-[#6D5DFC]/20 p-4">
                    <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">THYN Memory</div>
                    <div className="space-y-2.5">
                      <div className="h-2.5 bg-[#6D5DFC]/30 rounded-full w-full" />
                      <div className="h-2.5 bg-[#6D5DFC]/20 rounded-full w-3/4" />
                      <div className="h-8 bg-[#6D5DFC]/20 rounded-lg w-full mt-3" />
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#6D5DFC]/15">
                      <div className="text-[10px] text-[#A78BFA] mb-2 font-medium">REMINDERS</div>
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6D5DFC] animate-pulse" />
                        Follow up in 2 weeks
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <section className="py-16 border-y border-white/[0.04]">
        <div className="wrapper">
          <p className="text-xs text-center text-[#A1A1AA] uppercase tracking-widest mb-8 font-medium reveal">
            Trusted by professionals worldwide
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 reveal">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="h-section text-gradient font-display font-bold">{s.value}</div>
                <p className="text-sm text-[#A1A1AA] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROBLEM ─── */}
      <section id="problem">
        <div className="wrapper">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="reveal-left">
              <div className="badge mb-6">The Problem</div>
              <h2 className="h-section mb-6">
                LinkedIn connections are not relationships.
              </h2>
              <p className="body-lg mb-8">
                You meet someone at a conference, send a connection request, and then... nothing. Six months later, you see their name and have no idea who they are or what you discussed.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { icon: "🎯", text: "Missed opportunities from forgotten connections" },
                  { icon: "📅", text: "Follow-ups that never happened" },
                  { icon: "🧠", text: "Lost context after a great conversation" },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">{item.icon}</span>
                    <span className="text-sm text-[#A1A1AA]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal-right">
              <div className="glass rounded-2xl p-8 aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-6">😬</div>
                  <p className="text-[#A1A1AA] text-sm">
                    "I know we've met before...<br />but I can't remember where."
                  </p>
                  <div className="mt-6 w-16 h-16 mx-auto rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/20 text-xs">
                    ??
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOLUTION ─── */}
      <section id="solution" className="bg-[#0A0A0A]">
        <div className="wrapper">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="reveal-left order-2 md:order-1">
              <div className="glass rounded-2xl p-1 shadow-glow overflow-hidden">
                <div className="bg-[#0A0A0A]/80 rounded-xl p-4 border border-white/[0.04]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/10 rounded w-3/4" />
                      <div className="h-3 bg-white/5 rounded w-1/2" />
                      <div className="h-3 bg-white/5 rounded w-2/3" />
                    </div>
                    <div className="w-40 shrink-0 bg-[#6D5DFC]/10 rounded-xl border border-[#6D5DFC]/20 p-3">
                      <div className="text-[10px] font-semibold text-white/60 uppercase mb-2">THYN</div>
                      <div className="h-2 bg-[#6D5DFC]/30 rounded w-full mb-2" />
                      <div className="h-2 bg-[#6D5DFC]/20 rounded w-3/4" />
                      <div className="mt-2 pt-2 border-t border-[#6D5DFC]/15">
                        <div className="text-[9px] text-[#A78BFA] font-medium">Last noted: 2 weeks ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="reveal-right order-1 md:order-2">
              <div className="badge mb-6">The Solution</div>
              <h2 className="h-section mb-6">
                Context appears when you need it.
              </h2>
              <p className="body-lg mb-8">
                THYN lives inside LinkedIn. When you visit any profile, your saved notes, reminders, and relationship history appear instantly in the sidebar.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { icon: "💾", text: "Save contacts with one click" },
                  { icon: "📝", text: "Add notes directly from LinkedIn profiles" },
                  { icon: "⏰", text: "Set follow-up reminders that stick" },
                  { icon: "📊", text: "View relationship timeline at a glance" },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">{item.icon}</span>
                    <span className="text-sm text-[#A1A1AA]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works">
        <div className="wrapper">
          <div className="section-header reveal">
            <div className="badge mx-auto w-fit mb-6">How It Works</div>
            <h2 className="h-section">Three steps to never forget.</h2>
            <p className="body-lg">Getting started takes less than 30 seconds.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 reveal">
            {[
              {
                step: "01",
                icon: "📦",
                title: "Install the Extension",
                desc: "Add THYN to Chrome from the Web Store. One click, no sign-up required to start browsing.",
              },
              {
                step: "02",
                icon: "👤",
                title: "Open LinkedIn",
                desc: "Visit any LinkedIn profile. THYN's sidebar appears automatically, ready for you to save the person.",
              },
              {
                step: "03",
                icon: "🧠",
                title: "Save & Remember",
                desc: "Add notes, set reminders, and build your relationship memory. Everything syncs across devices.",
              },
            ].map((item) => (
              <div key={item.step} className="card card-glow">
                <div className="text-[#6D5DFC] font-display font-bold text-sm mb-4">{item.step}</div>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="h-card mb-2">{item.title}</h3>
                <p className="body-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features">
        <div className="wrapper">
          <div className="section-header reveal">
            <div className="badge mx-auto w-fit mb-6">Features</div>
            <h2 className="h-section">Everything you need to remember.</h2>
            <p className="body-lg">THYN packs powerful relationship management into a seamless LinkedIn experience.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 reveal">
            {features.map((f) => (
              <div key={f.title} className="card card-glow">
                <div className="w-10 h-10 rounded-xl bg-[#6D5DFC]/10 border border-[#6D5DFC]/20 flex items-center justify-center mb-5">
                  {f.icon}
                </div>
                <h3 className="h-card mb-2">{f.title}</h3>
                <p className="body-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SCREENSHOTS ─── */}
      <section>
        <div className="wrapper">
          <div className="section-header reveal">
            <div className="badge mx-auto w-fit mb-6">Screenshots</div>
            <h2 className="h-section">See it in action.</h2>
            <p className="body-lg">A clean, premium interface that feels native to LinkedIn.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 reveal">
            {[
              { label: "Extension — Sidepanel", desc: "View contact context directly on LinkedIn profiles" },
              { label: "Dashboard", desc: "Manage all your contacts, notes, and reminders" },
              { label: "Contact Detail", desc: "Full relationship history with timeline view" },
              { label: "Popup", desc: "Quick-access notes and reminders from any profile" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                  </div>
                  <span className="text-xs text-[#A1A1AA] font-medium">{s.label}</span>
                </div>
                <div className="aspect-video rounded-xl bg-gradient-to-br from-[#6D5DFC]/5 to-[#A78BFA]/5 border border-white/[0.04] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-[#6D5DFC]/10 border border-[#6D5DFC]/20 flex items-center justify-center mb-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" rx="3" stroke="#8B7FFF" strokeWidth="1.5"/>
                        <path d="M9 8L16 12L9 16V8Z" fill="#8B7FFF"/>
                      </svg>
                    </div>
                    <p className="text-sm text-[#A1A1AA]">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq">
        <div className="wrapper-sm">
          <div className="section-header reveal">
            <div className="badge mx-auto w-fit mb-6">FAQ</div>
            <h2 className="h-section">Frequently asked questions.</h2>
            <p className="body-lg">Everything you need to know about THYN.</p>
          </div>

          <div className="reveal">
            <FAQ items={faqItems} />
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="pb-24">
        <div className="wrapper text-center">
          <div className="glass rounded-3xl p-12 md:p-16 relative overflow-hidden">
            <div className="glow-orb glow-orb-primary top-[-300px] right-[-200px]" />
            <div className="relative z-10 reveal">
              <div className="badge mx-auto w-fit mb-6">Get Started</div>
              <h2 className="h-section mb-6">
                Never forget a relationship again.
              </h2>
              <p className="body-lg max-w-[520px] mx-auto mb-10">
                Join thousands of professionals who use THYN to remember every connection, conversation, and commitment.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link href="/auth" className="btn btn-primary btn-lg">
                  Install THYN Free
                </Link>
                <Link href="/pricing" className="btn btn-secondary btn-lg">
                  See Pricing
                </Link>
              </div>
              <p className="text-xs text-[#A1A1AA]/60 mt-6">
                No credit card required • Free plan available • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
