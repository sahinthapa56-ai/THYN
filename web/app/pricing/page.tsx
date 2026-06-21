"use client";

import { useEffect, useState } from "react";
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

const plans = {
  monthly: {
    free: { price: "$0", note: "" },
    pro: { price: "$18.79", note: "" },
    founder: { price: "$34.55", note: "" },
  },
  yearly: {
    free: { price: "$0", note: "" },
    pro: { price: "$15.79", note: "Save 16%" },
    founder: { price: "$29.55", note: "Save 14%" },
  },
};

const features = [
  { label: "Contacts", free: "13", pro: "Unlimited", founder: "Unlimited" },
  { label: "Notes", free: "Basic", pro: "Unlimited", founder: "Unlimited" },
  { label: "Reminders", free: "3", pro: "Unlimited", founder: "Unlimited" },
  { label: "Search", free: "—", pro: "Full-text", founder: "Full-text" },
  { label: "Timeline", free: "—", pro: "✓", founder: "✓" },
  { label: "Tags & Organization", free: "—", pro: "✓", founder: "✓" },
  { label: "Data Export", free: "—", pro: "✓", founder: "✓" },
  { label: "Priority Support", free: "—", pro: "—", founder: "✓" },
  { label: "Advanced Organization", free: "—", pro: "—", founder: "✓" },
  { label: "API Access", free: "—", pro: "—", founder: "Coming Soon" },
];

const pricingFAQ = [
  {
    q: "Can I switch plans anytime?",
    a: "Yes. You can upgrade or downgrade at any time. Upgrades take effect immediately, downgrades apply at the end of your billing period.",
  },
  {
    q: "Is there a free trial for Pro or Founder?",
    a: "Yes. Both plans come with a 14-day free trial. No credit card required to start.",
  },
  {
    q: "What happens if I exceed my plan limits?",
    a: "We'll notify you before you hit any limits. You can upgrade to a higher plan or export your data at any time.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Yes, anytime. Your paid features remain active until the end of your billing period, then your account reverts to the Free plan.",
  },
];

