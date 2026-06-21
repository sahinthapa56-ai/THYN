import type { FastifyInstance } from "fastify";
import prisma from "../lib/prisma.js";
import { getSupabase } from "../services/supabase.service.js";

export function authRoutes(app: FastifyInstance) {
  // Return Supabase config for the client
  app.get("/providers", async () => {
    return {
      supabaseUrl: process.env.SUPABASE_URL || "",
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
    };
  });

  // Exchange Supabase session token and upsert profile
  app.post("/session", async (request, reply) => {
    const { access_token } = request.body as { access_token: string };
    if (!access_token) {
      return reply.status(401).send({ error: "No access token provided" });
    }

    const {
      data: { user },
      error,
    } = await getSupabase().auth.getUser(access_token);
    if (error || !user) {
      return reply.status(401).send({ error: "Invalid token" });
    }

    // Upsert profile
    const profile = await prisma.profile.upsert({
      where: { email: user.email! },
      update: {
        name: user.user_metadata?.full_name || user.email,
        avatar: user.user_metadata?.avatar_url,
      },
      create: {
        email: user.email!,
        name: user.user_metadata?.full_name || user.email,
        avatar: user.user_metadata?.avatar_url,
        supabaseId: user.id,
      },
    });

    return { profile, user: { id: user.id, email: user.email } };
  });

  // Get current user profile
  app.get("/me", async (request, reply) => {
    const auth = request.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      return reply.status(401).send({ error: "No token provided" });
    }
    const token = auth.slice(7);

    const {
      data: { user },
      error,
    } = await getSupabase().auth.getUser(token);
    if (error || !user) {
      return reply.status(401).send({ error: "Invalid token" });
    }

    const profile = await prisma.profile.findUnique({
      where: { supabaseId: user.id },
    });
    if (!profile) {
      return reply.status(404).send({ error: "Profile not found" });
    }

    return { profile };
  });

  // Logout (just invalidates token client-side; Supabase handles the rest)
  app.delete("/session", async (_request, reply) => {
    return { ok: true };
  });
}
