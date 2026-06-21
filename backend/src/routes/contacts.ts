import type { FastifyInstance } from "fastify";
import { authMiddleware, type AuthenticatedRequest } from "../middleware/auth.js";
import prisma from "../lib/prisma.js";

export function contactRoutes(app: FastifyInstance) {
  // All routes require auth
  app.addHook("preHandler", authMiddleware);

  // List contacts for the current user
  app.get("/", async (request: AuthenticatedRequest, reply) => {
    const profile = await prisma.profile.findUnique({
      where: { supabaseId: request.userId },
    });
    if (!profile) return reply.status(404).send({ error: "Profile not found" });

    const { linkedinUrl } = request.query as { linkedinUrl?: string };

    const where: any = { profileId: profile.id };
    if (linkedinUrl) where.linkedinUrl = linkedinUrl;

    const contacts = await prisma.contact.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { notes: true, reminders: true } } },
    });
    return { contacts };
  });

  // Get a single contact
  app.get("/:id", async (request: AuthenticatedRequest, reply) => {
    const profile = await prisma.profile.findUnique({
      where: { supabaseId: request.userId },
    });
    if (!profile) return reply.status(404).send({ error: "Profile not found" });

    const { id } = request.params as { id: string };
    const contact = await prisma.contact.findFirst({
      where: { id, profileId: profile.id },
      include: {
        notes: { orderBy: { createdAt: "desc" } },
        reminders: { orderBy: { dueAt: "asc" } },
      },
    });
    if (!contact) return reply.status(404).send({ error: "Contact not found" });
    return { contact };
  });

  // Create a contact from LinkedIn profile
  app.post("/", async (request: AuthenticatedRequest, reply) => {
    const profile = await prisma.profile.findUnique({
      where: { supabaseId: request.userId },
    });
    if (!profile) return reply.status(404).send({ error: "Profile not found" });

    const {
      linkedinUrl,
      name,
      headline,
      company,
      position,
      location,
      avatarUrl,
      summary,
      tags,
    } = request.body as {
      linkedinUrl: string;
      name: string;
      headline?: string;
      company?: string;
      position?: string;
      location?: string;
      avatarUrl?: string;
      summary?: string;
      tags?: string[];
    };

    if (!linkedinUrl || !name) {
      return reply.status(400).send({ error: "linkedinUrl and name required" });
    }

    // Check for duplicate
    const existing = await prisma.contact.findUnique({
      where: { linkedinUrl },
    });
    if (existing) {
      return reply.status(409).send({ error: "Contact already exists", contact: existing });
    }

    const contact = await prisma.contact.create({
      data: {
        profileId: profile.id,
        linkedinUrl,
        name,
        headline,
        company,
        position,
        location,
        avatarUrl,
        summary,
        tags: tags || [],
      },
    });

    return reply.status(201).send({ contact });
  });

  // Update a contact
  app.put("/:id", async (request: AuthenticatedRequest, reply) => {
    const profile = await prisma.profile.findUnique({
      where: { supabaseId: request.userId },
    });
    if (!profile) return reply.status(404).send({ error: "Profile not found" });

    const { id } = request.params as { id: string };
    const updates = request.body as Partial<{
      name: string;
      headline: string;
      company: string;
      position: string;
      location: string;
      avatarUrl: string;
      summary: string;
      tags: string[];
    }>;

    const contact = await prisma.contact.updateMany({
      where: { id, profileId: profile.id },
      data: updates,
    });

    if (contact.count === 0) {
      return reply.status(404).send({ error: "Contact not found" });
    }
    return { ok: true };
  });

  // Delete a contact
  app.delete("/:id", async (request: AuthenticatedRequest, reply) => {
    const profile = await prisma.profile.findUnique({
      where: { supabaseId: request.userId },
    });
    if (!profile) return reply.status(404).send({ error: "Profile not found" });

    const { id } = request.params as { id: string };
    const result = await prisma.contact.deleteMany({
      where: { id, profileId: profile.id },
    });

    if (result.count === 0) {
      return reply.status(404).send({ error: "Contact not found" });
    }
    return { ok: true };
  });
}
