// Security utilities — PII redaction, input validation, domain allowlisting

const SENSITIVE_DOMAINS = [
  "bankofamerica.com", "chase.com", "wellsfargo.com", "citibank.com",
  "capitalone.com", "usbank.com", "paypal.com", "venmo.com",
  "login.gov", "healthcare.gov", "medicare.gov",
  "ssa.gov", "irs.gov", "turbotax.com",
  "mail.google.com", "outlook.live.com", "outlook.office.com",
  "accounts.google.com", "login.microsoftonline.com",
  "myaccount.google.com", "passwordreset.microsoft.com",
  "amazon.com/ap/", "ebay.com/signin", "etsy.com/signin",
  "docusign.com", "hellosign.com",
  "github.com/settings", "gitlab.com/-/profile",
  "netflix.com/login", "spotify.com/account",
];

const PHONE_REGEX = /\b(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g;
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const SSN_REGEX = /\b\d{3}-\d{2}-\d{4}\b/g;
const CARD_REGEX = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g;
const CRYPTO_REGEX = /\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b/g;
const API_KEY_REGEX = /\b(sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{36,}|[A-Za-z0-9+/]{40,}={0,2})\b/g;

export function isSensitiveDomain(url: string): boolean {
  try {
    const parsed = new URL(url);
    return SENSITIVE_DOMAINS.some((d) => parsed.hostname.includes(d));
  } catch {
    return false;
  }
}

export function redactPII(text: string): string {
  return text
    .replace(PHONE_REGEX, "[PHONE REDACTED]")
    .replace(EMAIL_REGEX, "[EMAIL REDACTED]")
    .replace(SSN_REGEX, "[SSN REDACTED]")
    .replace(CARD_REGEX, "[CARD REDACTED]")
    .replace(CRYPTO_REGEX, "[CRYPTO REDACTED]")
    .replace(API_KEY_REGEX, "[API KEY REDACTED]");
}

export function sanitizeText(text: string, maxLength = 30000): string {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
    .trim()
    .slice(0, maxLength);
}

export function validateMessageType(type: string): boolean {
  const allowedTypes = [
    "OPEN_PANEL", "CAPTURE_PAGE", "SUMMARIZE_PAGE",
    "EXTRACT_TASKS", "GENERATE_EMAIL",
    "GET_LAST_CAPTURE", "GET_LAST_SUMMARY",
    "GET_STATE", "SAVE_STATE",
  ];
  return allowedTypes.includes(type);
}

export function sanitizeForAI(text: string): string {
  return redactPII(sanitizeText(text, 15000));
}

export function isContentScriptRequest(sender: chrome.runtime.MessageSender): boolean {
  return sender.id === chrome.runtime.id;
}

const msgRateLimiter = new Map<string, number>();
const RATE_LIMIT_WINDOW = 1000;
const RATE_LIMIT_MAX = 10;

export function checkRateLimit(senderId: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  for (const [key, time] of msgRateLimiter) {
    if (time < windowStart) msgRateLimiter.delete(key);
  }

  const count = Array.from(msgRateLimiter.values()).filter((t) => t >= windowStart).length;
  if (count >= RATE_LIMIT_MAX) return false;

  msgRateLimiter.set(senderId, now);
  return true;
}
