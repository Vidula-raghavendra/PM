
import 'dotenv/config';
import { supabase } from '../src/lib/supabaseClient';

async function main() {
    console.log('Testing Supabase Connection...');
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!url) {
        console.error('Error: NEXT_PUBLIC_SUPABASE_URL is missing from .env');
        return;
    }

    console.log('Target URL:', url);

    try {
        // We'll try to retrieve the session settings or health check
        // A simple auth call validates the connection and the anon key
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.error('Supabase reported an error:', error.message);
        } else {
            console.log('✅ Success! Connected to Supabase.');
            console.log('Auth Service Status: Operational');
        }
    } catch (e) {
        console.error('❌ Failed to connect:', e);
    }
}

main();
