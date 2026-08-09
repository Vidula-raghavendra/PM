import { createSupabaseClient, createAdminClient } from "@/lib/supabaseClient";
import { getSession } from "@/auth/session";
import { mapNotification, type Notification } from "@/lib/mappers";

export const NotificationService = {
    async getForUser(userId: string): Promise<Notification[]> {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { data } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(50);
        return (data ?? []).map(mapNotification);
    },

    async getUnreadCount(userId: string): Promise<number> {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { count } = await supabase
            .from("notifications")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId)
            .eq("is_read", false);
        return count ?? 0;
    },

    async markAsRead(notificationId: string): Promise<void> {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("id", notificationId);
    },

    async markAllAsRead(userId: string): Promise<void> {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("user_id", userId)
            .eq("is_read", false);
    },

    /**
     * Create a notification for a user. Uses the admin client because the
     * sender (current user) is typically not the recipient.
     */
    async create(data: {
        userId: string;
        type: "INVITATION" | "MEETING" | "GENERAL";
        title: string;
        body?: string;
        link?: string;
        metadata?: Record<string, any>;
    }): Promise<void> {
        const admin = createAdminClient();
        await admin.from("notifications").insert({
            user_id: data.userId,
            type: data.type,
            title: data.title,
            body: data.body ?? null,
            link: data.link ?? null,
            metadata: data.metadata ?? {},
        });
    },
};
