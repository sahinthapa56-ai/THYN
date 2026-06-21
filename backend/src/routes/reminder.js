import { authMiddleware } from "../middleware/auth.js";
import prisma from "../lib/prisma.js";
export function reminderRoutes(app) {
    app.addHook("preHandler", authMiddleware);
    // Create a reminder for a contact
    app.post("/", async (request, reply) => {
        const profile = await prisma.profile.findUnique({
            where: { supabaseId: request.userId },
        });
        if (!profile)
            return reply.status(404).send({ error: "Profile not found" });
        const { contactId, title, note, dueAt } = request.body;
        if (!contactId || !title || !dueAt) {
            return reply.status(400).send({ error: "contactId, title, and dueAt required" });
        }
        const contact = await prisma.contact.findFirst({
            where: { id: contactId, profileId: profile.id },
        });
        if (!contact)
            return reply.status(404).send({ error: "Contact not found" });
        const reminder = await prisma.reminder.create({
            data: {
                contactId,
                profileId: profile.id,
                title,
                note,
                dueAt: new Date(dueAt),
            },
        });
        return reply.status(201).send({ reminder });
    });
    // List reminders (all or by contact)
    app.get("/", async (request, reply) => {
        const profile = await prisma.profile.findUnique({
            where: { supabaseId: request.userId },
        });
        if (!profile)
            return reply.status(404).send({ error: "Profile not found" });
        const { contactId, upcoming } = request.query;
        const where = { profileId: profile.id };
        if (contactId)
            where.contactId = contactId;
        if (upcoming === "true") {
            where.dueAt = { gte: new Date() };
            where.done = false;
        }
        const reminders = await prisma.reminder.findMany({
            where,
            orderBy: { dueAt: "asc" },
            include: { contact: { select: { name: true, linkedinUrl: true } } },
        });
        return { reminders };
    });
    // Mark reminder as done
    app.put("/:id/done", async (request, reply) => {
        const profile = await prisma.profile.findUnique({
            where: { supabaseId: request.userId },
        });
        if (!profile)
            return reply.status(404).send({ error: "Profile not found" });
        const { id } = request.params;
        const result = await prisma.reminder.updateMany({
            where: { id, profileId: profile.id },
            data: { done: true },
        });
        if (result.count === 0) {
            return reply.status(404).send({ error: "Reminder not found" });
        }
        return { ok: true };
    });
    // Delete a reminder
    app.delete("/:id", async (request, reply) => {
        const profile = await prisma.profile.findUnique({
            where: { supabaseId: request.userId },
        });
        if (!profile)
            return reply.status(404).send({ error: "Profile not found" });
        const { id } = request.params;
        const result = await prisma.reminder.deleteMany({
            where: { id, profileId: profile.id },
        });
        if (result.count === 0) {
            return reply.status(404).send({ error: "Reminder not found" });
        }
        return { ok: true };
    });
}
