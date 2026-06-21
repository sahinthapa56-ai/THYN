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

export default function TermsPage() {
  useReveal();

  return (
    <>
      <Header />
      <main className="pt-32">
        <section className="pt-0 pb-16">
          <div className="wrapper-sm">
            <div className="badge mx-auto w-fit mb-6 reveal">Terms</div>
            <h1 className="h-hero text-center mb-6 reveal">Terms of Service</h1>
            <p className="body-lg text-center mb-12 reveal">Last updated: March 2026</p>

            <div className="flex flex-col gap-8 text-sm text-[#A1A1AA] leading-relaxed reveal">
              <section>
                <h2 className="text-white font-semibold text-lg mb-3">1. Acceptance of Terms</h2>
                <p>
                  By accessing or using THYN (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. 
                  If you do not agree, do not use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-white font-semibold text-lg mb-3">2. Description of Service</h2>
                <p>
                  THYN is a relationship memory system for LinkedIn that allows users to save contacts, take notes, 
                  set reminders, and manage professional relationships. The Service includes a web application 
                  and a Chrome browser extension.
                </p>
              </section>

              <section>
                <h2 className="text-white font-semibold text-lg mb-3">3. User Accounts</h2>
                <p>
                  You are responsible for maintaining the confidentiality of your account credentials. 
                  You must provide accurate, current, and complete information during registration. 
                  You are solely responsible for all activity under your account.
                </p>
              </section>

              <section>
                <h2 className="text-white font-semibold text-lg mb-3">4. Acceptable Use</h2>
                <p>You agree not to:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Use the Service for any unlawful purpose</li>
                  <li>Attempt to access another user&apos;s account or data</li>
                  <li>Use the Service to store prohibited or illegal content</li>
                  <li>Attempt to reverse-engineer, decompile, or tamper with the Service</li>
                  <li>Use automated tools to scrape or bulk-collect data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-white font-semibold text-lg mb-3">5. Subscription & Billing</h2>
                <p>
                  THYN offers Free, Pro, and Founder subscription plans. Paid plans are billed monthly or yearly 
                  as selected. You may cancel at any time; no refunds are provided for partial billing periods. 
                  Prices are subject to change with 30 days&apos; notice.
                </p>
              </section>

              <section>
                <h2 className="text-white font-semibold text-lg mb-3">6. Data Ownership</h2>
                <p>
                  You retain full ownership of all data you enter into THYN. We claim no intellectual property 
                  rights over your content. We will not share, sell, or use your data except as described 
                  in our Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-white font-semibold text-lg mb-3">7. Service Availability</h2>
                <p>
                  We strive for 99.9% uptime but do not guarantee uninterrupted service. We reserve the right 
                  to perform maintenance, updates, or suspend the Service temporarily without liability.
                </p>
              </section>

              <section>
                <h2 className="text-white font-semibold text-lg mb-3">8. Limitation of Liability</h2>
                <p>
                  THYN is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for any indirect, 
                  incidental, or consequential damages arising from your use of the Service. Our total liability 
                  is limited to the amount you paid us in the 12 months preceding the claim.
                </p>
              </section>

              <section>
                <h2 className="text-white font-semibold text-lg mb-3">9. Termination</h2>
                <p>
                  We reserve the right to suspend or terminate accounts that violate these terms. You may 
                  terminate your account at any time from the Settings page. Upon termination, your data 
                  is deleted within 30 days.
                </p>
              </section>

              <section>
                <h2 className="text-white font-semibold text-lg mb-3">10. Changes to Terms</h2>
                <p>
                  We may update these terms from time to time. Continued use of the Service after changes 
                  constitutes acceptance of the updated terms.
                </p>
              </section>

              <section>
                <h2 className="text-white font-semibold text-lg mb-3">11. Contact</h2>
                <p>
                  For questions about these terms, contact:<br />
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
