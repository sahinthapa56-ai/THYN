import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "SHNTHA — AI Freelancer Operating System",
  description: "AI-powered proposal generation, pricing intelligence, CRM, analytics, invoices, and more — free forever, no API key required.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-shntha-bg text-shntha-text antialiased">
        {children}
        <ClientLayout />
      </body>
    </html>
  );
}
