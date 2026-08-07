import { NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { getSession } from "@/auth/session";

// The contracts bucket is private, so documents cannot be linked directly.
// This resolves a document row to a short-lived signed URL and redirects.
// RLS on both the document row and the storage object means an unauthorised
// user gets a 404 rather than a file.
export const dynamic = "force-dynamic";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const session = await getSession();
    if (!session?.accessToken) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const supabase = createSupabaseClient(session.accessToken);

    const { data: document, error } = await supabase
        .from("documents")
        .select("storage_path")
        .eq("id", id)
        .single();

    if (error || !document) {
        return new NextResponse("Not found", { status: 404 });
    }

    const { data: signed, error: signError } = await supabase.storage
        .from("contracts")
        .createSignedUrl(document.storage_path, 60);

    if (signError || !signed) {
        return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.redirect(signed.signedUrl);
}
