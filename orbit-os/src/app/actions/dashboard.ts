"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/auth/guard";
import { DashboardService } from "@/services/dashboard.service";

const timeLogSchema = z.object({
    projectId: z.string().min(1, { message: "Project is required" }),
    description: z.string().optional(),
    duration: z.coerce.number().min(1, { message: "Duration must be at least 1 minute" }),
});

export async function logTime(prevState: any, formData: FormData) {
    const userId = await requireUser();

    const result = timeLogSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const { projectId, description, duration } = result.data;

    try {
        await DashboardService.logTime(userId, {
            projectId,
            duration,
            description: description || "Daily Log",
        });

        revalidatePath("/dashboard");
        return { message: "Time logged successfully!" };
    } catch (error) {
        console.error("Time Log Error:", error);
        return {
            message: "Failed to log time.",
        };
    }
}
