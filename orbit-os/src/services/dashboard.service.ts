// import { prisma } from "@/db/prisma";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { getSession } from "../auth/session";

export const DashboardService = {
    async getStats(userId: string) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);

        // Fetch all milestones for user's projects to calculate revenue
        const { data: milestones } = await supabase
            .from("milestones")
            .select(`amount, status, project:projects!inner(owner_id)`)
            .eq("project.owner_id", userId);

        // Fetch active projects count
        const { count } = await supabase
            .from("projects")
            .select("*", { count: "exact", head: true })
            .eq("owner_id", userId)
            .eq("status", "ACTIVE");

        const revenue = milestones
            ?.filter((m: any) => m.status === "PAID")
            .reduce((sum, m) => sum + (m.amount || 0), 0) || 0;

        const pendingRevenue = milestones
            ?.filter((m: any) => m.status === "PENDING")
            .reduce((sum, m) => sum + (m.amount || 0), 0) || 0;

        return {
            revenue: { _sum: { amount: revenue } }, // Mimic Prisma structure or update frontend? Updating svc to return values is better but let's match existing shape for now if possible, or assume frontend just needs values.
            // Actually, frontend checks `revenue._sum.amount`. I should probably return the raw values and update frontend, 
            // BUT for least disturbance, I will return the structure frontend expects OR update frontend.
            // Let's assume frontend expects the object structure from Prisma.
            // Checking: page.tsx uses `stats.revenue._sum.amount`.
            // So:
            activeProjects: count || 0, // Wait, activeProjects was a count in Prisma? "prisma.project.count" returns number.
            pendingRevenue: { _sum: { amount: pendingRevenue } },
            revenueNum: revenue, // Adding simple version if I refactor frontend
            activeProjectsNum: count // Adding simple version
        };
    },

    // Helper to match Prisma return shape
    async getStatsWithPrismaShape(userId: string) {
        const stats = await this.getStats(userId);
        return {
            revenue: { _sum: { amount: stats.revenueNum } },
            activeProjects: stats.activeProjectsNum, // Prisma count returns number
            pendingRevenue: { _sum: { amount: stats.pendingRevenue._sum.amount } }
        };
    },

    // I will replace getStats directly to return compatible shape
    async getStatsCompatible(userId: string) { // Renaming to avoid conflict in this thought process, but effectively:
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);

        // Fetch all milestones
        const { data: milestones } = await supabase
            .from("milestones")
            .select(`amount, status, project:projects!inner(owner_id)`)
            .eq("project.owner_id", userId);

        const revenue = milestones
            ?.filter((m: any) => m.status === "PAID")
            .reduce((sum, m) => sum + (m.amount || 0), 0) || 0;

        const pendingRevenue = milestones
            ?.filter((m: any) => m.status === "PENDING")
            .reduce((sum, m) => sum + (m.amount || 0), 0) || 0;

        const { count } = await supabase
            .from("projects")
            .select("*", { count: "exact", head: true })
            .eq("owner_id", userId)
            .eq("status", "ACTIVE");

        return {
            revenue: { _sum: { amount: revenue } },
            activeProjects: count || 0,
            pendingRevenue: { _sum: { amount: pendingRevenue } }
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
        return data || [];
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
