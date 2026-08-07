import { createSupabaseClient } from "@/lib/supabaseClient";
import { getSession } from "@/auth/session";
import { mapTimeLog, mapTask } from "@/lib/mappers";

export const DashboardService = {
    async getStats(userId: string) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);

        const [{ data: milestones }, { count }] = await Promise.all([
            supabase
                .from("milestones")
                .select(`amount, status, project:projects!inner(owner_id)`)
                .eq("project.owner_id", userId),
            supabase
                .from("projects")
                .select("*", { count: "exact", head: true })
                .eq("owner_id", userId)
                .eq("status", "ACTIVE"),
        ]);

        const sumWhere = (status: string) =>
            milestones
                ?.filter((m: any) => m.status === status)
                .reduce((sum: number, m: any) => sum + (m.amount || 0), 0) ?? 0;

        return {
            revenueNum: sumWhere("PAID"),
            pendingRevenueNum: sumWhere("PENDING"),
            activeProjects: count ?? 0,
        };
    },

    async getActiveProjects(userId: string) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { data } = await supabase
            .from("projects")
            .select("id, title")
            .eq("owner_id", userId)
            .eq("status", "ACTIVE");
        return data || [];
    },

    async getTimeLogs(userId: string) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { data } = await supabase
            .from("time_logs")
            .select("duration")
            .eq("user_id", userId);

        const totalDuration = data?.reduce((sum, log) => sum + (log.duration || 0), 0) || 0;

        return { _sum: { duration: totalDuration } };
    },

    async getRecentTimeLogs(userId: string) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { data } = await supabase
            .from("time_logs")
            .select(`
                *,
                project:projects (title)
            `)
            .eq("user_id", userId)
            .order("start_time", { ascending: false })
            .limit(50);
        return (data ?? []).map(mapTimeLog);
    },

    async getNextTask(userId: string) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        // "project: { ownerId: userId, status: 'ACTIVE' }, status: 'TODO'"
        const { data } = await supabase
            .from("tasks")
            .select(`
                *,
                project:projects!inner (title, owner_id, status)
            `)
            .eq("project.owner_id", userId)
            .eq("project.status", "ACTIVE")
            .eq("status", "TODO")
            .order("due_date", { ascending: true })
            .limit(1)
            .single();

        return data;
    },

    async logTime(userId: string, data: { projectId: string; duration: number; description: string }) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { data: log, error } = await supabase.from("time_logs").insert({
            project_id: data.projectId,
            user_id: userId,
            start_time: new Date(),
            duration: data.duration,
            description: data.description,
        }).select().single();

        if (error) throw error;
        return log;
    }
};
