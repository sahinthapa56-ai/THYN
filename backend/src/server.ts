import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { config } from "./config/index.js";
import { authRoutes } from "./routes/auth.js";
import { contactRoutes } from "./routes/contacts.js";
import { noteRoutes } from "./routes/note.js";
import { reminderRoutes } from "./routes/reminder.js";

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

app.get("/health", async () => ({
  status: "ok",
  version: "1.0.0",
  timestamp: Date.now(),
}));

app.register(authRoutes, { prefix: "/auth" });
app.register(contactRoutes, { prefix: "/contacts" });
app.register(noteRoutes, { prefix: "/notes" });
app.register(reminderRoutes, { prefix: "/reminders" });

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
