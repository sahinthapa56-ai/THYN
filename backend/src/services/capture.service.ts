import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CaptureInput {
  url: string;
  title: string;
  text?: string;
  selection?: string;
  description?: string;
  pageType?: string;
  tags?: string[];
  userId?: string;
}

export async function saveCapture(data: CaptureInput) {
  const capture = await prisma.capture.create({
    data: {
      url: data.url,
      title: data.title,
      text: data.text,
      selection: data.selection,
      description: data.description,
      pageType: data.pageType,
      tags: data.tags || [],
      userId: data.userId,
    },
  });

  return capture;
}

export async function saveCaptureBatch(captures: CaptureInput[]) {
  const results = await Promise.all(
    captures.map((c) => saveCapture(c))
  );

  return results;
}

export async function getCapturesByUser(userId: string, limit = 50, offset = 0) {
  return prisma.capture.findMany({
    where: { userId, deleted: false },
    orderBy: { capturedAt: "desc" },
    take: limit,
    skip: offset,
    include: { summary: true },
  });
}

export async function getCaptureById(id: string, userId?: string) {
  const where: any = { id };
  if (userId) where.userId = userId;

  return prisma.capture.findFirst({
    where,
    include: { summary: true },
  });
}

export async function searchCaptures(userId: string, query: string) {
  return prisma.capture.findMany({
    where: {
      userId,
      deleted: false,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { url: { contains: query, mode: "insensitive" } },
        { text: { contains: query, mode: "insensitive" } },
        { tags: { has: query } },
      ],
    },
    orderBy: { capturedAt: "desc" },
    take: 20,
  });
}

export async function deleteCapture(id: string, userId?: string) {
  const where: any = { id };
  if (userId) where.userId = userId;

  return prisma.capture.updateMany({
    where,
    data: { deleted: true },
  });
}
