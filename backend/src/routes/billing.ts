import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";

const prisma = new PrismaClient();

const planSchema = z.object({
  plan: z.enum(["free", "pro", "team", "enterprise"]),
});

export async function billingRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authMiddleware);

  app.get("/plans", async () => {
    return {
      ok: true,
      data: [
        {
          id: "free",
          name: "Free",
          price: 0,
          captures: 50,
          aiActions: 10,
          teamMembers: 1,
          features: ["Basic summaries", "Local storage", "Manual export"],
        },
        {
          id: "pro",
          name: "Pro",
          price: 15,
          captures: "unlimited",
          aiActions: 500,
          teamMembers: 1,
          features: ["Unlimited captures", "AI rewrite", "Templates", "Sync", "Share links"],
        },
        {
          id: "team",
          name: "Team",
          price: 30,
          captures: "unlimited",
          aiActions: 2000,
          teamMembers: 10,
          features: ["Shared workspaces", "Comments", "Roles", "Audit trail"],
        },
      ],
    };
  });

  app.post("/subscribe", async (request, reply) => {
    const body = planSchema.parse(request.body);

    const sub = await prisma.subscription.upsert({
      where: { userId: request.user!.userId },
      update: { plan: body.plan, status: "active" },
      create: {
        userId: request.user!.userId,
        plan: body.plan,
        status: "active",
      },
    });

    await prisma.user.update({
      where: { id: request.user!.userId },
      data: { plan: body.plan },
    });

    return { ok: true, data: sub };
  });

  app.get("/subscription", async (request) => {
    const sub = await prisma.subscription.findUnique({
      where: { userId: request.user!.userId },
    });

    return { ok: true, data: sub || { plan: "free", status: "active" } };
  });

  app.post("/cancel", async (request) => {
    await prisma.subscription.update({
      where: { userId: request.user!.userId },
      data: { status: "cancelled" },
    });

    await prisma.user.update({
      where: { id: request.user!.userId },
      data: { plan: "free" },
    });

    return { ok: true };
  });
}
