import type { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken } from "../services/supabase.service.js";

export interface AuthenticatedRequest extends FastifyRequest {
  userId?: string;
  email?: string;
}

export async function authMiddleware(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return reply.status(401).send({ error: "Missing or invalid token" });
  }

  const token = authHeader.slice(7);
  const user = await verifyToken(token);
  if (!user) {
    return reply.status(401).send({ error: "Invalid or expired token" });
  }

  request.userId = user.id;
  request.email = user.email || undefined;
}
