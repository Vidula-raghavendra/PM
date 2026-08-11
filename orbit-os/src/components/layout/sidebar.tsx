
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FolderOpen,
    IndianRupee,
    Clock,
    Users,
    Target,
    Settings,
    Calendar as CalendarIcon,
} from "lucide-react";

const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/dashboard/projects", icon: FolderOpen },
    { name: "Finance", href: "/dashboard/finance", icon: IndianRupee },
    { name: "Time", href: "/dashboard/time", icon: Clock },
    { name: "Calendar", href: "/dashboard/calendar", icon: CalendarIcon },
    { name: "People", href: "/dashboard/people", icon: Users },
    { name: "Goals", href: "/dashboard/goals", icon: Target },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-60 flex-col border-r border-border/40 bg-card text-foreground">
            {/* Brand */}
            <div className="flex h-14 items-center px-6 border-b border-border/20">
                <Link href="/dashboard" className="text-[15px] font-semibold tracking-tight hover:opacity-80 transition-opacity">
                    Orbit
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-3 py-4">
                <nav className="space-y-0.5">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors",
                                    isActive
                                        ? "bg-accent/10 text-accent"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <item.icon className="h-4 w-4" strokeWidth={isActive ? 2 : 1.5} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border/20">
                <Link
                    href="/settings"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors",
                        pathname === "/settings"
                            ? "bg-accent/10 text-accent"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                >
                    <Settings className="h-4 w-4" strokeWidth={1.5} />
                    Settings
                </Link>
            </div>
        </div>
    );
}
