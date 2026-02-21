// import { prisma } from "@/db/prisma";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { getSession } from "../auth/session";

export const CalendarService = {
    async getProjects(userId: string, start: Date, end: Date) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        // Relying on RLS to filter accessible projects (owner or collaborator)
        // Filtering by date overlap: startDate <= end AND endDate >= start
        const { data } = await supabase
            .from("projects")
            .select("*")
            .lte("start_date", end.toISOString())
            .gte("end_date", start.toISOString());

        return data || [];
    },

    async getMilestones(userId: string, start: Date, end: Date) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { data } = await supabase
            .from("milestones")
            .select(`
                *,
                project:projects!inner (title)
            `)
            // RLS on milestones/projects should handle user scoping
            .gte("due_date", start.toISOString())
            .lte("due_date", end.toISOString());

        return data || [];
    },

    async getTasks(userId: string, start: Date, end: Date) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { data } = await supabase
            .from("tasks")
            .select(`
                *,
                project:projects!inner (title)
            `)
            .gte("due_date", start.toISOString())
            .lte("due_date", end.toISOString());

        return data || [];
    },

    async getEvents(userId: string, start: Date, end: Date) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { data } = await supabase
            .from("events") // Assuming 'events' table exists
            .select(`
                *,
                project:projects (title)
            `)
            .eq("user_id", userId)
            .gte("start_time", start.toISOString())
            .lte("start_time", end.toISOString());

        return data || [];
    },

    async createEvent(data: any) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { data: event, error } = await supabase.from("events").insert(data).select().single();
        if (error) throw error;
        return event;
    }
};
