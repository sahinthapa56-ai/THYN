import { apiPost, setToken } from "./api";

// NOTE: Replace with your actual Google OAuth client ID
// Never hardcode API keys or secrets in the extension.
// The client ID is public (part of OAuth2 spec) but client secret stays on backend.
const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

export async function loginWithGoogle(): Promise<{ token: string; user: any } | null> {
  const redirectUri = chrome.identity.getRedirectURL("oauth2");
  const authUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });

  try {
    const responseUrl = await chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true,
    });

    const url = new URL(responseUrl);
    const code = url.searchParams.get("code");
    if (!code) return null;

    const result = await apiPost<{ token: string; user: any }>("/auth/google", {
      code,
      redirectUri,
    });

    await saveSession(result.token, result.user);
    return result;
  } catch {
    return null;
  }
}

export async function loginWithEmail(email: string, password: string) {
  const result = await apiPost<{ token: string; user: any }>("/auth/login", {
    email,
    password,
  });
  await saveSession(result.token, result.user);
  return result;
}

export async function registerWithEmail(email: string, password: string, name: string) {
  const result = await apiPost<{ token: string; user: any }>("/auth/register", {
    email,
    password,
    name,
  });
  await saveSession(result.token, result.user);
  return result;
}

export async function logout() {
  setToken(null);
  // Clear session storage (not persisted to disk)
  await chrome.storage.session.remove("thyn_session");
  // Also clear local storage for non-sensitive cleanup
  await chrome.storage.local.remove("thyn_user_profile");
}

export async function getSession(): Promise<{ token: string; user: any } | null> {
  try {
    const data = await chrome.storage.session.get("thyn_session");
    return data.thyn_session || null;
  } catch {
    return null;
  }
}

export async function saveSession(token: string, user: any) {
  // Store tokens in chrome.storage.session (memory only, not written to disk)
  try {
    await chrome.storage.session.set({ thyn_session: { token, user } });
  } catch {
    // Fallback to local storage if session storage not available
    await chrome.storage.local.set({ thyn_auth: { token, user } });
  }
  // Store non-sensitive profile in local storage
  await chrome.storage.local.set({
    thyn_user_profile: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    },
  });
  setToken(token);
}

export async function getAuthToken(): Promise<string | null> {
  const session = await getSession();
  return session?.token || null;
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  return !!token;
}
