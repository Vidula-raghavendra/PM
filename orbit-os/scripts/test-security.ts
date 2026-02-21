
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// We need two users to test RLS. 
// Since we can't easily create users with passwords via script without admin API (which we have but let's keep it simple),
// we will assume the user has created at least one user via the UI or previous scripts.
// Ideally, we'd sign up two users here.

async function main() {
    console.log("🔒 Starting Security Check (RLS)...");

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    // Client A
    const supabaseA = createClient(url, key);
    // Client B
    const supabaseB = createClient(url, key);

    const ts = Date.now();

    // Helper to get or create user
    async function getOrCreateUser(client: any, email: string, pass: string) {
        // Try sign in first
        const { data: signInData, error: signInError } = await client.auth.signInWithPassword({
            email,
            password: pass
        });

        if (!signInError && signInData.user) {
            console.log(`✅ Logged in as ${email}`);
            return signInData;
        }

        // If sign in fails, try sign up
        console.log(`Creating user ${email}...`);
        const { data: signUpData, error: signUpError } = await client.auth.signUp({
            email,
            password: pass
        });

        if (signUpError) {
            console.error(`Error creating/logging in ${email}:`, signUpError.message);
            throw signUpError;
        }

        console.log(`✅ Created user ${email}`);
        return signUpData;
    }

    const password = "password123";

    // 1. Setup User A
    const emailA = "alice@example.com";
    let authA;
    try {
        authA = await getOrCreateUser(supabaseA, emailA, password);
    } catch (e) { return; }

    // 2. Setup User B
    const emailB = "bob@example.com";
    let authB;
    try {
        authB = await getOrCreateUser(supabaseB, emailB, password);
    } catch (e) { return; }

    // Wait for sessions to be active (auto sign in usually works)

    // 3. User A creates a project
    console.log("User A creating project...");
    const { data: projectA, error: projErr } = await supabaseA
        .from("projects")
        .insert({ title: "Secret Project A", status: "ACTIVE", owner_id: authA.user!.id }) // owner_id needed if not auto-set by default constraint or trigger, but RLS usually checks auth.uid() match on insert
        .select()
        .single();

    if (projErr) { console.error("User A failed to create project:", projErr.message); return; }
    console.log(`Project created: ${projectA.id}`);

    // 4. User B tries to fetch User A's project
    console.log("User B trying to access User A's project...");
    const { data: stolenData, error: stealErr } = await supabaseB
        .from("projects")
        .select("*")
        .eq("id", projectA.id)
        .single();

    if (stolenData) {
        console.error("❌ SECURITY FAIL: User B can see User A's project!");
        console.error(stolenData);
    } else {
        console.log("✅ SECURITY PASS: User B cannot see User A's project.");
        // Expecting error "JSON object requested, multiple (or no) rows returned" or null data
    }

    // 5. User B tries to insert a task into User A's project
    console.log("User B trying to add task to User A's project...");
    const { data: task, error: taskErr } = await supabaseB
        .from("tasks")
        .insert({
            title: "Malicious Task",
            project_id: projectA.id,
            status: "TODO",
            user_id: authB.user!.id
        })
        .select();

    // The policy "Users can view tasks of accessible projects" checks project ownership / collaboration.
    // If insert policy explicitly checks project ownership, this should fail.
    // If we only have "Owners can manage tasks" policy:
    if (task && task.length > 0) {
        console.error("❌ SECURITY FAIL: User B added task to User A's project!");
    } else {
        console.log("✅ SECURITY PASS: User B could not add task (RLS blocked or no rows returned).");
        if (taskErr) console.log("   -> Error:", taskErr.message);
    }
}

main();
