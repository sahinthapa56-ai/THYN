import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";
import crypto from "crypto";

const prisma = new PrismaClient();

const shareSchema = z.object({
  captureId: z.string(),
  expiresInDays: z.number().optional(),
});

export async function shareRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authMiddleware);

  app.post("/", async (request) => {
    const body = shareSchema.parse(request.body);

    const capture = await prisma.capture.findFirst({
      where: { id: body.captureId, userId: request.user!.userId },
    });

    if (!capture) {
      return { ok: false, error: "Capture not found" };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = body.expiresInDays
      ? new Date(Date.now() + body.expiresInDays * 86400000)
      : null;

    const link = await prisma.shareLink.create({
      data: {
        captureId: body.captureId,
        token,
        expiresAt,
      },
    });

    return {
      ok: true,
      data: {
        url: `https://thyn.app/share/${link.token}`,
        token: link.token,
        expiresAt: link.expiresAt,
      },
    };
  });

  app.get("/:token", async (request, reply) => {
    const { token } = request.params as { token: string };

    const link = await prisma.shareLink.findUnique({
      where: { token },
      include: { capture: true },
    });

    if (!link) {
      return reply.status(404).send({ error: "Share link not found" });
    }

    if (link.expiresAt && link.expiresAt < new Date()) {
      return reply.status(410).send({ error: "Share link has expired" });
    }

    await prisma.shareLink.update({
      where: { id: link.id },
      data: { views: { increment: 1 } },
    });

    return { ok: true, data: link.capture };
  });

  app.delete<{ Params: { id: string } }>("/:id", async (request) => {
    await prisma.shareLink.deleteMany({
      where: { captureId: request.params.id },
    });

    return { ok: true };
  });
}
