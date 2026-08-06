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
        const supabase = createSupabaseClient(session?.accessToken);

        // Upsert rather than update: the profile row may not exist yet if the
        // signup-time insert failed.
        const payload = {
            id: userId,
            ...data,
            full_name: session?.user_metadata?.full_name || session?.email?.split('@')[0] || "User",
        };

        const { error } = await supabase.from("profiles").upsert(payload);

        if (error) {
            console.error("UserService Update Error:", JSON.stringify(error));
            throw error;
        }
        return payload;
    }
};
