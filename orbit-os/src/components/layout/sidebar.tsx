
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FolderOpen,
    Wallet,
    Clock,
    Users,
    Target,
    Settings,
    Calendar as CalendarIcon,
} from "lucide-react";

const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/dashboard/projects", icon: FolderOpen },
    { name: "Finance", href: "/dashboard/finance", icon: Wallet },
    { name: "Time", href: "/dashboard/time", icon: Clock },
    { name: "Calendar", href: "/dashboard/calendar", icon: CalendarIcon },
    { name: "People", href: "/dashboard/people", icon: Users },
    { name: "Goals", href: "/dashboard/goals", icon: Target },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-60 flex-col border-r border-border bg-card text-foreground">
            {/* Brand — Fraunces 18px per design system */}
            <div className="flex h-14 items-center px-6 border-b border-border">
                <Link href="/dashboard" className="font-serif text-lg tracking-tight hover:opacity-80 transition-opacity">
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
                                    "flex items-center gap-3 px-3 h-9 rounded-lg text-[13px] font-medium transition-all duration-[100ms] ease-out",
                                    isActive
                                        ? "bg-[hsl(36_87%_93%)] text-accent"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
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
            <div className="p-3 border-t border-border">
                <Link
                    href="/settings"
                    className={cn(
                        "flex items-center gap-3 px-3 h-9 rounded-lg text-[13px] font-medium transition-all duration-[100ms] ease-out",
                        pathname === "/settings"
                            ? "bg-[hsl(36_87%_93%)] text-accent"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                >
                    <Settings className="h-4 w-4" strokeWidth={1.5} />
                    Settings
                </Link>
            </div>
        </div>
    );
}
