import "dotenv/config";

export const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  nodeEnv: process.env.NODE_ENV || "development",

  database: {
    url: process.env.DATABASE_URL || "postgresql://localhost:5432/thyn",
  },

  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET || "dev-secret-change-in-production",
    googleClientId: process.env.GOOGLE_CLIENT_ID || "",
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  },

  ai: {
    openaiKey: process.env.OPENAI_API_KEY || "",
    geminiKey: process.env.GEMINI_API_KEY || "",
    claudeKey: process.env.CLAUDE_API_KEY || "",
  },

  storage: {
    endpoint: process.env.S3_ENDPOINT || "",
    accessKey: process.env.S3_ACCESS_KEY || "",
    secretKey: process.env.S3_SECRET_KEY || "",
    bucket: process.env.S3_BUCKET || "thyn-exports",
  },

  cors: {
    allowedOrigins: (process.env.ALLOWED_ORIGINS || "*").split(","),
  },
};
