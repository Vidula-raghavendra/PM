import "server-only";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabaseClient";

export async function createSession(accessToken: string, refreshToken: string) {
    const cookieStore = await cookies();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    cookieStore.set("sb-access-token", accessToken, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
    });

    cookieStore.set("sb-refresh-token", refreshToken, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
    });
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete("sb-access-token");
    cookieStore.delete("sb-refresh-token");
}

export async function getSession() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("sb-access-token")?.value;

    if (!accessToken) return null;

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
        return null;
    }

    return { ...user, userId: user.id, accessToken };
}

export async function updateSession() {
    // Ideally we would refresh the token here using the refresh token
    // For now, we'll just return early as Supabase handles its own expiry logic often
    // But to follow the pattern:
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("sb-refresh-token")?.value;

    if (!refreshToken) return;

    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

    if (!error && data.session) {
        await createSession(data.session.access_token, data.session.refresh_token);
    }
}
