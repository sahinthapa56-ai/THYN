import { isSensitiveDomain, sanitizeForAI, validateMessageType, isContentScriptRequest, checkRateLimit } from "../utils/sanitize";

const API_BASE = "https://api.thyn.app";

const SENSITIVE_SITE_WARNING = "This page appears to be a sensitive site (banking, email, or login). THYN has skipped capture for your privacy. You can disable this protection in Settings.";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "thyn-capture",
    title: "Capture with THYN",
    contexts: ["page", "selection", "link"],
  });

  chrome.contextMenus.create({
    id: "thyn-summarize",
    title: "Summarize with THYN",
    contexts: ["page", "selection"],
  });

  chrome.alarms.create("daily-digest", { periodInMinutes: 24 * 60 });
  chrome.alarms.create("sync-queue", { periodInMinutes: 1 });
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "open-sidepanel") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) await chrome.sidePanel.open({ tabId: tab.id });
  }

  if (command === "capture-page") {
    await handleCapture();
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  if (tab?.id) await chrome.sidePanel.open({ tabId: tab.id });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "thyn-capture") {
    await handleCapture(tab);
  }
  if (info.menuItemId === "thyn-summarize") {
    await handleSummarize(tab);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      if (!isContentScriptRequest(sender)) {
        sendResponse({ ok: false, error: "Unauthorized sender" });
        return;
      }

      if (!validateMessageType(message.type)) {
        sendResponse({ ok: false, error: "Unknown message type" });
        return;
      }

      if (!checkRateLimit(sender.id || "unknown")) {
        sendResponse({ ok: false, error: "Rate limit exceeded" });
        return;
      }

      if (message.type === "SAVE_STATE" && typeof message.payload !== "object") {
        sendResponse({ ok: false, error: "Invalid payload" });
        return;
      }

      switch (message.type) {
        case "OPEN_PANEL": {
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          if (tab?.id) await chrome.sidePanel.open({ tabId: tab.id });
          sendResponse({ ok: true });
          break;
        }

        case "CAPTURE_PAGE": {
          const result = await handleCapture();
          sendResponse(result);
          break;
        }

        case "SUMMARIZE_PAGE": {
          const result = await handleSummarize();
          sendResponse(result);
          break;
        }

        case "EXTRACT_TASKS": {
          const result = await handleExtractTasks();
          sendResponse(result);
          break;
        }

        case "GENERATE_EMAIL": {
          const result = await handleGenerateEmail();
          sendResponse(result);
          break;
        }

        case "GET_LAST_CAPTURE": {
          const data = await chrome.storage.local.get(["lastCapture"]);
          sendResponse({ ok: true, data: data.lastCapture || null });
          break;
        }

        case "GET_LAST_SUMMARY": {
          const data = await chrome.storage.local.get(["lastSummary"]);
          sendResponse({ ok: true, data: data.lastSummary || null });
          break;
        }

        case "GET_STATE": {
          const data = await chrome.storage.local.get(["thyn_state"]);
          sendResponse({ ok: true, data: data.thyn_state || null });
          break;
        }

        case "SAVE_STATE": {
          await chrome.storage.local.set({ thyn_state: message.payload });
          sendResponse({ ok: true });
          break;
        }

        default:
          sendResponse({ ok: false, error: "Unknown message type" });
      }
    } catch (err) {
      sendResponse({ ok: false, error: "Internal error" });
    }
  })();

  return true;
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "daily-digest") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "THYN Daily Digest",
      message: "You have captures waiting to be reviewed.",
    });
  }

  if (alarm.name === "sync-queue") {
    await processSyncQueue();
  }
});

async function getPageContext(tab?: chrome.tabs.Tab) {
  const target = tab || (await chrome.tabs.query({ active: true, currentWindow: true }))[0];
  if (!target?.id) return null;

  try {
    const response = await chrome.tabs.sendMessage(target.id, { type: "GET_PAGE_CONTEXT" });
    if (!response?.ok) return null;
    return response;
  } catch {
    try {
      const result = await chrome.scripting.executeScript({
        target: { tabId: target.id },
        func: () => {
          const sel = window.getSelection();
          return {
            ok: true,
            url: location.href,
            title: document.title,
            selection: sel ? String(sel.toString()).trim() : "",
            text: (document.body?.innerText || "").slice(0, 30000),
            description: document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
          };
        },
      });
      return result?.[0]?.result || null;
    } catch {
      return null;
    }
  }
}

