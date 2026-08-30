import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseClient, getSupabase } from "@/lib/supabaseClient";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/** Cookie options shared by both tokens. Mirrors auth/session.ts. */
function cookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        expires: new Date(Date.now() + SEVEN_DAYS_MS),
    };
}

export async function proxy(request: NextRequest) {
    const protectedRoutes = ["/dashboard", "/settings", "/onboarding"];
    const publicRoutes = ["/login", "/register", "/signup", "/sign-up", "/sign-in", "/"];

    const path = request.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some((route) =>
        path.startsWith(route)
    );
    const isPublicRoute = publicRoutes.includes(path);

    const accessToken = request.cookies.get("sb-access-token")?.value;
    const refreshToken = request.cookies.get("sb-refresh-token")?.value;

    // No credentials at all on a protected route — straight to login.
    if (isProtectedRoute && !accessToken && !refreshToken) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    let user = null;

    if (accessToken) {
        try {
            const supabase = createSupabaseClient(accessToken);
            const { data, error } = await supabase.auth.getUser(accessToken);
            if (!error && data.user) user = data.user;
        } catch {
            // Network failure or malformed token — treated as signed out below.
        }
    }

    /**
     * Supabase access tokens expire after ~1 hour, but the cookies live for
     * seven days. Without this the user keeps a cookie that no longer
     * authenticates and gets bounced to /login mid-session, which reads as
     * "it logged me out at random".
     *
     * Middleware is the only place this can happen: it is the one layer that
     * runs before rendering AND can write cookies onto the response. Server
     * components can read cookies but not set them.
     */
    if (!user && refreshToken) {
        try {
            const { data, error } = await getSupabase().auth.refreshSession({
                refresh_token: refreshToken,
            });

            if (!error && data.session && data.user) {
                user = data.user;

                // Re-issue both cookies, then let the request continue with
                // the fresh access token so this render is already authorised.
                const response = isPublicRoute
                    ? NextResponse.redirect(new URL("/dashboard", request.nextUrl))
                    : NextResponse.next();

                response.cookies.set(
                    "sb-access-token",
                    data.session.access_token,
                    cookieOptions()
                );
                response.cookies.set(
                    "sb-refresh-token",
                    data.session.refresh_token,
                    cookieOptions()
                );
                return response;
            }
        } catch {
            // Refresh token is expired or revoked — fall through to sign-out.
        }
    }

    // Still unauthenticated on a protected route: clear the stale cookies so
    // the browser stops sending credentials that can never work again.
    if (isProtectedRoute && !user) {
        const response = NextResponse.redirect(new URL("/login", request.nextUrl));
        response.cookies.delete("sb-access-token");
        response.cookies.delete("sb-refresh-token");
        return response;
    }

    if (user && isPublicRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\.png$).*)"],
};
