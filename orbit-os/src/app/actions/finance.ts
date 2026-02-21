"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/auth/guard";
import { FinanceService } from "@/services/finance.service";

const milestoneSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    amount: z.coerce.number().min(1, { message: "Amount must be greater than 0" }),
    dueDate: z.string().optional(),
    projectId: z.string().min(1, { message: "Project is required" }),
});

export async function createMilestone(prevState: any, formData: FormData) {
    const userId = await requireUser();

    const result = milestoneSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors };
    }

    const { title, amount, dueDate, projectId } = result.data;

    try {
        await FinanceService.createMilestone({
            title,
            amount,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            projectId,
            status: "PENDING",
        });
    } catch (e) {
        return { message: "Failed to create milestone" };
    }

    revalidatePath("/dashboard/finance");
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { message: "Success" };
}

export async function updateMilestoneStatus(id: string, status: "PENDING" | "PAID" | "OVERDUE") {
    const userId = await requireUser();

    try {
        await FinanceService.updateMilestoneStatus(id, status, userId);
    } catch (e) {
        return { message: "Failed to update status" };
    }

    revalidatePath("/dashboard/finance");
}
