import React from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = "", animate = true, onClick }: GlassCardProps) {
  const Comp = animate ? motion.div : "div";
  const props = animate
    ? {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
      }
    : {};

  return (
    <Comp
      {...props}
      onClick={onClick}
      className={`bg-thyn-surface/30 backdrop-blur-2xl border border-thyn-border rounded-3xl p-5 shadow-glass-sm ${className}`}
    >
      {children}
    </Comp>
  );
}
