import "server-only";
import { cookies } from "next/headers";
import { getSupabase } from "@/lib/supabaseClient";

export async function createSession(accessToken: string, refreshToken: string) {
    const cookieStore = await cookies();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const secure = process.env.NODE_ENV === "production";

    cookieStore.set("sb-access-token", accessToken, {
        httpOnly: true,
        secure,
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
    });

    cookieStore.set("sb-refresh-token", refreshToken, {
        httpOnly: true,
        secure,
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

    const { data: { user }, error } = await getSupabase().auth.getUser(accessToken);

    if (error || !user) {
        return null;
    }

    return { ...user, userId: user.id, accessToken };
}

/**
 * Refreshes the access token from the stored refresh token.
 *
 * Route handlers and server actions can call this, but server components
 * cannot — Next.js forbids setting cookies during render. The routine
 * refresh therefore happens in proxy.ts (middleware), which runs before
 * render and can write to the response.
 */
export async function updateSession() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("sb-refresh-token")?.value;

    if (!refreshToken) return null;

    const { data, error } = await getSupabase().auth.refreshSession({
        refresh_token: refreshToken,
    });

    if (error || !data.session) return null;

    await createSession(data.session.access_token, data.session.refresh_token);
    return data.session;
}
