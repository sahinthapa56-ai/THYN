import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "THYN — Relationship Memory for LinkedIn",
  description:
    "Save LinkedIn contacts, add notes, set reminders. Your relationship memory, powered by Supabase.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#050505] text-white antialiased">
        {children}
        <ClientLayout />
      </body>
    </html>
  );
}
