import crypto from "crypto";

export function generateId(): string {
  return crypto.randomUUID();
}

export function generateToken(length = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

export function sanitizeText(text: string, maxLength = 30000): string {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function redactSensitive(text: string): string {
  return text
    .replace(/\b[\w.-]+@[\w.-]+\.\w+\b/g, "[EMAIL REDACTED]")
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, "[PHONE REDACTED]")
    .replace(/\b(?:\d[ -]*?){13,16}\b/g, "[CARD REDACTED]")
    .replace(/\b(?:[A-Za-z0-9+/]{4}){3,}(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?\b/g, "[TOKEN REDACTED]");
}

export function detectLanguage(text: string): string {
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const japaneseChars = (text.match(/[\u3040-\u309f\u30a0-\u30ff]/g) || []).length;

  if (chineseChars > text.length * 0.1) return "zh";
  if (japaneseChars > text.length * 0.05) return "ja";
  return "en";
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function now(): number {
  return Date.now();
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxAttempts - 1) throw err;
      await sleep(delay * Math.pow(2, i));
    }
  }
  throw new Error("Retry failed");
}
