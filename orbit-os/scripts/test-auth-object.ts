
import 'dotenv/config';
import { supabase } from '../src/lib/supabaseClient';

async function main() {
    console.log('Testing Supabase Auth...');

    // Attempt to sign in with a test user to verify we get a user object
    // Note: You might need to change credentials or use an existing user
    const email = "test@example.com";
    const password = "password123";

    console.log(`Attempting login for ${email}...`);

    const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.log("Login failed (expected if user doesn't exist):", error.message);
        console.log("Please create a user via the app first or use valid credentials in this script.");
    } else if (user) {
        console.log("✅ Auth Success!");
        console.log("User ID:", user.id);
        console.log("User Object:", user);
    }
}

main();
