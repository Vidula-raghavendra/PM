"use server";

import { z } from "zod";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/auth/guard";
import { DashboardService } from "@/services/dashboard.service";

const timeLogSchema = z.object({
    projectId: z.string().min(1, { message: "Project is required" }),
    startTime: z.string().min(1, { message: "Start time is required" }),
    endTime: z.string().min(1, { message: "End time is required" }),
    description: z.string().optional(),
});

export async function logTime(prevState: any, formData: FormData) {
    const userId = await requireUser();

    const result = timeLogSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors };
    }

    const { projectId, startTime, endTime, description } = result.data;

    // Calculate duration in minutes
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = Math.round((end.getTime() - start.getTime()) / 1000 / 60);

    if (duration < 0) {
        return { errors: { endTime: ["End time must be after start time"] } };
    }

    try {
        await DashboardService.logTime(userId, {
            projectId,
            duration,
            description: description || "Manual Log"
        });
    } catch (e) {
        return { message: "Failed to log time" };
    }

    revalidatePath("/dashboard/time");
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { message: "Success" };
}
