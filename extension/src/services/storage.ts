const STATE_KEY = "thyn_state";
const SETTINGS_KEY = "thyn_settings";
const AUTH_KEY = "thyn_auth";

export interface ThynState {
  captures: Capture[];
  summaries: Summary[];
  tasks: Task[];
  tags: Tag[];
  queue: SyncAction[];
}

export interface Capture {
  id: string;
  url: string;
  title: string;
  text?: string;
  selection?: string;
  description?: string;
  pageType?: string;
  capturedAt: number;
  synced: boolean;
}

export interface Summary {
  id: string;
  url: string;
  title: string;
  summary?: string;
  tasks?: string[];
  generatedAt: number;
}

export interface Task {
  id: string;
  text: string;
  done: boolean;
  sourceUrl?: string;
  sourceTitle?: string;
  createdAt: number;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface SyncAction {
  type: string;
  payload: any;
  timestamp: number;
  synced: boolean;
}

export async function loadState(): Promise<ThynState> {
  const data = await chrome.storage.local.get(STATE_KEY);
  return (
    data[STATE_KEY] || {
      captures: [],
      summaries: [],
      tasks: [],
      tags: [],
      queue: [],
    }
  );
}

export async function saveState(state: ThynState) {
  await chrome.storage.local.set({ [STATE_KEY]: state });
}

export async function appendCapture(capture: Capture) {
  const state = await loadState();
  state.captures.unshift(capture);
  state.queue.push({
    type: "capture",
    payload: capture,
    timestamp: Date.now(),
    synced: false,
  });
  await saveState(state);
}

export async function appendSummary(summary: Summary) {
  const state = await loadState();
  state.summaries.unshift(summary);
  await saveState(state);
}

export async function addTask(task: Task) {
  const state = await loadState();
  state.tasks.unshift(task);
  await saveState(state);
}

export async function toggleTask(taskId: string) {
  const state = await loadState();
  const task = state.tasks.find((t) => t.id === taskId);
  if (task) task.done = !task.done;
  await saveState(state);
}

export async function deleteTask(taskId: string) {
  const state = await loadState();
  state.tasks = state.tasks.filter((t) => t.id !== taskId);
  await saveState(state);
}

export async function clearCaptures() {
  const state = await loadState();
  state.captures = [];
  await saveState(state);
}

export async function loadSettings(): Promise<Record<string, any>> {
  const data = await chrome.storage.sync.get(SETTINGS_KEY);
  return data[SETTINGS_KEY] || {};
}

export async function saveSettings(settings: Record<string, any>) {
  await chrome.storage.sync.set({ [SETTINGS_KEY]: settings });
}

export async function getPendingSyncActions(): Promise<SyncAction[]> {
  const state = await loadState();
  return state.queue.filter((q) => !q.synced);
}

export async function markSynced(timestamps: number[]) {
  const state = await loadState();
  state.queue = state.queue.map((q) =>
    timestamps.includes(q.timestamp) ? { ...q, synced: true } : q
  );
  await saveState(state);
}
