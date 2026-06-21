import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, Sparkles, Bookmark, FileText, CheckSquare, Mail } from "lucide-react";

interface Command {
  id: string;
  label: string;
  icon: any;
  action: () => void;
  shortcut?: string;
}

interface CommandBarProps {
  commands: Command[];
  isOpen: boolean;
  onClose: () => void;
}

export function CommandBar({ commands, isOpen, onClose }: CommandBarProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      filtered[selectedIndex].action();
      onClose();
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            className="relative w-full max-w-lg bg-[#151516] border border-thyn-border rounded-3xl shadow-2xl overflow-hidden backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-thyn-border">
              <Search size={16} className="text-thyn-muted flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search actions..."
                className="flex-1 bg-transparent text-sm text-thyn-text outline-none placeholder:text-thyn-muted/50"
              />
              <kbd className="text-[10px] text-thyn-muted px-1.5 py-0.5 rounded bg-thyn-surface border border-thyn-border">
                <Command size={10} className="inline" />K
              </kbd>
            </div>

            <div className="max-h-72 overflow-y-auto p-2">
              {filtered.map((cmd, i) => (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-all ${
                    i === selectedIndex
                      ? "bg-thyn-primary/20 text-thyn-primary"
                      : "text-thyn-muted hover:bg-thyn-surface"
                  }`}
                >
                  <cmd.icon size={16} />
                  <span>{cmd.label}</span>
                  {cmd.shortcut && (
                    <kbd className="ml-auto text-[10px] text-thyn-muted px-1.5 py-0.5 rounded bg-thyn-surface border border-thyn-border">
                      {cmd.shortcut}
                    </kbd>
                  )}
                </button>
              ))}

              {filtered.length === 0 && (
                <div className="px-3 py-8 text-center text-sm text-thyn-muted">
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useCommandBar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { isOpen, setIsOpen };
}
