import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Quote } from "lucide-react";
import { GlassCard } from "./GlassCard";
import type { Summary } from "../types";

interface SummaryCardProps {
  summary: Summary;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-thyn-primary/20 flex items-center justify-center">
            <Sparkles size={14} className="text-thyn-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">AI Summary</h3>
            <p className="text-[10px] text-thyn-muted uppercase tracking-wider">
              {summary.model || "Gemini Flash"}
            </p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-thyn-muted">
          <Quote size={12} className="inline mr-1 opacity-40" />
          {summary.summary || "No summary available."}
        </p>

        {summary.tasks && summary.tasks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-thyn-border">
            <h4 className="text-[10px] uppercase tracking-widest text-thyn-muted mb-2 font-medium">
              Action Items
            </h4>
            <div className="space-y-2">
              {summary.tasks.map((task, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-thyn-primary mt-1.5 flex-shrink-0" />
                  <span className="text-thyn-muted">{task}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