async function handleCapture(tab?: chrome.tabs.Tab) {
  const page = await getPageContext(tab);
  if (!page?.ok) return { ok: false, error: "Could not read page" };

  if (isSensitiveDomain(page.url)) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "THYN Privacy",
      message: SENSITIVE_SITE_WARNING,
    });
    return { ok: false, error: "Sensitive domain skipped" };
  }

  const sanitizedText = sanitizeForAI(page.text || "");
  const sanitizedSelection = sanitizeForAI(page.selection || "");

  const capture = {
    id: crypto.randomUUID(),
    url: page.url,
    title: String(page.title).slice(0, 500),
    text: sanitizedText,
    selection: sanitizedSelection,
    description: String(page.description || "").slice(0, 500),
    capturedAt: Date.now(),
    source: "capture",
  };

  const state = await loadState();
  state.captures.unshift(capture);
  await saveState(state);

  await chrome.storage.local.set({ lastCapture: capture });

  queueSync({ type: "capture", payload: capture });

  return { ok: true, data: capture };
}

async function handleSummarize(tab?: chrome.tabs.Tab) {
  const page = await getPageContext(tab);
  if (!page?.ok) return { ok: false, error: "Could not read page" };

  if (isSensitiveDomain(page.url)) {
    return { ok: false, error: "Sensitive domain skipped" };
  }

  const state = await loadState();
  const cached = state.summaries?.find((s: any) => s.url === page.url);
  if (cached) return { ok: true, data: cached };

  const safePayload = {
    mode: "summary",
    page: {
      url: page.url,
      title: String(page.title).slice(0, 500),
      text: sanitizeForAI(page.text || "").slice(0, 15000),
      selection: sanitizeForAI(page.selection || "").slice(0, 5000),
    },
  };

  try {
    const res = await fetch(`${API_BASE}/ai/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(safePayload),
    });

    if (!res.ok) return { ok: false, error: "AI service error" };

    const data = await res.json();
    const summary = { ...data, url: page.url, title: page.title, generatedAt: Date.now() };

    state.summaries = state.summaries || [];
    state.summaries.unshift(summary);
    await saveState(state);

    await chrome.storage.local.set({ lastSummary: summary });
    return { ok: true, data: summary };
  } catch {
    return { ok: false, error: "AI request failed" };
  }
}

async function handleExtractTasks(tab?: chrome.tabs.Tab) {
  const page = await getPageContext(tab);
  if (!page?.ok) return { ok: false, error: "Could not read page" };
  if (isSensitiveDomain(page.url)) return { ok: false, error: "Sensitive domain skipped" };

  const safePayload = {
    mode: "tasks",
    page: {
      url: page.url,
      title: String(page.title).slice(0, 500),
      text: sanitizeForAI(page.text || "").slice(0, 15000),
    },
  };

  try {
    const res = await fetch(`${API_BASE}/ai/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(safePayload),
    });

    if (!res.ok) return { ok: false };
    const data = await res.json();
    return { ok: true, data };
  } catch {
    return { ok: false };
  }
}

async function handleGenerateEmail(tab?: chrome.tabs.Tab) {
  const page = await getPageContext(tab);
  if (!page?.ok) return { ok: false, error: "Could not read page" };
  if (isSensitiveDomain(page.url)) return { ok: false, error: "Sensitive domain skipped" };

  const safePayload = {
    mode: "email",
    page: {
      url: page.url,
      title: String(page.title).slice(0, 500),
      text: sanitizeForAI(page.text || "").slice(0, 15000),
    },
  };

  try {
    const res = await fetch(`${API_BASE}/ai/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(safePayload),
    });

    if (!res.ok) return { ok: false };
    const data = await res.json();
    return { ok: true, data };
  } catch {
    return { ok: false };
  }
}

async function loadState() {
  const data = await chrome.storage.local.get("thyn_state");
  return data.thyn_state || { captures: [], summaries: [], tasks: [], tags: [], queue: [] };
}

async function saveState(state: any) {
  await chrome.storage.local.set({ thyn_state: state });
}

async function queueSync(action: any) {
  const state = await loadState();
  state.queue = state.queue || [];
  state.queue.push({ ...action, timestamp: Date.now(), synced: false });
  await saveState(state);
}

async function processSyncQueue() {
  const state = await loadState();
  if (!state.queue?.length) return;

  const pending = state.queue.filter((q: any) => !q.synced);
  if (!pending.length) return;

  try {
    await fetch(`${API_BASE}/sync/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actions: pending }),
    });

    state.queue = state.queue.map((q: any) => ({ ...q, synced: true }));
    await saveState(state);
  } catch {
    // Will retry on next alarm cycle
  }
}
