import { createSupabaseClient } from "@/lib/supabaseClient";
import { getSession } from "@/auth/session";
import { mapProject, type Project } from "@/lib/mappers";

export const ProjectService = {
    async getProjectsForUser(userId: string): Promise<Project[]> {
        // RLS restricts this to projects the user owns or collaborates on.
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);

        const { data, error } = await supabase
            .from("projects")
            .select(`
                *,
                tasks (*),
                collaborators (
                    *,
                    user:profiles (*)
                )
            `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching projects:", error);
            return [];
        }
        return (data ?? []).map(mapProject);
    },

    async getById(id: string, userId: string) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);

        const { data, error } = await supabase
            .from("projects")
            .select(`
                *,
                milestones (*),
                tasks (*),
                collaborators (
                    *,
                    user:profiles (*)
                ),
                documents (*),
                time_logs (
                    *,
                    user:profiles (*)
                )
            `)
            .eq("id", id)
            .single();

        // Access control is enforced by RLS, which allows both the owner and
        // linked collaborators — deliberately not filtered on owner_id here.
        if (error || !data) return null;
        return mapProject(data);
    },

    async update(id: string, userId: string, data: any) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { data: project, error } = await supabase.from("projects").update(data).eq("id", id).select().single();
        if (error) throw error;
        return project;
    },

    async delete(id: string, userId: string) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { error } = await supabase.from("projects").delete().eq("id", id);
        if (error) throw error;
        return true;
    },
    async createDetailed(data: any, userId: string) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);

        const { data: project, error: projectError } = await supabase
            .from("projects")
            .insert({
                title: data.title,
                client: data.client || null,
                description: data.description || null,
                type: data.type || null,
                area: data.area || null,
                status: "ACTIVE",
                total_budget: data.totalBudget ?? 0,
                currency: data.currency || "INR",
                owner_id: userId,
            })
            .select()
            .single();

        if (projectError) throw projectError;

        const projectId = project.id;

        // Milestones and collaborators are part of what the user submitted, so a
        // failure here has to surface — previously these were logged and
        // swallowed, leaving a project with no payment schedule and no error.
        if (data.milestones?.length) {
            const { error: milestoneError } = await supabase
                .from("milestones")
                .insert(
                    data.milestones.map((m: any) => ({
                        project_id: projectId,
                        title: m.title,
                        amount: m.amount,
                        percentage: m.percentage,
                        start_date: m.startDate || null,
                        due_date: m.dueDate || null,
                        status: "PENDING",
                        checklist: m.checklist ?? [],
                    }))
                );

            if (milestoneError) throw milestoneError;
        }

        // user_id is left null: it is filled in by the link_pending_collaborators
        // trigger when the invited person signs up with a matching email.
        if (data.collaborators?.length) {
            const { error: collabError } = await supabase
                .from("collaborators")
                .insert(
                    data.collaborators.map((c: any) => ({
                        project_id: projectId,
                        email: c.email,
                        role: c.role,
                        color: c.color,
                        split_percentage: c.splitPercentage,
                    }))
                );

            if (collabError) throw collabError;
        }

        // The contract is uploaded to storage AND recorded in `documents`.
        // Without the row the file exists in the bucket but is invisible to
        // the app, which is what happened previously.
        if (data.contractFile && data.contractFile.size > 0) {
            const storagePath = `${projectId}/${data.contractFile.name}`;

            const { error: uploadError } = await supabase.storage
                .from("contracts")
                .upload(storagePath, data.contractFile, { upsert: true });

            // A failed contract upload should not discard an otherwise valid
            // project, so this one is logged rather than thrown.
            if (uploadError) {
                console.error("Contract upload failed:", uploadError);
            } else {
                const { error: documentError } = await supabase
                    .from("documents")
                    .insert({
                        project_id: projectId,
                        title: data.contractFile.name,
                        storage_path: storagePath,
                        type: "CONTRACT",
                    });

                if (documentError) console.error("Document record failed:", documentError);
            }
        }

        return project;
    },
};
