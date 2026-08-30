"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { OrbitMark } from "./orbit-mark";

const links = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
];

/**
 * Floating pill nav. It is a fixed, centred capsule with page margin
 * around it rather than a full-bleed bar, so the hero art reads behind
 * and beside it. Past 80px of scroll it picks up a backdrop blur and a
 * stronger shadow.
 */
export function LandingNav() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 80);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Escape closes the mobile sheet; lock the page behind it.
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
        <div
            style={{ zIndex: "var(--z-nav)" }}
            className="fixed inset-x-0 top-4 px-4 sm:top-6 sm:px-6"
        >
            <nav
                className={`mx-auto flex h-14 max-w-[1120px] items-center justify-between gap-4 rounded-full border pl-5 pr-2 transition-[background-color,box-shadow,border-color] duration-500 ease-out sm:pl-6 ${
                    scrolled
                        ? "border-border bg-white/90 shadow-card backdrop-blur-xl"
                        : "border-white/25 bg-white/10 shadow-none backdrop-blur-md"
                }`}
            >
                <Link
                    href="/"
                    className={`flex shrink-0 items-center gap-2 text-[17px] font-bold tracking-[-0.02em] transition-colors duration-500 ${scrolled ? "text-foreground" : "text-white"}`}
                >
                    <OrbitMark className="h-6 w-6" />
                    Orbit
                </Link>

                <div className="hidden items-center gap-1 md:flex">
                    {links.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={`rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors duration-300 ${scrolled ? "text-muted-foreground hover:bg-secondary hover:text-foreground" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <Link
                        href="/login"
                        className={`hidden rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors duration-300 sm:inline-flex ${scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/75 hover:text-white"}`}
                    >
                        Sign in
                    </Link>
                    <Link
                        href="/register"
                        className={`inline-flex h-10 items-center rounded-full px-5 text-[13px] font-semibold shadow-sm transition-[transform,background-color,color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${scrolled ? "bg-primary text-primary-foreground hover:bg-[hsl(0_0%_16%)] focus-visible:ring-ring" : "bg-white text-foreground focus-visible:ring-white focus-visible:ring-offset-transparent"}`}
                    >
                        Start free
                    </Link>
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                        className={`ml-0.5 flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 md:hidden ${scrolled ? "text-foreground hover:bg-secondary" : "text-white hover:bg-white/10"}`}
                    >
                        {open ? (
                            <X className="h-[18px] w-[18px]" strokeWidth={1.75} />
                        ) : (
                            <Menu className="h-[18px] w-[18px]" strokeWidth={1.75} />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile sheet — hangs directly below the pill */}
            <div
                className={`mx-auto mt-2 max-w-[1120px] overflow-hidden rounded-2xl border border-border bg-white shadow-card transition-all duration-300 md:hidden ${
                    open ? "max-h-80 opacity-100" : "pointer-events-none max-h-0 border-transparent opacity-0"
                }`}
            >
                <div className="flex flex-col p-2">
                    {links.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="rounded-xl px-4 py-3 text-[14px] font-medium text-foreground transition-colors duration-150 hover:bg-secondary"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/login"
                        onClick={() => setOpen(false)}
                        className="rounded-xl px-4 py-3 text-[14px] font-medium text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-foreground"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
