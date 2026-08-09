"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/auth/guard";
import { CollaboratorService } from "@/services/collaborator.service";

const addCollaboratorSchema = z.object({
    projectId: z.string().uuid(),
    email: z.string().email(),
    role: z.string().min(1).default("MEMBER"),
    color: z.string().default("#3b82f6"),
    splitPercentage: z.coerce.number().min(0).max(100).default(0),
});

export async function addCollaboratorToProject(prevState: any, formData: FormData) {
    await requireUser();

    const result = addCollaboratorSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
        return { message: result.error.flatten().fieldErrors.email?.[0] ?? "Invalid input." };
    }

    try {
        await CollaboratorService.addToProject(result.data.projectId, {
            email: result.data.email,
            role: result.data.role,
            color: result.data.color,
            splitPercentage: result.data.splitPercentage,
        });
    } catch (err: any) {
        if (err.message?.includes("duplicate key")) {
            return { message: "This person is already a collaborator on this project." };
        }
        return { message: err.message ?? "Failed to add collaborator." };
    }

    revalidatePath(`/dashboard/projects/${result.data.projectId}`);
    return { success: true };
}

export async function removeCollaboratorFromProject(collaboratorId: string, projectId: string) {
    await requireUser();

    try {
        await CollaboratorService.removeFromProject(collaboratorId);
    } catch (err: any) {
        return { message: err.message ?? "Failed to remove collaborator." };
    }

    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true };
}

export async function respondToInvitation(
    collaboratorId: string,
    response: "ACCEPTED" | "DECLINED"
) {
    const userId = await requireUser();

    try {
        if (response === "ACCEPTED") {
            await CollaboratorService.acceptInvitation(collaboratorId, userId);
        } else {
            await CollaboratorService.declineInvitation(collaboratorId, userId);
        }
    } catch (err: any) {
        return { message: err.message ?? "Failed to respond to invitation." };
    }

    revalidatePath("/dashboard");
    return { success: true };
}
