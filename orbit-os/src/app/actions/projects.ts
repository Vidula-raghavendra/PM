"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/auth/guard";
import { ProjectService } from "@/services/project.service";

// Project creation goes through createDetailedProject in projects-v2.ts,
// which is what the multi-step wizard submits to.

const updateSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().optional(),
    client: z.string().optional(),
    status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"]).default("ACTIVE"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    totalBudget: z.coerce.number().min(0).optional(),
    currency: z.string().optional(),
});

export async function updateProject(id: string, prevState: any, formData: FormData) {
    const userId = await requireUser();

    const result = updateSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return { errors: z.flattenError(result.error).fieldErrors };
    }

    const { title, description, client, status, startDate, endDate, totalBudget, currency } = result.data;

    try {
        await ProjectService.update(id, userId, {
            title,
            description: description || null,
            client: client || null,
            status,
            start_date: startDate || null,
            end_date: endDate || null,
            total_budget: totalBudget ?? 0,
            ...(currency ? { currency } : {}),
        });
    } catch (error: any) {
        console.error("Update project failed:", error);
        return { message: error?.message ?? "Failed to update project." };
    }

    revalidatePath(`/dashboard/projects/${id}`);
    revalidatePath("/dashboard/projects");
    redirect(`/dashboard/projects/${id}`);
}

export async function deleteProject(id: string) {
    const userId = await requireUser();

    try {
        await ProjectService.delete(id, userId);
    } catch (error) {
        console.error("Delete project failed:", error);
        // Fall through to the redirect; the project list will show it survived.
    }

    revalidatePath("/dashboard/projects");
    redirect("/dashboard/projects");
}
