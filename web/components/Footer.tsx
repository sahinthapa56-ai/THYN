import Link from "next/link";

const footerLinks = {
  Product: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/changelog", label: "Changelog" },
  ],
  Resources: [
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
  Social: [
    { href: "https://github.com/sahinthapa56-ai/THYN", label: "GitHub" },
    { href: "https://twitter.com", label: "Twitter / X" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0A0A0A]">
      <div className="wrapper py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 no-underline mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6D5DFC] to-[#A78BFA] flex items-center justify-center font-display font-bold text-xs text-white">
                T
              </div>
              <span className="font-display font-bold text-base text-white">
                THYN
              </span>
            </Link>
            <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-[240px]">
              Never Forget a Relationship Again. Your relationship memory system for LinkedIn.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
                {group}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#A1A1AA] hover:text-white no-underline transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="wrapper flex flex-col md:flex-row items-center justify-between py-6 gap-4">
          <p className="text-xs text-[#A1A1AA]">
            © {new Date().getFullYear()} THYN. All rights reserved.
          </p>
          <p className="text-xs text-[#A1A1AA]/60">
            Built with ❤️ for professionals who never forget.
          </p>
        </div>
      </div>
    </footer>
  );
}
