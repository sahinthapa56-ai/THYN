import { useState, useEffect, useCallback } from "react";
import { useStore } from "../state/store";
import type { Capture, Summary, Task } from "../services/storage";

export function useCapture() {
  const { addCapture, setCurrentCapture, setLoading } = useStore();
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await chrome.runtime.sendMessage({ type: "CAPTURE_PAGE" });
      if (res?.data) {
        addCapture(res.data);
        setCurrentCapture(res.data);
        return res.data;
      }
      setError(res?.error || "Capture failed");
      return null;
    } catch (err) {
      setError(String(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, [addCapture, setCurrentCapture, setLoading]);

  return { capture, error };
}

export function useSummarize() {
  const { addSummary, setCurrentSummary, setLoading } = useStore();
  const [error, setError] = useState<string | null>(null);

  const summarize = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await chrome.runtime.sendMessage({ type: "SUMMARIZE_PAGE" });
      if (res?.data) {
        addSummary(res.data);
        setCurrentSummary(res.data);
        return res.data;
      }
      setError(res?.error || "Summarize failed");
      return null;
    } catch (err) {
      setError(String(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, [addSummary, setCurrentSummary, setLoading]);

  return { summarize, error };
}

export function useTasks() {
  const { tasks, addTask, toggleTask, removeTask } = useStore();

  const extractTasks = useCallback(async () => {
    const res = await chrome.runtime.sendMessage({ type: "EXTRACT_TASKS" });
    if (res?.data?.tasks) {
      res.data.tasks.forEach((text: string) => {
        addTask({
          id: crypto.randomUUID(),
          text,
          done: false,
          createdAt: Date.now(),
        });
      });
    }
  }, [addTask]);

  return { tasks, extractTasks, toggleTask, removeTask };
}

export function useChromeState() {
  const { setCaptures, setSummaries, setTasks } = useStore();

  useEffect(() => {
    chrome.storage.local.get("thyn_state", (data) => {
      const state = data.thyn_state;
      if (state) {
        if (state.captures) setCaptures(state.captures);
        if (state.summaries) setSummaries(state.summaries);
        if (state.tasks) setTasks(state.tasks);
      }
    });
  }, [setCaptures, setSummaries, setTasks]);
}
