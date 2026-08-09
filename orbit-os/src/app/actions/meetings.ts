"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/auth/guard";
import { CalendarService } from "@/services/calendar.service";

const scheduleMeetingSchema = z.object({
    projectId: z.string().uuid(),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    date: z.string().min(1, "Date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    meetingLink: z.string().url().optional().or(z.literal("")),
    attendees: z.string(), // JSON array of emails
});

export async function scheduleMeeting(prevState: any, formData: FormData) {
    const userId = await requireUser();

    const result = scheduleMeetingSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        const firstError = Object.values(errors).flat()[0];
        return { message: firstError ?? "Invalid input." };
    }

    const { projectId, title, description, date, startTime, endTime, meetingLink, attendees } = result.data;

    let attendeeEmails: string[] = [];
    try {
        attendeeEmails = JSON.parse(attendees);
    } catch {
        return { message: "Invalid attendee list." };
    }

    try {
        await CalendarService.createMeeting({
            userId,
            projectId,
            title,
            description,
            startTime: `${date}T${startTime}:00`,
            endTime: `${date}T${endTime}:00`,
            meetingLink: meetingLink || undefined,
            attendeeEmails,
        });
    } catch (err: any) {
        return { message: err.message ?? "Failed to schedule meeting." };
    }

    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true };
}
