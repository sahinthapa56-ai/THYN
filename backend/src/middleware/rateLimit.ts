import type { FastifyRequest, FastifyReply } from "fastify";

const requestCounts = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 100;

export async function rateLimitMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const key = request.ip || "unknown";
  const now = Date.now();

  let entry = requestCounts.get(key);

  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    requestCounts.set(key, entry);
  }

  entry.count++;

  reply.header("X-RateLimit-Limit", MAX_REQUESTS);
  reply.header("X-RateLimit-Remaining", Math.max(0, MAX_REQUESTS - entry.count));
  reply.header("X-RateLimit-Reset", entry.resetAt);

  if (entry.count > MAX_REQUESTS) {
    return reply.status(429).send({ error: "Too many requests" });
  }
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of requestCounts) {
    if (now > entry.resetAt) requestCounts.delete(key);
  }
}, 60_000);
