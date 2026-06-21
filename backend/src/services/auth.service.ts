import { PrismaClient } from "@prisma/client";
import { generateToken, verifyToken } from "../middleware/auth.js";

const prisma = new PrismaClient();

export async function createSession(userId: string, device?: string) {
  const token = generateToken({
    userId,
    email: "",
    plan: "free",
  });

  const expiresAt = new Date(Date.now() + 7 * 86400000);

  await prisma.session.create({
    data: {
      userId,
      token,
      device,
      expiresAt,
    },
  });

  return token;
}

export async function validateSession(token: string) {
  const payload = verifyToken(token);
  if (!payload) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    return null;
  }

  return session.user;
}

export async function revokeSession(token: string) {
  await prisma.session.deleteMany({ where: { token } });
}

export async function revokeAllSessions(userId: string) {
  await prisma.session.deleteMany({ where: { userId } });
}
