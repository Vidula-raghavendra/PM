"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/auth/guard";
import { GoalService } from "@/services/goal.service";

const goalSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    targetDate: z.string().optional(), // ISO string date
});

export async function createGoal(prevState: any, formData: FormData) {
    const userId = await requireUser();

    const validatedFields = goalSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        targetDate: formData.get("targetDate"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation Error",
        };
    }

    const { title, description, targetDate } = validatedFields.data;

    try {
        await GoalService.create({
            title,
            description,
            targetDate: targetDate ? new Date(targetDate) : undefined,
            userId,
        });

        revalidatePath("/dashboard/goals");
        return { message: "Goal created successfully" };
    } catch (error) {
        return { message: "Database Error: Failed to create goal" };
    }
}

export async function deleteGoal(id: string) {
    const userId = await requireUser();

    try {
        await GoalService.delete(id, userId);
        revalidatePath("/dashboard/goals");
        return { message: "Goal deleted" };
    } catch (error) {
        return { message: "Failed to delete" };
    }
}

export async function toggleGoalStatus(id: string) {
    const userId = await requireUser();

    try {
        await GoalService.toggleStatus(id, userId);
        revalidatePath("/dashboard/goals");
        return { message: "Status updated" };
    } catch (error) {
        return { message: "Failed to update status" };
    }
}
