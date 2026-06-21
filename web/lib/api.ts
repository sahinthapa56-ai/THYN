import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Backend API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `API ${res.status}`);
  }
  return res.json();
}

// --- Contacts ---
export async function getContacts() {
  return apiFetch<{ contacts: any[] }>("/contacts");
}

export async function getContact(id: string) {
  return apiFetch<{ contact: any }>(`/contacts/${id}`);
}

export async function createContact(data: {
  linkedinUrl: string;
  name: string;
  headline?: string;
  company?: string;
  position?: string;
  location?: string;
  avatarUrl?: string;
  summary?: string;
}) {
  return apiFetch<{ contact: any }>("/contacts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteContact(id: string) {
  return apiFetch<{ ok: boolean }>(`/contacts/${id}`, { method: "DELETE" });
}

// --- Notes ---
export async function getNotes(contactId: string) {
  return apiFetch<{ notes: any[] }>(`/notes/contact/${contactId}`);
}

export async function createNote(contactId: string, content: string) {
  return apiFetch<{ note: any }>("/notes", {
    method: "POST",
    body: JSON.stringify({ contactId, content }),
  });
}

export async function deleteNote(id: string) {
  return apiFetch<{ ok: boolean }>(`/notes/${id}`, { method: "DELETE" });
}

// --- Reminders ---
export async function getReminders(upcoming?: boolean) {
  const qs = upcoming ? "?upcoming=true" : "";
  return apiFetch<{ reminders: any[] }>(`/reminders${qs}`);
}

export async function createReminder(data: {
  contactId: string;
  title: string;
  note?: string;
  dueAt: string;
}) {
  return apiFetch<{ reminder: any }>("/reminders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function markReminderDone(id: string) {
  return apiFetch<{ ok: boolean }>(`/reminders/${id}/done`, {
    method: "PUT",
  });
}

export async function deleteReminder(id: string) {
  return apiFetch<{ ok: boolean }>(`/reminders/${id}`, { method: "DELETE" });
}
