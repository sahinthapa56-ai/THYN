/// <reference types="chrome" />

const API_BASE = "http://localhost:3001";

// ── Init ──────────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  console.log("[THYN] Extension installed — LinkedIn Memory.");
});

// Open side panel on toolbar click
chrome.action.onClicked.addListener(async (tab) => {
  if (tab?.id) await chrome.sidePanel.open({ tabId: tab.id });
});

// Open side panel keyboard shortcut
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "open-sidepanel") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) await chrome.sidePanel.open({ tabId: tab.id });
  }
});

// ── Content script messaging ──────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      switch (message.type) {
        case "LINKEDIN_PROFILE":
          // Forward LinkedIn profile to side panel
          await chrome.storage.local.set({ linkedinProfile: message.payload });
          sendResponse({ ok: true });
          break;

        case "SYNC_SESSION":
          // Store access token from popup/web
          if (message.payload?.access_token) {
            await chrome.storage.local.set({ thyn_token: message.payload.access_token });
          }
          sendResponse({ ok: true });
          break;

        case "GET_TOKEN":
          const { thyn_token } = await chrome.storage.local.get("thyn_token");
          sendResponse({ ok: true, token: thyn_token });
          break;

        case "GET_LINKEDIN_PROFILE":
          const { linkedinProfile } = await chrome.storage.local.get("linkedinProfile");
          sendResponse({ ok: true, profile: linkedinProfile });
          break;

        case "CLEAR_TOKEN":
          await chrome.storage.local.set({ thyn_token: null });
          sendResponse({ ok: true });
          break;

        default:
          sendResponse({ ok: false, error: "Unknown message" });
      }
    } catch (err) {
      sendResponse({ ok: false, error: String(err) });
    }
  })();
  return true;
});
