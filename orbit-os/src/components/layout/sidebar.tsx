
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FolderOpen,
    IndianRupee,
    Clock,
    FileText,
    Users,
    Target,
    Settings,
    Calendar as CalendarIcon,
    Orbit,
} from "lucide-react";

const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/dashboard/projects", icon: FolderOpen },
    { name: "Financials", href: "/dashboard/finance", icon: IndianRupee },
    { name: "Schedule", href: "/dashboard/calendar", icon: CalendarIcon },
    { name: "Documents", href: "/dashboard/contracts", icon: FileText },
    { name: "Collaborators", href: "/dashboard/people", icon: Users },
    { name: "Ambitions", href: "/dashboard/goals", icon: Target },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-72 flex-col border-r border-border/50 bg-[#FBF9F6] text-foreground">
            {/* Branding */}
            <div className="flex h-24 items-center px-8 border-b border-border/30">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <Orbit className="h-6 w-6 text-accent group-hover:rotate-45 transition-transform duration-500" />
                    <h1 className="text-2xl font-serif italic tracking-tight">Orbit OS</h1>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-6 py-12">
                <p className="text-[11px] tracking-[0.2em] uppercase font-bold opacity-30 mb-8 px-2">Navigation</p>
                <nav className="space-y-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 px-2 py-1 text-[13px] tracking-widest uppercase font-bold transition-all duration-300",
                                    isActive
                                        ? "text-accent border-l-2 border-accent pl-4 -ml-2"
                                        : "text-muted-foreground hover:text-foreground opacity-60 hover:opacity-100"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4", isActive ? "text-accent" : "")} strokeWidth={isActive ? 2.5 : 2} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-border/30">
                <Link
                    href="/settings"
                    className={cn(
                        "flex items-center gap-4 px-2 py-1 text-[13px] tracking-widest uppercase font-bold transition-all opacity-40 hover:opacity-100",
                        pathname === "/settings" ? "text-accent opacity-100" : "text-muted-foreground"
                    )}
                >
                    <Settings className="h-4 w-4" />
                    Preferences
                </Link>
            </div>
        </div>
    );
}

