import type { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";

interface JwtPayload {
  userId: string;
  email: string;
  plan: string;
}

declare module "fastify" {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return reply.status(401).send({ error: "Missing authorization token" });
  }

  try {
    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, config.auth.jwtSecret) as JwtPayload;
    request.user = decoded;
  } catch {
    return reply.status(401).send({ error: "Invalid or expired token" });
  }
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.auth.jwtSecret, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, config.auth.jwtSecret) as JwtPayload;
  } catch {
    return null;
  }
}
