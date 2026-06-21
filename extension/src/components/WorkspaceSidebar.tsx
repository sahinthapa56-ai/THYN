import React from "react";
import { motion } from "framer-motion";
import {
  Layout, Bookmark, CheckSquare, FileText, Settings,
  Plus, Sparkles
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: number;
}

interface WorkspaceSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  items?: NavItem[];
  onNewCapture?: () => void;
}

const defaultItems: NavItem[] = [
  { id: "workspace", label: "Workspace", icon: Layout },
  { id: "captures", label: "Captures", icon: Bookmark },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "templates", label: "Templates", icon: FileText },
];

export function WorkspaceSidebar({
  activeTab,
  onTabChange,
  items = defaultItems,
  onNewCapture,
}: WorkspaceSidebarProps) {
  return (
    <aside className="w-16 flex flex-col items-center py-4 gap-1 border-r border-thyn-border bg-thyn-surface/10 backdrop-blur-2xl">
      <div className="mb-4">
        <div className="w-10 h-10 rounded-xl bg-thyn-primary/20 flex items-center justify-center">
          <Sparkles size={18} className="text-thyn-primary" />
        </div>
      </div>

      {items.map((item) => (
        <motion.button
          key={item.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onTabChange(item.id)}
          className={`relative p-2.5 rounded-xl transition-all ${
            activeTab === item.id
              ? "bg-thyn-primary/20 text-thyn-primary shadow-glass-sm"
              : "text-thyn-muted hover:text-thyn-text hover:bg-thyn-surface"
          }`}
          title={item.label}
        >
          <item.icon size={20} />
          {item.badge && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-thyn-primary text-[9px] font-bold flex items-center justify-center text-white">
              {item.badge}
            </span>
          )}
        </motion.button>
      ))}

      <div className="flex-1" />

      {onNewCapture && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewCapture}
          className="p-2.5 rounded-xl bg-thyn-primary/20 text-thyn-primary hover:bg-thyn-primary/30 transition-all"
          title="New Capture"
        >
          <Plus size={20} />
        </motion.button>
      )}

      <button
        onClick={() => chrome.runtime.openOptionsPage()}
        className="p-2.5 rounded-xl text-thyn-muted hover:text-thyn-text hover:bg-thyn-surface transition-all mt-1"
        title="Settings"
      >
        <Settings size={18} />
      </button>
    </aside>
  );
}
