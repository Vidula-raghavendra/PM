"use server";

import { z } from "zod";

import { revalidatePath } from "next/cache";
import { decrypt } from "@/lib/auth/session";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

const milestoneSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    amount: z.coerce.number().min(1, { message: "Amount must be greater than 0" }),
    dueDate: z.string().optional(),
    projectId: z.string().min(1, { message: "Project is required" }),
});

async function getUserId() {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    return session?.userId as string | undefined;
}

export async function createMilestone(prevState: any, formData: FormData) {
    const userId = await getUserId();
    if (!userId) return { message: "Unauthorized" };

    const result = milestoneSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors };
    }

    const { title, amount, dueDate, projectId } = result.data;

    try {
        await prisma.milestone.create({
            data: {
                title,
                amount,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                projectId,
                status: "PENDING",
            }
        });
    } catch (e) {
        return { message: "Failed to create milestone" };
    }

    revalidatePath("/dashboard/finance");
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { message: "Success" };
}

export async function updateMilestoneStatus(id: string, status: "PENDING" | "PAID" | "OVERDUE") {
    const userId = await getUserId();
    if (!userId) return { message: "Unauthorized" };

    try {
        await prisma.milestone.update({
            where: { id },
            data: { status }
        });
    } catch (e) {
        return { message: "Failed to update status" };
    }

    revalidatePath("/dashboard/finance");
}
