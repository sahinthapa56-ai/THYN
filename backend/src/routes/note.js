import { authMiddleware } from "../middleware/auth.js";
import prisma from "../lib/prisma.js";
export function noteRoutes(app) {
    app.addHook("preHandler", authMiddleware);
    // Create a note on a contact
    app.post("/", async (request, reply) => {
        const profile = await prisma.profile.findUnique({
            where: { supabaseId: request.userId },
        });
        if (!profile)
            return reply.status(404).send({ error: "Profile not found" });
        const { contactId, content } = request.body;
        if (!contactId || !content) {
            return reply.status(400).send({ error: "contactId and content required" });
        }
        // Verify contact belongs to user
        const contact = await prisma.contact.findFirst({
            where: { id: contactId, profileId: profile.id },
        });
        if (!contact)
            return reply.status(404).send({ error: "Contact not found" });
        const note = await prisma.note.create({
            data: { contactId, profileId: profile.id, content },
        });
        return reply.status(201).send({ note });
    });
    // List notes for a contact
    app.get("/contact/:contactId", async (request, reply) => {
        const profile = await prisma.profile.findUnique({
            where: { supabaseId: request.userId },
        });
        if (!profile)
            return reply.status(404).send({ error: "Profile not found" });
        const { contactId } = request.params;
        const notes = await prisma.note.findMany({
            where: { contactId, profileId: profile.id },
            orderBy: { createdAt: "desc" },
        });
        return { notes };
    });
    // Delete a note
    app.delete("/:id", async (request, reply) => {
        const profile = await prisma.profile.findUnique({
            where: { supabaseId: request.userId },
        });
        if (!profile)
            return reply.status(404).send({ error: "Profile not found" });
        const { id } = request.params;
        const result = await prisma.note.deleteMany({
            where: { id, profileId: profile.id },
        });
        if (result.count === 0) {
            return reply.status(404).send({ error: "Note not found" });
        }
        return { ok: true };
    });
}
