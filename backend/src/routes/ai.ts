import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";
import { analyzeWithOpenAI } from "../services/openai.service.js";
import { analyzeWithGemini } from "../services/gemini.service.js";
import { sanitizeString } from "../utils/sanitize.js";

const prisma = new PrismaClient();

const analyzeSchema = z.object({
  mode: z.enum(["summary", "tasks", "email", "flashcards", "rewrite", "analyze"]),
  page: z.object({
    url: z.string().max(2000),
    title: z.string().max(500),
    text: z.string().max(30000).optional(),
    selection: z.string().max(10000).optional(),
    description: z.string().max(1000).optional(),
    pageType: z.string().max(50).optional(),
  }),
  tone: z.string().max(50).optional(),
});

const compareSchema = z.object({
  pages: z.array(
    z.object({
      url: z.string().max(2000),
      title: z.string().max(500),
      text: z.string().max(30000).optional(),
    })
  ).min(2).max(10),
});

const askSchema = z.object({
  page: z.object({
    url: z.string().max(2000),
    title: z.string().max(500),
    text: z.string().max(30000).optional(),
  }),
  question: z.string().min(1).max(2000),
});

export async function aiRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authMiddleware);

  app.post("/analyze", async (request, reply) => {
    const body = analyzeSchema.parse(request.body);

    // SECURITY: Sanitize all input strings
    const sanitizedPage = {
      url: sanitizeString(body.page.url, 2000),
      title: sanitizeString(body.page.title, 500),
      text: body.page.text ? sanitizeString(body.page.text, 30000) : "",
      selection: body.page.selection ? sanitizeString(body.page.selection, 10000) : "",
      description: body.page.description ? sanitizeString(body.page.description, 1000) : "",
      pageType: body.page.pageType ? sanitizeString(body.page.pageType, 50) : "",
    };

    const model = body.mode === "flashcards" ? "gemini" : "openai";

    let result: any;
    if (model === "gemini") {
      result = await analyzeWithGemini(body.mode, sanitizedPage, body.tone);
    } else {
      result = await analyzeWithOpenAI(body.mode, sanitizedPage, body.tone);
    }

    if (result?.securityWarning) {
      return { ok: true, data: result, warning: "Content was sanitized for safety" };
    }

    if (body.mode === "summary") {
      const capture = await prisma.capture.findFirst({
        where: { url: sanitizedPage.url, userId: request.user!.userId },
        orderBy: { capturedAt: "desc" },
      });

      if (capture && result?.summary) {
        await prisma.summary.create({
          data: {
            captureId: capture.id,
            userId: request.user!.userId,
            model,
            content: String(result.summary).slice(0, 10000),
            tasks: Array.isArray(result.tasks) ? result.tasks.map(String) : [],
            keyPoints: Array.isArray(result.keyPoints) ? result.keyPoints.map(String) : [],
          },
        });
      }
    }

    await prisma.usage.create({
      data: {
        userId: request.user!.userId,
        action: `ai_${body.mode}`,
      },
    });

    return { ok: true, data: result };
  });

  app.post("/compare", async (request) => {
    const body = compareSchema.parse(request.body);

    const sanitizedText = body.pages
      .map((p) => `[${sanitizeString(p.title, 500)}](${sanitizeString(p.url, 2000)}): ${sanitizeString(p.text || "", 2000)}`)
      .join("\n\n");

    const result = await analyzeWithOpenAI("compare", {
      url: "",
      title: "Tab Comparison",
      text: sanitizedText,
    });

    return { ok: true, data: result };
  });

  app.post("/ask", async (request) => {
    const body = askSchema.parse(request.body);

    const sanitizedText = sanitizeString(body.page.text || "", 10000);
    const sanitizedQuestion = sanitizeString(body.question, 2000);

    const prompt = `Based on this page content:\n\n${sanitizedText}\n\nAnswer the following question concisely:\n${sanitizedQuestion}`;

    const result = await analyzeWithOpenAI("custom", { url: "", title: "", text: prompt });

    return { ok: true, data: result };
  });
}
