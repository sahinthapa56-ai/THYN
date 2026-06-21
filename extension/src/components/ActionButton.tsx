import React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon?: LucideIcon;
  label: string;
  onClick?: () => void;
  variant?: "default" | "primary" | "success" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const variants = {
  default: "bg-thyn-surface hover:bg-white/10 text-thyn-text border-thyn-border",
  primary: "bg-thyn-primary/20 hover:bg-thyn-primary/30 text-thyn-primary border-thyn-primary/20",
  success: "bg-thyn-success/20 hover:bg-thyn-success/30 text-thyn-success border-thyn-success/20",
  accent: "bg-thyn-accent/20 hover:bg-thyn-accent/30 text-thyn-accent border-thyn-accent/20",
  ghost: "bg-transparent hover:bg-thyn-surface text-thyn-muted border-transparent",
};

const sizes = {
  sm: "px-2.5 py-1.5 text-xs rounded-xl",
  md: "px-3.5 py-2 text-sm rounded-2xl",
  lg: "px-5 py-3 text-base rounded-2xl",
};

export function ActionButton({
  icon: Icon,
  label,
  onClick,
  variant = "default",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
}: ActionButtonProps) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium border transition-all ${
        variants[variant]
      } ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : Icon ? (
        <Icon size={size === "sm" ? 12 : size === "md" ? 14 : 16} />
      ) : null}
      {loading ? "Processing..." : label}
    </motion.button>
  );
}
