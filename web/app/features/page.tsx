"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const featureDetails = [
  {
    title: "Contact Capture",
    icon: "👤",
    desc: "Save any LinkedIn profile to THYN with a single click. The extension automatically pulls the person's name, headline, and LinkedIn URL — no manual entry required.",
    highlights: [
      "One-click save from any LinkedIn profile",
      "Auto-captures name, headline, and profile URL",
      "Instant sync across all your devices",
      "No manual data entry needed",
    ],
  },
  {
    title: "Smart Notes",
    icon: "📝",
    desc: "Add rich notes to any contact directly from the LinkedIn sidebar. Keep track of conversation topics, personal details, decisions, and action items.",
    highlights: [
      "Add notes directly from LinkedIn profiles",
      "Rich text with timestamps",
      "Notes sync instantly across devices",
      "Search through all your notes",
    ],
  },
  {
    title: "Follow-up Reminders",
    icon: "⏰",
    desc: "Never miss a follow-up again. Set reminders for any contact and get notified when it's time to reconnect.",
    highlights: [
      "Set custom reminder dates",
      "Browser notifications when it's time to follow up",
      "Recurring reminders for key relationships",
      "Edit or snooze reminders from the sidebar",
    ],
  },
  {
    title: "Relationship Timeline",
    icon: "📊",
    desc: "See the complete history of your interactions with any contact. Notes, reminders, and milestones in chronological order.",
    highlights: [
      "Full chronological interaction history",
      "Filter by note type or date range",
      "Visual timeline with key milestones",
      "Export timeline as PDF or CSV",
    ],
  },
  {
    title: "Fast Search",
    icon: "🔍",
    desc: "Search across all your contacts, notes, and reminders instantly. Find anyone you've saved in milliseconds.",
    highlights: [
      "Full-text search across all data",
      "Search by name, company, or notes content",
      "Real-time results as you type",
      "Advanced filters for precise results",
    ],
  },
  {
    title: "Privacy First",
    icon: "🔒",
    desc: "Your data belongs to you. THYN uses Supabase Row Level Security — you can only see your own data. We never share or sell your information.",
    highlights: [
      "Row Level Security on every database table",
      "End-to-end encrypted data sync",
      "No third-party data sharing",
      "One-click data export and account deletion",
    ],
  },
];

export default function FeaturesPage() {
  useReveal();

  return (
    <>
      <Header />
      <main className="pt-32">
        {/* ── Hero ── */}
        <section className="pt-0 pb-16">
          <div className="wrapper text-center">
            <div className="badge mx-auto w-fit mb-6 reveal">Features</div>
            <h1 className="h-hero max-w-[800px] mx-auto mb-6 reveal">
              Everything you need to<br />
              <span className="text-gradient-hero">remember everyone.</span>
            </h1>
            <p className="body-lg max-w-[600px] mx-auto reveal">
              THYN packs powerful relationship management features into a seamless LinkedIn experience.
            </p>
          </div>
        </section>

        {/* ── Feature Details ── */}
        <section className="pt-0">
          <div className="wrapper">
            <div className="flex flex-col gap-24">
              {featureDetails.map((f, i) => (
                <div
                  key={f.title}
                  className={`grid md:grid-cols-2 gap-12 md:gap-16 items-center ${
                    i % 2 === 1 ? "md:grid-flow-dense" : ""
                  }`}
                >
                  <div className={`reveal ${i % 2 === 1 ? "md:order-2" : ""}`}>
                    <span className="text-5xl mb-4 block">{f.icon}</span>
                    <h2 className="h-section mb-4">{f.title}</h2>
                    <p className="body-lg mb-8">{f.desc}</p>
                    <ul className="flex flex-col gap-3">
                      {f.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-3 text-sm text-[#A1A1AA]">
                          <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#6D5DFC]" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M5.5 8L7 9.5L10.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`reveal ${i % 2 === 1 ? "md:order-1" : ""}`}>
                    <div className="glass rounded-2xl p-6 aspect-[4/3] flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6D5DFC]/20 to-[#A78BFA]/20 border border-[#6D5DFC]/20 flex items-center justify-center mx-auto mb-4">
                          <span className="text-3xl">{f.icon}</span>
                        </div>
                        <p className="text-xs text-[#A1A1AA]">Interactive {f.title} demo</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section>
          <div className="wrapper text-center">
            <div className="glass rounded-3xl p-12 md:p-16 reveal">
              <h2 className="h-section mb-4">Ready to remember everyone?</h2>
              <p className="body-lg max-w-[480px] mx-auto mb-8">
                Start for free. No credit card required.
              </p>
              <Link href="/auth" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
