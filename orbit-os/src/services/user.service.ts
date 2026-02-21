// import { prisma } from "@/db/prisma"; // Removed
import { createSupabaseClient, createAdminClient } from "@/lib/supabaseClient";
import { getSession } from "@/auth/session";

export const UserService = {
    async getByEmail(email: string) {
        // We use admin client here because searching by email is often an admin/system task
        // or used during login before we have a session.
        const supabase = createAdminClient();
        const { data } = await supabase.from("profiles").select("*").eq("email", email).single();
        return data; // Returns profile, not auth user. 
    },

    async getById(id: string) {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { data } = await supabase.from("profiles").select("*").eq("id", id).single();
        return data;
    },

    async getAll() {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);
        const { data } = await supabase.from("profiles").select("*");
        return data || [];
    },

    // Create is now handled by auth.signup + profile insertion, but keeping for compatibility if needed
    // This looks like an "Admin create user" function based on params
    async create(data: { email: string; password: string; name?: string; role?: "USER" | "ADMIN"; phone?: string; sector?: string; purpose?: string; gender?: string; }) {
        // This would need to use supabase.auth.admin.createUser to be real
        const supabase = createAdminClient();
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: data.email,
            password: data.password,
            email_confirm: true,
            user_metadata: { full_name: data.name }
        });

        if (authError || !authData.user) throw authError || new Error("Failed to create auth user");

        const { data: profile, error: profileError } = await supabase.from("profiles").insert({
            id: authData.user.id,
            email: data.email,
            full_name: data.name,
            phone: data.phone,
            sector: data.sector,
            purpose: data.purpose,
            gender: data.gender,
            // role: data.role // Assuming role is in profiles or metadata
        }).select().single();

        if (profileError) throw profileError;
        return profile;
    },

    async updateProfile(userId: string, data: { phone?: string; gender?: string; sector?: string; purpose?: string }) {
        const session = await getSession();

        // If no session, likely an error or admin call, but for now we assume user context
        // If userId matches session user, we can include email to ensure upsert works


        const supabase = createSupabaseClient(session?.accessToken);

        // Use upsert instead of update to handle missing rows
        // We need to provide the full primary key (id) and potentially other required fields if it's an insert
        // But for profiles, id is the PK.
        const payload = {
            id: userId,
            ...data,
            // Email and updated_at removed to fix schema errors
            full_name: session?.user_metadata?.full_name || session?.email?.split('@')[0] || "User",
        };
        console.log("!!! RESTARTING_PROFILE_UPDATE_LOG !!! Payload:", JSON.stringify(payload));

        const { error } = await supabase.from("profiles").upsert(payload);

        if (error) {
            console.error("UserService Update Error:", JSON.stringify(error));
            throw error;
        }
        return payload;
    }
};
