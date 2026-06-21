import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";

const prisma = new PrismaClient();

const createSchema = z.object({
  name: z.string().min(1),
});

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "member"]).optional(),
});

export async function workspaceRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authMiddleware);

  app.post("/", async (request) => {
    const body = createSchema.parse(request.body);
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const workspace = await prisma.workspace.create({
      data: {
        name: body.name,
        slug,
        members: {
          create: {
            userId: request.user!.userId,
            role: "admin",
          },
        },
      },
    });

    return { ok: true, data: workspace };
  });

  app.get("/", async (request) => {
    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: { userId: request.user!.userId },
        },
      },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
        },
        _count: { select: { captures: true, tasks: true } },
      },
    });

    return { ok: true, data: workspaces };
  });

  app.get<{ Params: { id: string } }>("/:id", async (request) => {
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: request.params.id,
        members: { some: { userId: request.user!.userId } },
      },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
        },
        captures: { where: { deleted: false }, orderBy: { capturedAt: "desc" }, take: 50 },
        tasks: { orderBy: { createdAt: "desc" }, take: 50 },
      },
    });

    if (!workspace) {
      return { ok: false, error: "Workspace not found" };
    }

    return { ok: true, data: workspace };
  });

  app.post<{ Params: { id: string } }>("/:id/invite", async (request, reply) => {
    const body = inviteSchema.parse(request.body);

    const member = await prisma.user.findUnique({ where: { email: body.email } });
    if (!member) {
      return reply.status(404).send({ error: "User not found" });
    }

    const existing = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: member.id, workspaceId: request.params.id } },
    });

    if (existing) {
      return reply.status(409).send({ error: "User already in workspace" });
    }

    await prisma.workspaceMember.create({
      data: {
        userId: member.id,
        workspaceId: request.params.id,
        role: body.role || "member",
      },
    });

    return { ok: true };
  });

  app.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const membership = await prisma.workspaceMember.findFirst({
      where: { workspaceId: request.params.id, userId: request.user!.userId, role: "admin" },
    });

    if (!membership) {
      return reply.status(403).send({ error: "Only admins can delete workspaces" });
    }

    await prisma.workspace.delete({ where: { id: request.params.id } });
    return { ok: true };
  });
}
