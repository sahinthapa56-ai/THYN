import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import websocket from "@fastify/websocket";
import { config } from "./config/index.js";
import { authRoutes } from "./routes/auth.js";
import { captureRoutes } from "./routes/capture.js";
import { aiRoutes } from "./routes/ai.js";
import { workspaceRoutes } from "./routes/workspace.js";
import { shareRoutes } from "./routes/share.js";
import { billingRoutes } from "./routes/billing.js";
import { websocketHandler } from "./websocket/index.js";

const app = Fastify({
  logger: config.nodeEnv !== "test",
});

await app.register(cors, {
  origin: config.cors.allowedOrigins,
  credentials: true,
});

await app.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
});

await app.register(websocket);

app.get("/health", async () => ({
  status: "ok",
  version: "1.0.0",
  timestamp: Date.now(),
}));

app.register(authRoutes, { prefix: "/auth" });
app.register(captureRoutes, { prefix: "/capture" });
app.register(aiRoutes, { prefix: "/ai" });
app.register(workspaceRoutes, { prefix: "/workspace" });
app.register(shareRoutes, { prefix: "/share" });
app.register(billingRoutes, { prefix: "/billing" });

app.register(async function (fastify) {
  fastify.get("/ws", { websocket: true }, websocketHandler);
});

async function start() {
  try {
    await app.listen({ port: config.port, host: "0.0.0.0" });
    console.log(`THYN API running on port ${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();

export default app;
