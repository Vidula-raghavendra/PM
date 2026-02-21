
"use client";

import { usePathname } from "next/navigation";
import { User, Bell, Search } from "lucide-react";

export function Header() {
    const pathname = usePathname();
    const title = pathname.split("/").pop() || "Dashboard";

    // Capitalize first letter
    const displayTitle = title.charAt(0).toUpperCase() + title.slice(1);

    return (
        <header className="flex h-24 items-center justify-between border-b border-border/30 bg-background/50 backdrop-blur-md px-12 sticky top-0 z-40">
            <div className="flex items-center gap-1">
                <p className="text-[11px] tracking-[0.3em] uppercase font-bold opacity-30 mt-1">Status /</p>
                <h2 className="text-3xl font-serif italic tracking-tight">{displayTitle}</h2>
            </div>

            <div className="flex items-center gap-10">
                <div className="flex items-center gap-6 text-muted-foreground opacity-60">
                    <button className="hover:text-accent transition-colors">
                        <Search className="h-4 w-4" />
                    </button>
                    <button className="hover:text-accent transition-colors">
                        <Bell className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="flex flex-col items-end">
                        <p className="text-[11px] tracking-widest uppercase font-bold group-hover:text-accent transition-colors">Resident</p>
                        <p className="text-[10px] tracking-tight opacity-40 font-medium">Session Active</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-[#E5E0D8] border border-border/50 flex items-center justify-center grayscale-[0.5] group-hover:grayscale-0 transition-all">
                        <User className="h-5 w-5 text-primary opacity-50" />
                    </div>
                </div>
            </div>
        </header>
    );
}
