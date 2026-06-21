"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/changelog", label: "Updates" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Don't show marketing header on app pages
  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/settings")
  )
    return null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="wrapper flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6D5DFC] to-[#A78BFA] flex items-center justify-center font-display font-bold text-sm text-white transition-transform duration-300 group-hover:scale-105">
            T
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-white">
            THYN
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-full text-sm font-medium no-underline transition-all duration-200 ${
                pathname === link.href
                  ? "bg-white/10 text-white"
                  : "text-[#A1A1AA] hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link href="/auth" className="btn btn-primary btn-sm hidden md:inline-flex">
            Get Started
          </Link>
          <Link
            href="https://chrome.google.com/webstore"
            className="btn btn-secondary btn-sm hidden md:inline-flex"
          >
            Install Extension
          </Link>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white"
            aria-label="Toggle menu"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              {mobileOpen ? (
                <path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M3 5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M3 9H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M3 13H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#111] border-b border-white/10 animate-slide-down">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium no-underline transition ${
                  pathname === link.href
                    ? "bg-white/10 text-white"
                    : "text-[#A1A1AA] hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-white/5 my-2" />
            <Link
              href="/auth"
              onClick={() => setMobileOpen(false)}
              className="btn btn-primary w-full justify-center mt-2"
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
