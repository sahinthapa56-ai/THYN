"use client"

import { ScrollToTop, UpgradeBanner, MouseTracker } from "@/lib/shared"

export default function ClientLayout() {
  return (
    <>
      <ScrollToTop />
      <UpgradeBanner />
      <MouseTracker />
    </>
  )
}
