import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";
import { sanitizeString } from "../utils/sanitize.js";

const prisma = new PrismaClient();

const captureSchema = z.object({
  url: z.string().max(2000),
  title: z.string().max(500),
  text: z.string().max(50000).optional(),
  selection: z.string().max(10000).optional(),
  description: z.string().max(1000).optional(),
  pageType: z.string().max(50).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
});

export async function captureRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authMiddleware);

  app.post("/", async (request, reply) => {
    const body = captureSchema.parse(request.body);

    // Sanitize all input before storing
    const capture = await prisma.capture.create({
      data: {
        url: sanitizeString(body.url, 2000),
        title: sanitizeString(body.title, 500),
        text: body.text ? sanitizeString(body.text, 50000) : null,
        selection: body.selection ? sanitizeString(body.selection, 10000) : null,
        description: body.description ? sanitizeString(body.description, 1000) : null,
        pageType: body.pageType ? sanitizeString(body.pageType, 50) : null,
        tags: (body.tags || []).map((t) => sanitizeString(t, 50)),
        userId: request.user!.userId,
      },
    });

    return { ok: true, data: { id: capture.id, url: capture.url, title: capture.title, capturedAt: capture.capturedAt } };
  });

  app.get("/", async (request) => {
    const captures = await prisma.capture.findMany({
      where: { userId: request.user!.userId, deleted: false },
      orderBy: { capturedAt: "desc" },
      take: 50,
      select: {
        id: true,
        url: true,
        title: true,
        pageType: true,
        tags: true,
        capturedAt: true,
        description: true,
      },
    });

    return { ok: true, data: captures };
  });

  app.get<{ Params: { id: string } }>("/:id", async (request) => {
    const capture = await prisma.capture.findFirst({
      where: { id: request.params.id, userId: request.user!.userId },
      select: {
        id: true,
        url: true,
        title: true,
        pageType: true,
        tags: true,
        capturedAt: true,
        description: true,
        summary: { select: { content: true, tasks: true, generatedAt: true } },
      },
    });

    if (!capture) {
      return { ok: false, error: "Capture not found" };
    }

    return { ok: true, data: capture };
  });

  app.delete<{ Params: { id: string } }>("/:id", async (request) => {
    await prisma.capture.update({
      where: { id: request.params.id },
      data: { deleted: true },
    });

    return { ok: true };
  });

  app.post("/batch", async (request) => {
    const body = z.array(captureSchema).max(50).parse(request.body);

    const captures = await Promise.all(
      body.map((c) =>
        prisma.capture.create({
          data: {
            url: sanitizeString(c.url, 2000),
            title: sanitizeString(c.title, 500),
            text: c.text ? sanitizeString(c.text, 50000) : null,
            selection: c.selection ? sanitizeString(c.selection, 10000) : null,
            description: c.description ? sanitizeString(c.description, 1000) : null,
            pageType: c.pageType ? sanitizeString(c.pageType, 50) : null,
            tags: (c.tags || []).map((t) => sanitizeString(t, 50)),
            userId: request.user!.userId,
          },
        })
      )
    );

    return { ok: true, data: captures.map((c) => ({ id: c.id })) };
  });
}
