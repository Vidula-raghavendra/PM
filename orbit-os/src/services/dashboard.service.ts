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

        const countWhere = (status: string) =>
            milestones?.filter((m: any) => m.status === status).length ?? 0;

        return {
            revenueNum: sumWhere("PAID"),
            pendingRevenueNum: sumWhere("PENDING"),
            activeProjects: count ?? 0,
            totalMilestones: milestones?.length ?? 0,
            paidMilestones: countWhere("PAID"),
            openMilestones: countWhere("PENDING"),
        };
    },

    /**
     * Monthly paid revenue for the trailing 12 months, plus per-project
     * totals. Both drive real chart widgets on the overview, so the
     * dashboard shows the user's own numbers rather than sample data.
     */
    async getRevenueBreakdown(userId: string) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);

        const { data } = await supabase
            .from("milestones")
            .select(`amount, status, due_date, project:projects!inner(id, title, owner_id)`)
            .eq("project.owner_id", userId)
            .eq("status", "PAID");

        const rows = (data ?? []) as any[];

        // Trailing 12 months, oldest first.
        const now = new Date();
        const series = Array.from({ length: 12 }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
            return {
                label: d.toLocaleString("en-US", { month: "short" }),
                key: `${d.getFullYear()}-${d.getMonth()}`,
                value: 0,
            };
        });
        const byKey = new Map(series.map((m) => [m.key, m]));

        const byProject = new Map<string, { title: string; value: number }>();

        for (const row of rows) {
            const amount = Number(row.amount) || 0;

            if (row.due_date) {
                const d = new Date(row.due_date);
                const bucket = byKey.get(`${d.getFullYear()}-${d.getMonth()}`);
                if (bucket) bucket.value += amount;
            }

            const project = row.project;
            if (project?.id) {
                const existing = byProject.get(project.id);
                if (existing) existing.value += amount;
                else byProject.set(project.id, { title: project.title ?? "Untitled", value: amount });
            }
        }

        const projects = [...byProject.values()].sort((a, b) => b.value - a.value);
        const total = projects.reduce((sum, p) => sum + p.value, 0);

        // Top four by value, everything else rolled into "Other".
        const top = projects.slice(0, 4);
        const rest = projects.slice(4).reduce((sum, p) => sum + p.value, 0);
        const breakdown = [
            ...top,
            ...(rest > 0 ? [{ title: "Other", value: rest }] : []),
        ].map((p) => ({
            ...p,
            pct: total > 0 ? Math.round((p.value / total) * 100) : 0,
        }));

        return {
            series: series.map(({ label, value }) => ({ label, value })),
            breakdown,
            total,
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
