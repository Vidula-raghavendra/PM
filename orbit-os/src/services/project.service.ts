// import { prisma } from "@/db/prisma"; // Removed
import { createSupabaseClient } from "@/lib/supabaseClient";
import { getSession } from "@/auth/session";

export const ProjectService = {
    async getProjectsForUser(userId: string) {
        // RLS handles filtering. We just select *
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);

        const { data, error } = await supabase
            .from("projects")
            .select(`
                *,
                tasks (status),
                collaborators (
                    *,
                    user:profiles (*)
                )
            `)
            .order("created_at", { ascending: false }); // Changed from updated_at to created_at per instruction or preference

        if (error) {
            console.error("Error fetching projects:", error);
            return [];
        }
        return data || [];
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

        if (error) return null;
        return data;
    },

    async create(data: any) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { data: project, error } = await supabase.from("projects").insert(data).select().single();
        if (error) throw error;
        return project;
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

        // 1. Create Project
        // We handle Type/Area by appending to description if no specific columns exist, 
        // to be safe without schema migration access.
        // Or better, we assume a metadata column exists or use description JSON.
        // Let's serialize the extra fields into description for now to ensure they are saved.
        const fullDescription = JSON.stringify({
            scope: data.description,
            type: data.type,
            area: data.area,
        });

        const { data: project, error: projectError } = await supabase
            .from("projects")
            .insert({
                title: data.title,
                client: data.client,
                description: fullDescription, // Storing JSON in description for flexibility
                status: "ACTIVE",
                total_budget: data.totalBudget,
                currency: data.currency,
                owner_id: userId,
                // If metadata column exists, we could use it: metadata: { type: data.type, area: data.area }
            })
            .select()
            .single();

        if (projectError) throw projectError;

        const projectId = project.id;

        // 2. Create Milestones (Phases)
        if (data.milestones && data.milestones.length > 0) {
            const milestonesToInsert = data.milestones.map((m: any) => ({
                project_id: projectId,
                title: m.title,
                amount: m.amount,
                percentage: m.percentage,
                start_date: m.startDate || null,
                due_date: m.dueDate || null,
                status: "PENDING",
                description: JSON.stringify(m.checklist || []) // Store checklist in description
            }));

            const { error: milestoneError } = await supabase
                .from("milestones")
                .insert(milestonesToInsert);

            if (milestoneError) console.error("Error creating milestones:", milestoneError);
        }

        // 3. Create Collaborators
        if (data.collaborators && data.collaborators.length > 0) {
            // We need to resolve emails to user_ids if possible, or just store email invitations
            // Assuming a 'collaborators' table that takes { project_id, email, role, ... }
            const collaboratorsToInsert = data.collaborators.map((c: any) => ({
                project_id: projectId,
                email: c.email,
                role: c.role,
                color: c.color,
                split_percentage: c.splitPercentage,
                // user_id: resolve(c.email) -> tricky without admin access. 
                // We'll rely on a trigger or just store email for now.
            }));

            const { error: collabError } = await supabase
                .from("collaborators")
                .insert(collaboratorsToInsert);

            if (collabError) console.error("Error creating collaborators:", collabError);
        }

        // 4. Handle Contract File (Upload to Storage)
        if (data.contractFile) {
            const { error: uploadError } = await supabase.storage
                .from("contracts")
                .upload(`${projectId}/${data.contractFile.name}`, data.contractFile);

            if (uploadError) console.error("Error uploading contract:", uploadError);
        }

        return project;
    },
};
