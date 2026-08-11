
"use client";

import { usePathname } from "next/navigation";
import { User, Search } from "lucide-react";
import { NotificationPopover } from "./notification-popover";
import Link from "next/link";

export function Header() {
    const pathname = usePathname();
    const title = pathname.split("/").pop() || "Dashboard";
    const displayTitle = title.charAt(0).toUpperCase() + title.slice(1);

    return (
        <header className="flex h-14 items-center justify-between border-b border-border/20 bg-background/80 backdrop-blur-xl px-6 sticky top-0 z-40">
            <h2 className="text-[15px] font-semibold tracking-tight">{displayTitle}</h2>

            <div className="flex items-center gap-2">
                <button
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    aria-label="Search"
                >
                    <Search className="h-4 w-4" strokeWidth={1.5} />
                </button>

                <NotificationPopover />

                <Link
                    href="/settings"
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors ml-1"
                    aria-label="Account settings"
                >
                    <User className="h-4 w-4" strokeWidth={1.5} />
                </Link>
            </div>
        </header>
    );
}
