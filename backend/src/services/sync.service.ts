import { PrismaClient } from "@prisma/client";
import { saveCaptureBatch } from "./capture.service.js";

const prisma = new PrismaClient();

interface SyncAction {
  type: "capture" | "summary" | "task" | "delete";
  payload: any;
  timestamp: number;
}

export async function processSyncBatch(actions: SyncAction[], userId: string) {
  const results: any[] = [];

  for (const action of actions) {
    switch (action.type) {
      case "capture": {
        const capture = await saveCapture({
          ...action.payload,
          userId,
        });
        results.push({ type: "capture", id: capture.id, status: "created" });
        break;
      }

      case "task": {
        const task = await prisma.task.create({
          data: {
            text: action.payload.text,
            done: action.payload.done || false,
            sourceUrl: action.payload.sourceUrl,
            sourceTitle: action.payload.sourceTitle,
            userId,
          },
        });
        results.push({ type: "task", id: task.id, status: "created" });
        break;
      }

      case "delete": {
        if (action.payload.captureId) {
          await prisma.capture.update({
            where: { id: action.payload.captureId },
            data: { deleted: true },
          });
          results.push({ type: "delete", id: action.payload.captureId, status: "deleted" });
        }
        break;
      }

      default:
        results.push({ type: action.type, status: "unknown" });
    }
  }

  return results;
}

export async function getSyncData(userId: string, since: number) {
  const sinceDate = new Date(since);

  const captures = await prisma.capture.findMany({
    where: {
      userId,
      capturedAt: { gt: sinceDate },
      deleted: false,
    },
    orderBy: { capturedAt: "desc" },
  });

  const tasks = await prisma.task.findMany({
    where: {
      userId,
      createdAt: { gt: sinceDate },
    },
    orderBy: { createdAt: "desc" },
  });

  return { captures, tasks };
}
