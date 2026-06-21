import { create } from "zustand";
import type { Capture, Summary, Task } from "../services/storage";

interface ThynStore {
  captures: Capture[];
  summaries: Summary[];
  tasks: Task[];
  currentCapture: Capture | null;
  currentSummary: Summary | null;
  loading: boolean;
  panelOpen: boolean;
  darkMode: boolean;

  setCaptures: (captures: Capture[]) => void;
  addCapture: (capture: Capture) => void;
  setSummaries: (summaries: Summary[]) => void;
  addSummary: (summary: Summary) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  setCurrentCapture: (capture: Capture | null) => void;
  setCurrentSummary: (summary: Summary | null) => void;
  setLoading: (loading: boolean) => void;
  setPanelOpen: (open: boolean) => void;
  setDarkMode: (dark: boolean) => void;
}

export const useStore = create<ThynStore>((set) => ({
  captures: [],
  summaries: [],
  tasks: [],
  currentCapture: null,
  currentSummary: null,
  loading: false,
  panelOpen: false,
  darkMode: true,

  setCaptures: (captures) => set({ captures }),
  addCapture: (capture) => set((s) => ({ captures: [capture, ...s.captures] })),
  setSummaries: (summaries) => set({ summaries }),
  addSummary: (summary) => set((s) => ({ summaries: [summary, ...s.summaries] })),
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),
  toggleTask: (id) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    })),
  removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
  setCurrentCapture: (capture) => set({ currentCapture: capture }),
  setCurrentSummary: (summary) => set({ currentSummary: summary }),
  setLoading: (loading) => set({ loading }),
  setPanelOpen: (open) => set({ panelOpen: open }),
  setDarkMode: (dark) => set({ darkMode: dark }),
}));
