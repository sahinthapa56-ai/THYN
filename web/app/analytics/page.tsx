"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { NavBar, SiteFooter, useStars, drawSparkline } from "@/lib/shared"

const cards = [
  { label: "Revenue Growth", value: "+34%", sub: "↑ Month over month", color: "#c8ff57", data: [1200, 1800, 2900, 4200, 5800, 8100, 12000, 18420] },
  { label: "Proposal Win Rate", value: "91%", sub: "↑ +9% above industry", color: "#57ffee", data: [72, 75, 78, 80, 83, 87, 89, 91] },
  { label: "Client Retention", value: "88%", sub: "↑ Repeat clients up 12%", color: "#ff9f57", data: [70, 72, 76, 79, 81, 84, 86, 88] },
  { label: "AI Performance", value: "4.9★", sub: "↑ Proposal quality score", color: "#c857ff", data: [4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 4.85, 4.9] },
]

export default function AnalyticsPage() {
  const starsRef = useRef<HTMLCanvasElement>(null)
  useStars(starsRef)

  useEffect(() => {
    setTimeout(() => {
      cards.forEach((c, i) => {
        const el = document.getElementById(`spark-${i}`) as HTMLCanvasElement
        if (el) drawSparkline(el, c.data, c.color)
      })
    }, 300)
  }, [])

  return (
    <>
      <div className="fixed inset-0 opacity-[0.035] pointer-events-none z-[-1]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <canvas ref={starsRef} className="fixed inset-0 z-[-2]" />
      <NavBar />

      <section className="pt-32 pb-20">
        <div className="container">
          <h2 className="title reveal">Business Analytics</h2>
          <p className="subtitle reveal">Understand performance, retention, and growth with AI-assisted insights and live charts.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[18px] reveal">
            {cards.map((c, i) => (
              <motion.div key={c.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 22, padding: 22 }}>
                <div className="text-sm font-semibold text-white/80">{c.label}</div>
                <div className="text-3xl font-serif mt-2">{c.value}</div>
                <div className="text-xs text-[#c8ff57] mt-1">{c.sub}</div>
                <canvas id={`spark-${i}`} style={{ width: "100%", height: 90, marginTop: 14 }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
