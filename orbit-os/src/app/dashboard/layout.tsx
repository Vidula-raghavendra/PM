import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { cookies } from "next/headers";
import { getSession } from "@/auth/session";
import { UserService } from "@/services/user.service";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session?.userId) {
        redirect("/login");
    }

    const user = await UserService.getById(session.userId as string);

    if (!user?.phone || !user?.sector) {
        redirect("/onboarding");
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}
