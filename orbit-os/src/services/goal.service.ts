// import { prisma } from "@/db/prisma";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { getSession } from "@/auth/session";

export const GoalService = {
    async create(data: { title: string; description?: string; targetDate?: Date; userId: string }) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { data: goal, error } = await supabase.from("goals").insert({
            title: data.title,
            description: data.description,
            target_date: data.targetDate,
            user_id: data.userId,
            status: "IN_PROGRESS",
        }).select().single();

        if (error) throw error;
        return goal;
    },

    async delete(id: string, userId: string) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { error } = await supabase.from("goals").delete().eq("id", id).eq("user_id", userId);
        if (error) throw error;
        return true;
    },

    async toggleStatus(id: string, userId: string) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);

        // Fetch current status first to toggle
        const { data: current, error: fetchError } = await supabase
            .from("goals")
            .select("status")
            .eq("id", id)
            .eq("user_id", userId)
            .single();

        if (fetchError || !current) throw fetchError || new Error("Goal not found");

        const newStatus = current.status === "ACHIEVED" ? "IN_PROGRESS" : "ACHIEVED";

        const { data: updated, error } = await supabase
            .from("goals")
            .update({ status: newStatus })
            .eq("id", id)
            .eq("user_id", userId)
            .select()
            .single();

        if (error) throw error;
        return updated;
    },

    async getGoals(userId: string) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { data } = await supabase
            .from("goals")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        return data || [];
    }
};
