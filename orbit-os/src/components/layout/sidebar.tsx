"use client";

import { useEffect, useState } from "react";
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
    Menu,
    X,
    Calendar as CalendarIcon,
} from "lucide-react";
import { OrbitMark } from "@/components/landing/orbit-mark";

const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/dashboard/projects", icon: FolderOpen },
    { name: "Finance", href: "/dashboard/finance", icon: Wallet },
    { name: "Time", href: "/dashboard/time", icon: Clock },
    { name: "Calendar", href: "/dashboard/calendar", icon: CalendarIcon },
    { name: "People", href: "/dashboard/people", icon: Users },
    { name: "Goals", href: "/dashboard/goals", icon: Target },
];

/**
 * Desktop rail (lg+) plus a mobile drawer. Below lg the 240px rail would
 * eat most of a phone screen and push the content column off-viewport,
 * so it collapses behind a menu button in the header.
 */
export function Sidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    // Escape closes; body scroll locks while the drawer covers the page.
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open]);

    return (
        <>
            {/* Mobile trigger — sits in the header's leading slot */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open navigation"
                aria-expanded={open}
                className="fixed left-4 top-4 z-[45] flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
            >
                <Menu className="h-4 w-4" strokeWidth={1.5} />
            </button>

            {/* Scrim */}
            <div
                onClick={() => setOpen(false)}
                aria-hidden="true"
                className={cn(
                    "fixed inset-0 z-[46] bg-black/40 backdrop-blur-[3px] transition-opacity duration-300 lg:hidden",
                    open ? "opacity-100" : "pointer-events-none opacity-0"
                )}
            />

            <SidebarPanel
                pathname={pathname}
                onNavigate={() => setOpen(false)}
                className={cn(
                    "fixed inset-y-0 left-0 z-[47] transition-transform duration-300 ease-out lg:hidden",
                    open ? "translate-x-0" : "-translate-x-full"
                )}
                onClose={() => setOpen(false)}
                showClose
            />

            {/* Desktop rail */}
            <SidebarPanel
                pathname={pathname}
                className="hidden lg:flex"
            />
        </>
    );
}

function SidebarPanel({
    pathname,
    className,
    onNavigate,
    onClose,
    showClose = false,
}: {
    pathname: string;
    className?: string;
    onNavigate?: () => void;
    onClose?: () => void;
    showClose?: boolean;
}) {
    return (
        <div
            className={cn(
                "flex h-full w-60 shrink-0 flex-col border-r border-border bg-white/80 text-foreground backdrop-blur-xl",
                className
            )}
        >
            {/* Brand */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
                <Link
                    href="/dashboard"
                    onClick={onNavigate}
                    className="flex items-center gap-2 text-[16px] font-bold tracking-[-0.02em] transition-opacity hover:opacity-80"
                >
                    <OrbitMark className="h-6 w-6" />
                    Orbit
                </Link>
                {showClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close navigation"
                        className="-mr-2 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                        <X className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-3 py-4">
                <nav className="space-y-0.5">
                    {navigation.map((item) => {
                        // Nested routes keep their section lit — /projects/new
                        // and /projects/[id] both belong to Projects. Overview
                        // is exact-match so every route does not light it.
                        const isActive =
                            item.href === "/dashboard"
                                ? pathname === item.href
                                : pathname === item.href || pathname.startsWith(`${item.href}/`);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onNavigate}
                                aria-current={isActive ? "page" : undefined}
                                className={cn(
                                    "group relative flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors duration-150 ease-out",
                                    isActive
                                        ? "bg-accent text-accent-foreground"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                )}
                            >
                                <item.icon
                                    className="h-4 w-4 shrink-0"
                                    strokeWidth={isActive ? 2 : 1.5}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-border p-3">
                <Link
                    href="/settings"
                    onClick={onNavigate}
                    aria-current={pathname === "/settings" ? "page" : undefined}
                    className={cn(
                        "group relative flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors duration-150 ease-out",
                        pathname === "/settings"
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                >
                    <Settings
                        className="h-4 w-4 shrink-0"
                        strokeWidth={pathname === "/settings" ? 2 : 1.5}
                    />
                    Settings
                </Link>
            </div>
        </div>
    );
}
