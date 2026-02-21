import { getSession } from "@/auth/session";
import { redirect } from "next/navigation";

export async function requireUser() {
    const session = await getSession();

    if (!session || !session.userId) {
        redirect("/login");
    }

    return session.userId as string;
}
