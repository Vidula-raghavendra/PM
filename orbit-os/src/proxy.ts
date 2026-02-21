import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseClient } from "@/lib/supabaseClient";

export async function proxy(request: NextRequest) {
    const protectedRoutes = ["/dashboard"];
    const publicRoutes = ["/login", "/register", "/"];

    const path = request.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some((route) =>
        path.startsWith(route)
    );
    const isPublicRoute = publicRoutes.includes(path);

    const accessToken = request.cookies.get("sb-access-token")?.value;

    // Simple check: if protected and no token, redirect
    if (isProtectedRoute && !accessToken) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    // Verify session if token exists
    let user = null;
    if (accessToken) {
        try {
            const supabase = createSupabaseClient(accessToken);
            const { data: { user: authUser }, error } = await supabase.auth.getUser();
            if (!error && authUser) {
                user = authUser;
            }
        } catch (e) {
            // Token invalid or network error
        }
    }

    if (isProtectedRoute && !user) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    // Onboarding check - this requires fetching profile which might be heavy for middleware
    // We can skip strictly enforcing this in middleware for now to avoid DB call latency
    // or rely on a separate specific cookie 'sb-onboarded' if we wanted optimization.
    // Given the prompt "Step 5... if (!session) redirect", the main goal is auth protection.
    // I will skip the complex onboarding check in middleware to keep it fast, 
    // relying on the Dashboard Layout to check profile and redirect if needed.
    // However, if the user logs in and is on /login, we should redirect to dashboard.

    if (user && isPublicRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