function FAQ({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-3 max-w-3xl mx-auto">
      {items.map((item, i) => (
        <div key={i} className="glass glass-hover rounded-2xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left text-white font-medium text-base"
          >
            <span>{item.q}</span>
            <svg className={`w-4 h-4 text-[#A1A1AA] shrink-0 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${open === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
            <p className="px-6 pb-5 text-sm text-[#A1A1AA] leading-relaxed">{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PricingPage() {
  useReveal();
  const [yearly, setYearly] = useState(false);
  const p = yearly ? plans.yearly : plans.monthly;

  return (
    <>
      <Header />
      <main className="pt-32">
        <section className="pt-0 pb-16">
          <div className="wrapper text-center">
            <div className="badge mx-auto w-fit mb-6 reveal">Pricing</div>
            <h1 className="h-hero max-w-[800px] mx-auto mb-6 reveal">
              Simple, transparent<br />
              <span className="text-gradient-hero">pricing.</span>
            </h1>
            <p className="body-lg max-w-[550px] mx-auto mb-10 reveal">
              Start for free. Upgrade when you need more. No hidden fees.
            </p>

            {/* Toggle */}
            <div className="flex items-center justify-center gap-4 reveal">
              <span className={`text-sm font-medium transition-colors ${!yearly ? "text-white" : "text-[#A1A1AA]"}`}>Monthly</span>
              <button
                onClick={() => setYearly(!yearly)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${yearly ? "bg-[#6D5DFC]" : "bg-white/20"}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${yearly ? "translate-x-7 left-0" : "translate-x-1 left-0"}`} />
              </button>
              <span className={`text-sm font-medium transition-colors ${yearly ? "text-white" : "text-[#A1A1AA]"}`}>
                Yearly <span className="text-[#22C55E] text-xs font-semibold">Save up to 16%</span>
              </span>
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="pt-0">
          <div className="wrapper">
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Free */}
              <div className="card reveal text-center">
                <h3 className="text-lg font-semibold mb-2">Free</h3>
                <p className="text-sm text-[#A1A1AA] mb-6">For getting started</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold font-display">{p.free.price}</span>
                  <span className="text-[#A1A1AA] text-sm">/month</span>
                </div>
                {p.free.note && <p className="text-xs text-[#22C55E] font-medium mb-5">{p.free.note}</p>}
                <Link href="/auth" className="btn btn-secondary w-full mb-8">Get Started</Link>
                <ul className="flex flex-col gap-3 text-left">
                  {features.map((f) => (
                    <li key={f.label} className="flex items-center justify-between text-sm">
                      <span className="text-[#A1A1AA]">{f.label}</span>
                      <span className="text-white font-medium">{f.free}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pro — featured */}
              <div className="card relative border-[#6D5DFC]/40 shadow-glow reveal md:-mt-4 md:mb-[-16px]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6D5DFC] text-white text-[11px] font-semibold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
                <div className="text-center mt-2">
                  <h3 className="text-lg font-semibold mb-2">Pro</h3>
                  <p className="text-sm text-[#A1A1AA] mb-6">For professionals</p>
                  <div className="mb-1">
                    <span className="text-5xl font-bold font-display">{p.pro.price}</span>
                    <span className="text-[#A1A1AA] text-sm">/month</span>
                  </div>
                  {p.pro.note && <p className="text-xs text-[#22C55E] font-medium mb-5">{p.pro.note}</p>}
                  <Link href="/auth" className="btn btn-primary w-full mb-8">Start Free Trial</Link>
                  <ul className="flex flex-col gap-3 text-left">
                    {features.map((f) => (
                      <li key={f.label} className="flex items-center justify-between text-sm">
                        <span className="text-[#A1A1AA]">{f.label}</span>
                        <span className="text-white font-medium">{f.pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Founder */}
              <div className="card reveal text-center">
                <h3 className="text-lg font-semibold mb-2">Founder</h3>
                <p className="text-sm text-[#A1A1AA] mb-6">For power users</p>
                <div className="mb-1">
                  <span className="text-5xl font-bold font-display">{p.founder.price}</span>
                  <span className="text-[#A1A1AA] text-sm">/month</span>
                </div>
                {p.founder.note && <p className="text-xs text-[#22C55E] font-medium mb-5">{p.founder.note}</p>}
                  <Link href="/auth" className="btn btn-secondary w-full mb-8">Start Free Trial</Link>
                <ul className="flex flex-col gap-3 text-left">
                  {features.map((f) => (
                    <li key={f.label} className="flex items-center justify-between text-sm">
                      <span className="text-[#A1A1AA]">{f.label}</span>
                      <span className="text-white font-medium">{f.founder}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section>
          <div className="wrapper">
            <h2 className="h-section text-center mb-10 reveal">Full Comparison</h2>
            <div className="glass rounded-2xl overflow-hidden reveal">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left p-4 font-medium text-[#A1A1AA]">Feature</th>
                    <th className="p-4 font-medium text-center">Free</th>
                    <th className="p-4 font-medium text-center text-[#6D5DFC]">Pro</th>
                    <th className="p-4 font-medium text-center">Founder</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((f, i) => (
                    <tr key={f.label} className={i % 2 === 0 ? "bg-white/[0.02]" : ""}>
                      <td className="p-4 text-white">{f.label}</td>
                      <td className="p-4 text-center text-[#A1A1AA]">{f.free}</td>
                      <td className="p-4 text-center text-white">{f.pro}</td>
                      <td className="p-4 text-center text-white">{f.founder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="wrapper-sm">
            <h2 className="h-section text-center mb-10 reveal">Billing Questions</h2>
            <div className="reveal">
              <FAQ items={pricingFAQ} />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="wrapper text-center">
            <div className="glass rounded-3xl p-12 md:p-16 reveal">
              <h2 className="h-section mb-4">Ready to upgrade your network?</h2>
              <p className="body-lg max-w-[480px] mx-auto mb-8">
                Start free. Upgrade anytime.
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
