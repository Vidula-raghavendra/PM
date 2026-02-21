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
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/dashboard/projects", icon: FolderOpen },
    { name: "Finance", href: "/dashboard/finance", icon: IndianRupee },
    { name: "Calendar", href: "/dashboard/calendar", icon: CalendarIcon },
    { name: "Contracts", href: "/dashboard/contracts", icon: FileText },
    { name: "People", href: "/dashboard/people", icon: Users },
    { name: "Goals", href: "/dashboard/goals", icon: Target },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col border-r bg-card text-card-foreground">
            <div className="flex h-16 items-center border-b px-6">
                <h1 className="text-xl font-bold tracking-tight text-primary">OrbitOS</h1>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
                <nav className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="border-t p-4">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                    <Settings className="h-5 w-5" />
                    Settings
                </Link>
            </div>
        </div>
    );
}
