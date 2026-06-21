import { apiPost } from "./api";
import { getPendingSyncActions, markSynced, loadState, saveState } from "./storage";

export async function syncToServer() {
  const pending = await getPendingSyncActions();
  if (!pending.length) return;

  try {
    await apiPost("/sync/batch", { actions: pending });
    await markSynced(pending.map((p) => p.timestamp));
    console.log(`Synced ${pending.length} actions`);
  } catch (err) {
    console.warn("Sync failed, will retry later:", err);
  }
}

export async function pullFromServer() {
  try {
    const data = await apiPost<{ captures: any[]; summaries: any[]; tasks: any[] }>("/sync/pull", {
      lastSync: Date.now(),
    });

    if (!data) return;

    const state = await loadState();

    if (data.captures?.length) {
      const existingUrls = new Set(state.captures.map((c) => c.url));
      const newCaptures = data.captures.filter((c: any) => !existingUrls.has(c.url));
      state.captures = [...newCaptures, ...state.captures];
    }

    if (data.tasks?.length) {
      state.tasks = [...data.tasks, ...state.tasks];
    }

    await saveState(state);
  } catch (err) {
    console.warn("Pull from server failed:", err);
  }
}

export async function fullSync() {
  await syncToServer();
  await pullFromServer();
}
