import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { formatRelativeTime } from "../utils";
import type { Task } from "../types";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
    >
      <GlassCard className="flex items-center gap-3 py-3 px-4">
        <button onClick={() => onToggle(task.id)} className="flex-shrink-0">
          {task.done ? (
            <CheckCircle2 size={18} className="text-thyn-success" />
          ) : (
            <Circle size={18} className="text-thyn-muted hover:text-thyn-text transition-colors" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={`text-sm ${
              task.done ? "line-through text-thyn-muted/50" : "text-thyn-text"
            }`}
          >
            {task.text}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {task.createdAt && (
              <span className="text-[10px] text-thyn-muted">
                {formatRelativeTime(task.createdAt)}
              </span>
            )}
            {task.sourceTitle && (
              <span className="text-[10px] text-thyn-muted truncate max-w-[120px]">
                from {task.sourceTitle}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 rounded-lg hover:bg-thyn-danger/20 text-thyn-muted hover:text-thyn-danger transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      </GlassCard>
    </motion.div>
  );
}
