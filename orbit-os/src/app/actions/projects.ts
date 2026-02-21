"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { requireUser } from "@/auth/guard";
import { ProjectService } from "@/services/project.service";

const projectSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().optional(),
    client: z.string().optional(),
    status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"]).default("ACTIVE"),
    priority: z.enum(["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
    startDate: z.string().optional(), // ISO date string
    endDate: z.string().optional(),   // ISO date string
    totalBudget: z.coerce.number().optional(),
});

export async function createProject(prevState: any, formData: FormData) {
    const userId = await requireUser();

    const result = projectSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const { title, description, client, status, priority, startDate, endDate, totalBudget } = result.data;

    try {
        await ProjectService.create({
            title,
            description,
            client,
            status,
            priority,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            totalBudget,
            owner: { connect: { id: userId } }
        });
    } catch (error) {
        console.error("Create Project Error:", error);
        return { message: "Failed to create project." };
    }

    redirect("/dashboard/projects");
}

export async function updateProject(id: string, prevState: any, formData: FormData) {
    const userId = await requireUser();

    const result = projectSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors };
    }
    const { title, description, status, priority, startDate, endDate, totalBudget } = result.data;

    try {
        await ProjectService.update(id, userId, {
            title,
            description,
            status,
            priority,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            totalBudget,
        });
    } catch (e) {
        return { message: "Failed to update project" };
    }

    redirect(`/dashboard/projects/${id}`);
}

export async function deleteProject(id: string) {
    const userId = await requireUser();

    try {
        await ProjectService.delete(id, userId);
    } catch (e) {
        console.error("Delete Project Error:", e);
    }

    redirect("/dashboard/projects");
}
