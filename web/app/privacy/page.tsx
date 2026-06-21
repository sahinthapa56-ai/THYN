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
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function PrivacyPage() {
  useReveal();

  return (
    <>
      <Header />
      <main className="pt-32">
        <section className="pt-0 pb-16">
          <div className="wrapper-sm">
            <div className="badge mx-auto w-fit mb-6 reveal">Privacy</div>
            <h1 className="h-hero text-center mb-6 reveal">Privacy Policy</h1>
            <p className="body-lg text-center mb-12 reveal">Last updated: March 2026</p>

            <div className="flex flex-col gap-8 text-sm text-[#A1A1AA] leading-relaxed reveal">
              <section>
                <h2 className="text-white font-semibold text-lg mb-3">1. Information We Collect</h2>
                <p>
                  THYN collects the following information when you use our service:
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li><strong className="text-white">Account Information:</strong> When you sign in via Google OAuth, we receive your email address and display name.</li>
                  <li><strong className="text-white">Contact Data:</strong> Names, LinkedIn profile URLs, and any notes or reminders you create about your contacts.</li>
                  <li><strong className="text-white">Usage Data:</strong> Anonymous usage analytics to improve the product (if enabled).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-white font-semibold text-lg mb-3">2. How We Use Your Information</h2>
                <p>We use your information solely to provide and improve the THYN service:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>To save and retrieve your contacts, notes, and reminders</li>
                  <li>To authenticate you via Google OAuth</li>
                  <li>To send you reminder notifications you&apos;ve requested</li>
                  <li>To improve product performance and fix bugs</li>
                </ul>
              </section>

              <section>
                <h2 className="text-white font-semibold text-lg mb-3">3. Data Storage & Security</h2>
                <p>
                  All data is stored securely on Supabase (PostgreSQL) with Row Level Security. 
                  Each user can only access their own data. Data is encrypted in transit (TLS) and at rest.
                  We do not sell, rent, or share your personal data with third parties.
                </p>
              </section>

              <section>
                <h2 className="text-white font-semibold text-lg mb-3">4. Authentication</h2>
                <p>
                  THYN uses Google OAuth for authentication. We only request access to your email address 
                  and display name. We do not post to your Google account or access any other Google services.
                </p>
              </section>

              <section>
                <h2 className="text-white font-semibold text-lg mb-3">5. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Access all data stored in your THYN account</li>
                  <li>Export your data in JSON or CSV format</li>
                  <li>Delete your account and all associated data</li>
                  <li>Opt out of analytics tracking</li>
                </ul>
              </section>

              <section>
                <h2 className="text-white font-semibold text-lg mb-3">6. Data Retention</h2>
                <p>
                  We retain your data for as long as your account is active. If you delete your account, 
                  all associated data is permanently deleted within 30 days.
                </p>
              </section>

              <section>
                <h2 className="text-white font-semibold text-lg mb-3">7. Third-Party Services</h2>
                <p>THYN uses the following third-party services:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li><strong className="text-white">Supabase</strong> — Database and authentication (GDPR compliant)</li>
                  <li><strong className="text-white">Google</strong> — OAuth authentication</li>
                  <li><strong className="text-white">Vercel</strong> — Web hosting</li>
                </ul>
              </section>

              <section>
                <h2 className="text-white font-semibold text-lg mb-3">8. Chrome Extension Permissions</h2>
                <p>The THYN Chrome extension requires these permissions:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li><strong className="text-white">storage:</strong> To cache your session and preferences locally</li>
                  <li><strong className="text-white">sidePanel:</strong> To display the THYN sidebar on LinkedIn</li>
                  <li><strong className="text-white">tabs:</strong> To detect when you&apos;re visiting a LinkedIn profile</li>
                  <li><strong className="text-white">Host permission (linkedin.com):</strong> To read profile information you choose to save</li>
                </ul>
              </section>

              <section>
                <h2 className="text-white font-semibold text-lg mb-3">9. Changes to This Policy</h2>
                <p>
                  We may update this privacy policy from time to time. We will notify you of any material 
                  changes via email or through the application.
                </p>
              </section>

              <section>
                <h2 className="text-white font-semibold text-lg mb-3">10. Contact</h2>
                <p>
                  If you have questions about this privacy policy or your data, please contact us at:<br />
                  Email: <span className="text-[#8B7FFF]">sahinthapa56@gmail.com</span>
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
