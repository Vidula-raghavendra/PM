import { createSupabaseClient, createAdminClient } from "@/lib/supabaseClient";
import { getSession } from "../auth/session";
import { mapMeeting, type Meeting } from "@/lib/mappers";
import { NotificationService } from "./notification.service";

export const CalendarService = {
    async getProjects(userId: string, start: Date, end: Date) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
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
            .select(`*, project:projects!inner (title)`)
            .gte("due_date", start.toISOString())
            .lte("due_date", end.toISOString());

        return data || [];
    },

    async getTasks(userId: string, start: Date, end: Date) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { data } = await supabase
            .from("tasks")
            .select(`*, project:projects!inner (title)`)
            .gte("due_date", start.toISOString())
            .lte("due_date", end.toISOString());

        return data || [];
    },

    async getEvents(userId: string, start: Date, end: Date) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { data } = await supabase
            .from("calendar_events")
            .select(`*, project:projects (title)`)
            .eq("user_id", userId)
            .gte("start_time", start.toISOString())
            .lte("start_time", end.toISOString());

        return data || [];
    },

    async createEvent(data: any) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { data: event, error } = await supabase
            .from("calendar_events")
            .insert(data)
            .select()
            .single();
        if (error) throw error;
        return event;
    },

    async createMeeting(opts: {
        userId: string;
        projectId: string;
        title: string;
        description?: string;
        startTime: string;
        endTime: string;
        meetingLink?: string;
        attendeeEmails: string[];
    }): Promise<Meeting> {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const admin = createAdminClient();

        // 1. Create the calendar event
        const { data: event, error } = await supabase
            .from("calendar_events")
            .insert({
                user_id: opts.userId,
                project_id: opts.projectId,
                title: opts.title,
                description: opts.description ?? null,
                start_time: opts.startTime,
                end_time: opts.endTime,
                meeting_link: opts.meetingLink ?? null,
                type: "MEETING",
            })
            .select()
            .single();

        if (error) throw error;

        // 2. Create attendee rows
        if (opts.attendeeEmails.length > 0) {
            // Look up existing users for notifications
            const { data: profiles } = await admin
                .from("profiles")
                .select("id, email")
                .in("email", opts.attendeeEmails.map(e => e.toLowerCase()));

            const profileMap = new Map((profiles ?? []).map(p => [p.email.toLowerCase(), p.id]));

            const attendeeRows = opts.attendeeEmails.map(email => ({
                event_id: event.id,
                user_id: profileMap.get(email.toLowerCase()) ?? null,
                email: email.toLowerCase(),
            }));

            await supabase.from("meeting_attendees").insert(attendeeRows);

            // 3. Send notifications to users who have accounts
            const { data: project } = await supabase
                .from("projects")
                .select("title")
                .eq("id", opts.projectId)
                .single();

            for (const [email, userId] of profileMap) {
                if (opts.attendeeEmails.map(e => e.toLowerCase()).includes(email)) {
                    await NotificationService.create({
                        userId,
                        type: "MEETING",
                        title: `Meeting scheduled: "${opts.title}"`,
                        body: `Project: ${project?.title ?? "Unknown"}`,
                        link: `/dashboard/projects/${opts.projectId}`,
                        metadata: { project_id: opts.projectId, event_id: event.id },
                    });
                }
            }
        }

        return mapMeeting({ ...event, meeting_attendees: [] });
    },

    async getMeetingsForProject(projectId: string): Promise<Meeting[]> {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { data } = await supabase
            .from("calendar_events")
            .select(`*, meeting_attendees (*)`)
            .eq("project_id", projectId)
            .eq("type", "MEETING")
            .order("start_time", { ascending: true });

        return (data ?? []).map(mapMeeting);
    },
};
