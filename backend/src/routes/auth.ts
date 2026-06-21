import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../middleware/auth.js";
import { config } from "../config/index.js";

const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

const googleSchema = z.object({
  code: z.string(),
  redirectUri: z.string(),
});

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (request, reply) => {
    const body = registerSchema.parse(request.body);

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return reply.status(409).send({ error: "Email already registered" });
    }

    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      plan: user.plan,
    });

    return { token, user: { id: user.id, email: user.email, name: user.name } };
  });

  app.post("/login", async (request, reply) => {
    const body = loginSchema.parse(request.body);

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      plan: user.plan,
    });

    return { token, user: { id: user.id, email: user.email, name: user.name } };
  });

  app.post("/google", async (request, reply) => {
    const body = googleSchema.parse(request.body);

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: body.code,
        client_id: config.auth.googleClientId,
        client_secret: config.auth.googleClientSecret,
        redirect_uri: body.redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenResponse.json();
    if (!tokens.access_token) {
      return reply.status(401).send({ error: "Google auth failed" });
    }

    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const profile = await profileRes.json();

    let user = await prisma.user.findUnique({ where: { googleId: profile.id } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: profile.email,
          name: profile.name,
          avatar: profile.picture,
          googleId: profile.id,
        },
      });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      plan: user.plan,
    });

    return { token, user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar } };
  });
}
