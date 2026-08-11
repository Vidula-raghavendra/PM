"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * The nav sits transparent over the hero so the image runs full-bleed, then
 * takes a solid background once it leaves the hero. Without the swap, white
 * nav text lands on cream paper and disappears entirely.
 */
export function LandingNav() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
                scrolled
                    ? "bg-background/85 backdrop-blur-xl border-b border-border/60"
                    : "bg-transparent"
            }`}
        >
            <div
                className={`max-w-[1240px] mx-auto px-6 sm:px-10 flex items-center justify-between transition-[height] duration-300 ${
                    scrolled ? "h-16" : "h-20"
                }`}
            >
                <Link
                    href="/"
                    className={`font-serif text-[19px] tracking-tight transition-colors duration-300 ${
                        scrolled ? "text-foreground" : "text-white"
                    }`}
                >
                    Orbit
                </Link>

                <div
                    className={`hidden sm:flex items-center gap-9 text-[13px] transition-colors duration-300 ${
                        scrolled ? "text-muted-foreground" : "text-white/60"
                    }`}
                >
                    <Link
                        href="#features"
                        className={`transition-colors duration-[100ms] ${
                            scrolled ? "hover:text-foreground" : "hover:text-white"
                        }`}
                    >
                        Features
                    </Link>
                    <Link
                        href="#pricing"
                        className={`transition-colors duration-[100ms] ${
                            scrolled ? "hover:text-foreground" : "hover:text-white"
                        }`}
                    >
                        Pricing
                    </Link>
                </div>

                <Link
                    href="/login"
                    className={`text-[13px] transition-colors duration-[100ms] ${
                        scrolled
                            ? "text-muted-foreground hover:text-foreground"
                            : "text-white/75 hover:text-white"
                    }`}
                >
                    Sign in
                </Link>
            </div>
        </nav>
    );
}
