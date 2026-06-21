"use client";

import { useEffect, useState } from "react";
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

export default function ContactPage() {
  useReveal();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — in production, connect to API
    setSent(true);
  };

  return (
    <>
      <Header />
      <main className="pt-32">
        <section className="pt-0 pb-16">
          <div className="wrapper-sm">
            <div className="badge mx-auto w-fit mb-6 reveal">Contact</div>
            <h1 className="h-hero text-center mb-6 reveal">Get in touch.</h1>
            <p className="body-lg text-center mb-16 reveal">
              Have a question, feedback, or bug report? We&apos;d love to hear from you.
            </p>

            <div className="grid md:grid-cols-2 gap-8 reveal">
              {/* Form */}
              <div className="card">
                {sent ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
                    <p className="text-sm text-[#A1A1AA]">We&apos;ll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-[#A1A1AA]/50 focus:outline-none focus:border-[#6D5DFC]/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-[#A1A1AA]/50 focus:outline-none focus:border-[#6D5DFC]/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="form-label">Subject</label>
                      <select className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#6D5DFC]/50 transition-colors">
                        <option value="general" className="bg-[#111]">General Inquiry</option>
                        <option value="bug" className="bg-[#111]">Bug Report</option>
                        <option value="feature" className="bg-[#111]">Feature Request</option>
                        <option value="billing" className="bg-[#111]">Billing Question</option>
                        <option value="other" className="bg-[#111]">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Message</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Tell us more..."
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-[#A1A1AA]/50 focus:outline-none focus:border-[#6D5DFC]/50 transition-colors resize-none"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-full justify-center mt-2">
                      Send Message
                    </button>
                  </form>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-6">
                <div className="card">
                  <h3 className="font-semibold text-white mb-4">📧 Email</h3>
                  <p className="text-sm text-[#A1A1AA]">
                    For direct inquiries:<br />
                    <span className="text-[#8B7FFF]">sahinthapa56@gmail.com</span>
                  </p>
                </div>
                <div className="card">
                  <h3 className="font-semibold text-white mb-4">🐛 Bug Reports</h3>
                  <p className="text-sm text-[#A1A1AA]">
                    Found a bug? Open an issue on GitHub:<br />
                    <a
                      href="https://github.com/sahinthapa56-ai/THYN/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8B7FFF] no-underline hover:underline"
                    >
                      github.com/sahinthapa56-ai/THYN/issues
                    </a>
                  </p>
                </div>
                <div className="card">
                  <h3 className="font-semibold text-white mb-4">💬 Feedback</h3>
                  <p className="text-sm text-[#A1A1AA]">
                    We read every message. Your feedback shapes THYN&apos;s future.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
