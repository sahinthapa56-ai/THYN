// SECURITY: Server-side sanitization and prompt injection detection

const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const PHONE_REGEX = /\b(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g;
const SSN_REGEX = /\b\d{3}-\d{2}-\d{4}\b/g;
const CARD_REGEX = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g;
const CRYPTO_REGEX = /\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b/g;
const API_KEY_REGEX = /\b(sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{36,}|[A-Za-z0-9+/]{40,}={0,2})\b/g;

// Prompt injection detection patterns
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|below)/i,
  /forget\s+(all\s+)?(previous|instructions)/i,
  /you\s+are\s+(now|free|an?\s+AI)/i,
  /act\s+as\s+(if|though)/i,
  /do\s+not\s+(follow|obey)/i,
  /disregard/i,
  /system\s+prompt/i,
  /override/i,
  /reveal\s+(your|the)\s+(instructions|prompt|system)/i,
  /print\s+(your|the)\s+(instructions|prompt)/i,
  /output\s+(your|the)\s+(instructions|prompt)/i,
  /new\s+instructions/i,
  /role\s+play/i,
  /pretend/i,
  /jailbreak/i,
  /\/\/\/ignore/i,
];

export function sanitizeForAI(text: string): string {
  return text
    .replace(/<[^>]*>/g, "")                         // Strip HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")    // Strip control chars
    .replace(EMAIL_REGEX, "[EMAIL REDACTED]")
    .replace(PHONE_REGEX, "[PHONE REDACTED]")
    .replace(SSN_REGEX, "[SSN REDACTED]")
    .replace(CARD_REGEX, "[CARD REDACTED]")
    .replace(CRYPTO_REGEX, "[CRYPTO REDACTED]")
    .replace(API_KEY_REGEX, "[API KEY REDACTED]")
    .trim();
}

export function detectPromptInjection(text: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(text));
}

export function validateInput(value: any, schema: Record<string, string>): boolean {
  for (const [key, type] of Object.entries(schema)) {
    if (value[key] === undefined) return false;
    if (type === "string" && typeof value[key] !== "string") return false;
    if (type === "number" && typeof value[key] !== "number") return false;
    if (type === "array" && !Array.isArray(value[key])) return false;
    if (type === "object" && (typeof value[key] !== "object" || value[key] === null)) return false;
  }
  return true;
}

export function sanitizeString(str: string, maxLength = 5000): string {
  return String(str)
    .replace(/<[^>]*>/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
    .trim()
    .slice(0, maxLength);
}
