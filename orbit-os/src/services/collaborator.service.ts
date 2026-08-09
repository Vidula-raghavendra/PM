import { createSupabaseClient, createAdminClient } from "@/lib/supabaseClient";
import { getSession } from "@/auth/session";
import { NotificationService } from "./notification.service";

export const CollaboratorService = {
    /**
     * Add a collaborator to a project. If the email matches an existing user,
     * link them immediately and send a notification.
     */
    async addToProject(
        projectId: string,
        data: { email: string; role: string; color: string; splitPercentage: number }
    ) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const admin = createAdminClient();

        // Look up user by email
        const { data: profile } = await admin
            .from("profiles")
            .select("id, email, full_name")
            .ilike("email", data.email)
            .maybeSingle();

        // Get project title for notification
        const { data: project } = await supabase
            .from("projects")
            .select("title")
            .eq("id", projectId)
            .single();

        const { data: collab, error } = await supabase
            .from("collaborators")
            .insert({
                project_id: projectId,
                user_id: profile?.id ?? null,
                email: data.email.toLowerCase(),
                role: data.role,
                color: data.color,
                split_percentage: data.splitPercentage,
                status: profile ? "ACCEPTED" : "PENDING",
            })
            .select()
            .single();

        if (error) throw error;

        // If the user exists, send them a notification
        if (profile) {
            await NotificationService.create({
                userId: profile.id,
                type: "INVITATION",
                title: `You've been added to "${project?.title ?? "a project"}"`,
                body: `Role: ${data.role}`,
                link: `/dashboard/projects/${projectId}`,
                metadata: { project_id: projectId, collaborator_id: collab.id },
            });
        }

        return collab;
    },

    async removeFromProject(collaboratorId: string) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { error } = await supabase
            .from("collaborators")
            .delete()
            .eq("id", collaboratorId);
        if (error) throw error;
    },

    async acceptInvitation(collaboratorId: string, userId: string) {
        const admin = createAdminClient();
        const { error } = await admin
            .from("collaborators")
            .update({ status: "ACCEPTED", user_id: userId })
            .eq("id", collaboratorId);
        if (error) throw error;
    },

    async declineInvitation(collaboratorId: string, userId: string) {
        const admin = createAdminClient();
        const { error } = await admin
            .from("collaborators")
            .update({ status: "DECLINED" })
            .eq("id", collaboratorId)
            .eq("user_id", userId);
        if (error) throw error;
    },
};
