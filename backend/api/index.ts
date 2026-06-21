// Vercel serverless entry point for Fastify
import { createApp } from "../src/server.js";

let app: Awaited<ReturnType<typeof createApp>> | null = null;

export default async function handler(req: any, res: any) {
  if (!app) {
    app = await createApp();
    await app.ready();
  }
  app.server.emit("request", req, res);
}
