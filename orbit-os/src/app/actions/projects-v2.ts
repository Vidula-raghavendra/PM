"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { requireUser } from "@/auth/guard";
import { ProjectService } from "@/services/project.service";

const milestoneSchema = z.object({
    title: z.string().min(1),
    amount: z.coerce.number().min(0),
    percentage: z.coerce.number().min(0).max(100),
    startDate: z.string().optional(),
    dueDate: z.string().optional(),
    checklist: z.array(z.string()).optional(),
});

const collaboratorSchema = z.object({
    email: z.string().email(),
    role: z.string().default("MEMBER"),
    color: z.string(),
    splitPercentage: z.coerce.number().min(0).max(100),
});

const projectV2Schema = z.object({
    title: z.string().min(1),
    client: z.string().optional(),
    description: z.string().optional(), // Scope of Work
    type: z.string().optional(),
    area: z.string().optional(),
    totalBudget: z.coerce.number().min(0),
    currency: z.string().default("INR"),
    milestones: z.string().transform((str) => JSON.parse(str)), // Received as JSON string
    collaborators: z.string().transform((str) => JSON.parse(str)), // Received as JSON string
});

export async function createDetailedProject(prevState: any, formData: FormData) {
    const userId = await requireUser();

    const result = projectV2Schema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        console.error(result.error);
        return {
            errors: result.error.flatten().fieldErrors,
            message: "Invalid inputs",
        };
    }

    const { title, client, description, type, area, totalBudget, currency, milestones, collaborators } = result.data;
    const contractFile = formData.get("contract") as File;

    try {
        await ProjectService.createDetailed({
            title,
            client,
            description,
            type,
            area,
            totalBudget,
            currency,
            milestones,
            collaborators,
            contractFile
        }, userId);

    } catch (error: any) {
        console.error("Create Project V2 Error:", error);
        return {
            message: `Failed to create project: ${error.message || error}`,
        };
    }

    redirect("/dashboard/projects");
}
