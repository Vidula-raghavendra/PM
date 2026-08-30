import Image from "next/image";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
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
        <div className="relative flex h-screen overflow-hidden">
            {/* The same landscape as the marketing site, blurred far back so
                the app feels like one place with it rather than a separate
                product. Data surfaces stay opaque on top. */}
            <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
                <Image
                    src="/hero-field-wide.jpg"
                    alt=""
                    fill
                    loading="eager"
                    unoptimized
                    sizes="100vw"
                    className="scale-125 object-cover object-center blur-[140px]"
                />
                <div className="absolute inset-0 bg-[hsl(var(--background-alt))]/[0.965]" />
            </div>
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <Header userName={user.fullName} userRole={user.sector} />
                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
