"use server";

import { z } from "zod";

import { revalidatePath } from "next/cache";
import { decrypt } from "@/lib/auth/session";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

const timeLogSchema = z.object({
    projectId: z.string().min(1, { message: "Project is required" }),
    startTime: z.string().min(1, { message: "Start time is required" }),
    endTime: z.string().min(1, { message: "End time is required" }),
    description: z.string().optional(),
});

async function getUserId() {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    return session?.userId as string | undefined;
}

export async function logTime(prevState: any, formData: FormData) {
    const userId = await getUserId();
    if (!userId) return { message: "Unauthorized" };

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
        await prisma.timeLog.create({
            data: {
                projectId,
                userId,
                startTime: start,
                endTime: end,
                duration,
                description,
            }
        });
    } catch (e) {
        return { message: "Failed to log time" };
    }

    revalidatePath("/dashboard/time");
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { message: "Success" };
}
