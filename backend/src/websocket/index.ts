import type { FastifyRequest } from "fastify";
import { verifyToken } from "../middleware/auth.js";

interface Client {
  userId: string;
  socket: WebSocket;
}

const clients = new Map<string, Client>();

export function websocketHandler(socket: WebSocket, request: FastifyRequest) {
  const url = new URL(request.url, "http://localhost");
  const token = url.searchParams.get("token");

  if (!token) {
    socket.send(JSON.stringify({ type: "error", message: "Missing token" }));
    socket.close();
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    socket.send(JSON.stringify({ type: "error", message: "Invalid token" }));
    socket.close();
    return;
  }

  const clientId = `${payload.userId}_${Date.now()}`;
  const client: Client = { userId: payload.userId, socket };
  clients.set(clientId, client);

  socket.send(
    JSON.stringify({
      type: "connected",
      userId: payload.userId,
      clientId,
    })
  );

  socket.addEventListener("message", (event) => {
    try {
      const data = JSON.parse(event.data as string);

      switch (data.type) {
        case "ping":
          socket.send(JSON.stringify({ type: "pong" }));
          break;

        case "sync":
          // Broadcast sync event to other clients of same user
          broadcastToUser(payload.userId, {
            type: "sync-requested",
            timestamp: Date.now(),
          });
          break;

        default:
          socket.send(
            JSON.stringify({ type: "error", message: `Unknown type: ${data.type}` })
          );
      }
    } catch {
      socket.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
    }
  });

  socket.addEventListener("close", () => {
    clients.delete(clientId);
  });
}

export function broadcastToUser(userId: string, data: any) {
  const message = JSON.stringify(data);

  for (const [, client] of clients) {
    if (client.userId === userId) {
      try {
        client.socket.send(message);
      } catch {
        // Socket might be closed
      }
    }
  }
}

export function broadcastToWorkspace(workspaceId: string, data: any, excludeUserId?: string) {
  const message = JSON.stringify(data);

  for (const [, client] of clients) {
    if (client.userId !== excludeUserId) {
      try {
        client.socket.send(message);
      } catch {
        // Socket might be closed
      }
    }
  }
}
