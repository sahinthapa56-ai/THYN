import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "THYN — Never Forget a Relationship Again",
  description:
    "THYN helps founders, recruiters, and professionals remember people, conversations, notes, and follow-ups directly from LinkedIn. Your relationship memory system.",
  openGraph: {
    title: "THYN — Relationship Memory for LinkedIn",
    description:
      "Save LinkedIn contacts, add notes, set reminders. Your relationship memory, powered by Supabase.",
    type: "website",
    siteName: "THYN",
  },
  twitter: {
    card: "summary_large_image",
    title: "THYN — Relationship Memory for LinkedIn",
    description:
      "Save LinkedIn contacts, add notes, set reminders. Your relationship memory.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0A0A0A] text-white antialiased">
        <Header />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
