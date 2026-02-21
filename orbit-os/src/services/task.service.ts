
import { createSupabaseClient } from "@/lib/supabaseClient";
import { getSession } from "@/auth/session";

export const TaskService = {
    async createTask(task: any) {
        const session = await getSession();
        if (!session?.accessToken) throw new Error("Not authenticated");

        const supabase = createSupabaseClient(session.accessToken);
        const { data, error } = await supabase
            .from("tasks")
            .insert({
                ...task,
                user_id: session.userId, // Although RLS checks auth.uid(), we explicitly set it if the table requires it or for clarity
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getTasks(projectId: string) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);

        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("project_id", projectId);

        if (error) throw error;
        return data || [];
    },

    // For Dashboard/Upcoming
    async getUpcomingTasks(limit: number = 5) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const today = new Date().toISOString();

        const { data, error } = await supabase
            .from("tasks")
            .select(`
                *,
                project:projects!inner(title)
            `)
            .gte("due_date", today)
            .order("due_date", { ascending: true })
            .limit(limit);

        if (error) throw error;
        return data || [];
    }
};
