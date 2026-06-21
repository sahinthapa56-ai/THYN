import React from "react";
import { motion } from "framer-motion";
import { FileText, Globe, Clock } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { formatRelativeTime, truncate } from "../utils";
import type { Capture } from "../types";

interface CaptureCardProps {
  capture: Capture;
  onClick?: () => void;
}

export function CaptureCard({ capture, onClick }: CaptureCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
    >
      <GlassCard onClick={onClick} className="cursor-pointer hover:bg-thyn-surface/50 transition-all">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-thyn-surface flex items-center justify-center flex-shrink-0 border border-thyn-border">
            <FileText size={16} className="text-thyn-muted" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {truncate(capture.title, 80)}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1 text-xs text-thyn-muted">
                <Globe size={10} />
                <span className="truncate max-w-[160px]">
                  {truncate(capture.url, 40)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-thyn-muted">
                <Clock size={10} />
                <span>{formatRelativeTime(capture.capturedAt)}</span>
              </div>
            </div>
            {capture.tags && capture.tags.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {capture.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] rounded-full bg-thyn-surface border border-thyn-border text-thyn-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
