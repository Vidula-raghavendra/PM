
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
        <header className="flex h-14 items-center justify-between border-b border-border bg-background px-8 sticky top-0 z-40">
            <h2 className="text-[15px] font-semibold tracking-tight">{displayTitle}</h2>

            <div className="flex items-center gap-1">
                <button
                    className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-[100ms] ease-out"
                    aria-label="Search"
                >
                    <Search className="h-4 w-4" strokeWidth={1.5} />
                </button>

                <NotificationPopover />

                <Link
                    href="/settings"
                    className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-[100ms] ease-out ml-1"
                    aria-label="Account settings"
                >
                    <User className="h-4 w-4" strokeWidth={1.5} />
                </Link>
            </div>
        </header>
    );
}
