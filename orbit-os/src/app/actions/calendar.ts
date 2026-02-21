"use server";

import { createSession } from "@/auth/session";
import { requireUser } from "@/auth/guard";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CalendarService } from "@/services/calendar.service";

const eventSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    startTime: z.string(), // ISO string
    endTime: z.string(), // ISO string
    type: z.enum(["MEETING", "CALL", "DEADLINE", "BLOCK"]),
    projectId: z.string().optional(),
});

export async function createEvent(prevState: any, formData: FormData) {
    const userId = await requireUser();

    const validatedFields = eventSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        startTime: formData.get("startTime"),
        endTime: formData.get("endTime"),
        type: formData.get("type"),
        projectId: formData.get("projectId") || undefined,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation Error",
        };
    }

    const { title, description, startTime, endTime, type, projectId } = validatedFields.data;

    try {
        await CalendarService.createEvent({
            title,
            description,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            type,
            projectId,
            userId,
        });

        revalidatePath("/dashboard/calendar");
        return { message: "Event created successfully" };
    } catch (error) {
        console.error("Failed to create event:", error);
        return { message: "Database Error: Failed to create event" };
    }
}

export type CalendarEvent = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    type: "PROJECT" | "MILESTONE" | "TASK" | "EVENT";
    category?: string; // e.g. MEETING, CALL for events
    projectId?: string;
    projectName?: string;
    status?: string;
};

export async function getCalendarEvents(month: Date) {
    const { getSession } = await import("@/auth/session");
    const session = await getSession();

    if (!session?.userId) return [];

    const userId = session.userId as string;

    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    // Add buffer for potential overlap
    startOfMonth.setDate(startOfMonth.getDate() - 7);
    endOfMonth.setDate(endOfMonth.getDate() + 7);

    const [projects, milestones, tasks, events] = await Promise.all([
        CalendarService.getProjects(userId, startOfMonth, endOfMonth),
        CalendarService.getMilestones(userId, startOfMonth, endOfMonth),
        CalendarService.getTasks(userId, startOfMonth, endOfMonth),
        CalendarService.getEvents(userId, startOfMonth, endOfMonth)
    ]);

    const calendarEvents: CalendarEvent[] = [];

    // Map Projects
    projects.forEach(p => {
        if (p.startDate && p.endDate) {
            calendarEvents.push({
                id: p.id,
                title: `[PROJ] ${p.title}`,
                start: p.startDate,
                end: p.endDate,
                type: "PROJECT",
                status: p.status
            });
        }
    });

    // Map Milestones
    milestones.forEach(m => {
        if (m.dueDate) {
            calendarEvents.push({
                id: m.id,
                title: `[MILE] ${m.title}`,
                start: m.dueDate,
                end: m.dueDate,
                type: "MILESTONE",
                projectId: m.projectId,
                projectName: m.project.title,
                status: m.status
            });
        }
    });

    // Map Tasks
    tasks.forEach(t => {
        if (t.dueDate) {
            calendarEvents.push({
                id: t.id,
                title: `[TASK] ${t.title}`,
                start: t.dueDate,
                end: t.dueDate,
                type: "TASK",
                projectId: t.projectId,
                projectName: t.project.title,
                status: t.status
            });
        }
    });

    // Map Events
    events.forEach(e => {
        calendarEvents.push({
            id: e.id,
            title: e.title,
            start: e.startTime,
            end: e.endTime,
            type: "EVENT",
            category: e.type,
            projectId: e.projectId || undefined,
            projectName: e.project?.title
        });
    });

    return calendarEvents;
}
