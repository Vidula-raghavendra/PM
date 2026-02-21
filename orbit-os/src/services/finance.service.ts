// import { prisma } from "@/db/prisma"; // Removed
import { createSupabaseClient } from "@/lib/supabaseClient";
import { getSession } from "@/auth/session";

export const FinanceService = {
    async getMilestones(userId: string) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);

        // We need to verify ownership via the project relation
        // We use !inner to enforce the filter on the joined table
        const { data, error } = await supabase
            .from("milestones")
            .select(`
                *,
                project:projects!inner (
                    title,
                    owner_id
                )
            `)
            .eq("project.owner_id", userId)
            .order("due_date", { ascending: true });

        if (error) {
            console.error("Error fetching milestones:", error);
            return [];
        }
        return data || [];
    },

    async createMilestone(data: any) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { data: milestone, error } = await supabase.from("milestones").insert(data).select().single();
        if (error) throw error;
        return milestone;
    },

    async updateMilestoneStatus(id: string, status: string, userId: string) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { data: milestone, error } = await supabase
            .from("milestones")
            .update({ status })
            .eq("id", id)
            .select() // Add verification if RLS is strict
            .single();

        if (error) throw error;
        return milestone;
    }
};
