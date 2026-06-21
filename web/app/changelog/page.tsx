"use client";

import { useEffect } from "react";
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
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const entries = [
  {
    date: "March 15, 2026",
    version: "1.0.0",
    title: "Initial Release",
    items: [
      "Chrome Extension with LinkedIn sidebar panel",
      "One-click contact saving from LinkedIn profiles",
      "Note-taking directly from the sidebar",
      "Follow-up reminder system with browser notifications",
      "Web dashboard with contact list, search, and filters",
      "Contact detail page with timeline view",
      "Google OAuth authentication via Supabase",
      "Settings page with account management",
      "Free, Pro, and Founder subscription plans",
      "Responsive design with dark mode",
    ],
  },
  {
    date: "March 10, 2026",
    version: "0.9.0",
    title: "Beta Release",
    items: [
      "Internal beta testing",
      "Supabase integration with Row Level Security",
      "API endpoints for contacts, notes, and reminders",
      "Rate limiting and security hardening",
      "Performance optimization for large contact lists",
      "Bug fixes and stability improvements",
    ],
  },
];

export default function ChangelogPage() {
  useReveal();

  return (
    <>
      <Header />
      <main className="pt-32">
        <section className="pt-0 pb-16">
          <div className="wrapper-sm">
            <div className="badge mx-auto w-fit mb-6 reveal">Updates</div>
            <h1 className="h-hero text-center mb-6 reveal">Changelog</h1>
            <p className="body-lg text-center mb-16 reveal">Every improvement, bug fix, and feature launch.</p>

            <div className="flex flex-col gap-12 reveal">
              {entries.map((entry) => (
                <div key={entry.version} className="relative pl-8 border-l border-white/[0.08]">
                  <div className="absolute -left-[9px] top-1 w-[18px] h-[18px] rounded-full bg-[#6D5DFC] border-2 border-[#0A0A0A]" />
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-[#A1A1AA] font-medium">{entry.date}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#6D5DFC]/10 text-[#8B7FFF] border border-[#6D5DFC]/20">
                      v{entry.version}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-white mb-4">{entry.title}</h2>
                  <ul className="flex flex-col gap-2.5">
                    {entry.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-[#A1A1AA]">
                        <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#22C55E]" viewBox="0 0 16 16" fill="none">
                          <path d="M13.5 4L5.5 12L2.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
