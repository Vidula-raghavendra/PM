import { createClient, type SupabaseClient } from '@supabase/supabase-js'

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        // Without this the underlying error is just "supabaseUrl is required",
        // which gives no clue about which variable is missing or where.
        throw new Error(
            `Missing environment variable ${name}. ` +
            `Set it in .env.local for local development, or in the Vercel project settings for deploys.`
        );
    }
    return value;
}

/**
 * Anonymous client. Subject to RLS as an unauthenticated user, so it is only
 * useful for auth calls (signUp / signInWithPassword) and token verification.
 */
let anonClient: SupabaseClient | undefined;

export function getSupabase(): SupabaseClient {
    if (!anonClient) {
        anonClient = createClient(
            requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
            requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
            { auth: { persistSession: false, autoRefreshToken: false } }
        );
    }
    return anonClient;
}

/**
 * Client acting as the signed-in user, so RLS policies apply to their rows.
 * This is what services should use.
 */
export const createSupabaseClient = (accessToken?: string): SupabaseClient =>
    createClient(
        requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
        requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
        {
            auth: { persistSession: false, autoRefreshToken: false },
            ...(accessToken
                ? { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
                : {}),
        }
    );

/**
 * Service-role client. Bypasses RLS entirely — server-side only, and only
 * where a request genuinely has to act outside a single user's permissions.
 */
export const createAdminClient = (): SupabaseClient =>
    createClient(
        requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
        requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
        { auth: { persistSession: false, autoRefreshToken: false } }
    );
