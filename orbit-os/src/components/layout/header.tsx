"use client";

import { usePathname } from "next/navigation";
import { Settings, Search } from "lucide-react";
import { NotificationPopover } from "./notification-popover";
import Link from "next/link";

/** Initials for the avatar block, falling back to the Orbit "O". */
function initials(name?: string | null) {
    if (!name) return "O";
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}

export function Header({
    userName,
    userRole,
}: {
    userName?: string | null;
    userRole?: string | null;
}) {
    const pathname = usePathname();

    // Named routes only. A trailing segment that looks like an id (uuid,
    // cuid, or plain digits) falls back to its parent so detail pages
    // read "Projects" rather than a raw key.
    const segments = pathname.split("/").filter(Boolean);
    const isId = (s: string) =>
        /^[0-9]+$/.test(s) || /^c[a-z0-9]{20,}$/i.test(s) || /^[0-9a-f-]{16,}$/i.test(s);

    const named = [...segments].reverse().find((s) => !isId(s)) ?? "dashboard";
    const displayTitle =
        named === "dashboard" ? "Overview" : named.charAt(0).toUpperCase() + named.slice(1);

    return (
        <header
            style={{ zIndex: "var(--z-sticky)" }}
            className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-white/80 px-4 backdrop-blur-xl sm:px-6"
        >
            {/* pl-10 on mobile clears the fixed drawer trigger the sidebar
                renders at the same corner. */}
            <h2 className="hidden shrink-0 truncate pl-10 text-[15px] font-semibold tracking-[-0.01em] sm:block lg:pl-0">
                {displayTitle}
            </h2>

            {/* Search — a real input, not an icon button */}
            <label className="ml-10 flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-[hsl(var(--background-alt))] px-3.5 transition-[border-color,box-shadow] duration-150 focus-within:border-accent focus-within:ring-[3px] focus-within:ring-accent/35 sm:ml-0 sm:max-w-[340px] lg:ml-6">
                <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                <input
                    type="search"
                    placeholder="Search anything..."
                    aria-label="Search"
                    className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
                />
            </label>

            <div className="ml-auto flex shrink-0 items-center gap-1">
                <NotificationPopover />

                <Link
                    href="/settings"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-foreground"
                    aria-label="Settings"
                >
                    <Settings className="h-4 w-4" strokeWidth={1.75} />
                </Link>

                {/* User block */}
                <Link
                    href="/settings"
                    className="ml-1 flex items-center gap-2.5 rounded-full py-1 pl-1 pr-1 transition-colors duration-150 hover:bg-secondary sm:pr-3"
                    aria-label="Account settings"
                >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(88_45%_75%)] to-[hsl(150_25%_62%)] text-[11px] font-bold text-foreground">
                        {initials(userName)}
                    </span>
                    <span className="hidden leading-tight sm:block">
                        <span className="block max-w-[120px] truncate text-[12px] font-semibold">
                            {userName || "Your account"}
                        </span>
                        {userRole && (
                            <span className="block max-w-[120px] truncate text-[11px] text-muted-foreground">
                                {userRole}
                            </span>
                        )}
                    </span>
                </Link>
            </div>
        </header>
    );
}
