import type { FastifyInstance } from "fastify";
import { config } from "../config/index.js";
import { getSupabase, getServiceSupabase } from "../services/supabase.service.js";

export function authRoutes(app: FastifyInstance) {
  // Return Supabase OAuth config for the client
  app.get("/providers", async () => ({
    supabaseUrl: config.supabase.url,
    anonKey: config.supabase.anonKey,
  }));

  // Exchange a Supabase session for a local profile (upsert)
  app.post("/session", async (request, reply) => {
    const { access_token } = request.body as { access_token?: string };
    if (!access_token) {
      return reply.status(400).send({ error: "access_token required" });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase.auth.getUser(access_token);
    if (error || !data.user) {
      return reply.status(401).send({ error: "Invalid token" });
    }

    const su = data.user;
    const prisma = (await import("../lib/prisma.js")).default;

    let profile = await prisma.profile.findUnique({
      where: { supabaseId: su.id },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          supabaseId: su.id,
          email: su.email || "",
          name:
            su.user_metadata?.full_name ||
            su.email?.split("@")[0] ||
            "User",
          avatar: su.user_metadata?.avatar_url || null,
        },
      });
    } else {
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data: {
          email: su.email || profile.email,
          name:
            su.user_metadata?.full_name ||
            su.email?.split("@")[0] ||
            profile.name,
          avatar: su.user_metadata?.avatar_url || profile.avatar,
        },
      });
    }

    return { profile, access_token };
  });

  // Get current user profile from Bearer token
  app.get("/me", async (request, reply) => {
    const auth = request.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase.auth.getUser(auth.slice(7));
    if (error || !data.user) {
      return reply.status(401).send({ error: "Invalid token" });
    }

    const prisma = (await import("../lib/prisma.js")).default;
    const profile = await prisma.profile.findUnique({
      where: { supabaseId: data.user.id },
    });
    if (!profile) {
      return reply.status(404).send({ error: "Profile not found" });
    }

    return { user: profile };
  });

  // Logout — client-side (Supabase handles session), just ack
  app.post("/logout", async () => ({ ok: true }));
}
