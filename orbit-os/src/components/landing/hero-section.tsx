"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Small delay so the entrance animation is visible
        const timer = setTimeout(() => setLoaded(true), 50);

        const section = sectionRef.current;
        if (!section) return () => clearTimeout(timer);

        const handleMouseMove = (e: MouseEvent) => {
            const rect = section.getBoundingClientRect();
            setMousePos({
                x: (e.clientX - rect.left) / rect.width,
                y: (e.clientY - rect.top) / rect.height,
            });
        };

        section.addEventListener("mousemove", handleMouseMove);
        return () => {
            clearTimeout(timer);
            section.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative pt-36 pb-28 sm:pt-48 sm:pb-36 px-6 overflow-hidden">
            {/* Dual gradient orbs — mouse reactive */}
            <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-[1.5s]"
                style={{ opacity: loaded ? 1 : 0 }}
            >
                {/* Primary violet orb */}
                <div
                    className="absolute w-[800px] h-[800px] rounded-full"
                    style={{
                        left: `calc(${mousePos.x * 100}% - 400px)`,
                        top: `calc(${mousePos.y * 100}% - 400px)`,
                        background: "radial-gradient(circle, hsl(258 65% 58% / 0.07) 0%, transparent 70%)",
                        transition: "left 0.8s cubic-bezier(0.16, 1, 0.3, 1), top 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                />
                {/* Secondary blue orb — offset, moves slower */}
                <div
                    className="absolute w-[600px] h-[600px] rounded-full"
                    style={{
                        left: `calc(${mousePos.x * 60 + 20}% - 300px)`,
                        top: `calc(${mousePos.y * 60 + 30}% - 300px)`,
                        background: "radial-gradient(circle, hsl(220 80% 60% / 0.05) 0%, transparent 70%)",
                        transition: "left 1.2s cubic-bezier(0.16, 1, 0.3, 1), top 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                />
            </div>

            <div className="max-w-[720px] mx-auto text-center relative">
                {/* Heading */}
                <h1
                    className="text-[clamp(2.5rem,6.5vw,4.5rem)] font-serif leading-[1.08] tracking-tight mb-5"
                    style={{
                        opacity: loaded ? 1 : 0,
                        transform: loaded ? "translateY(0)" : "translateY(24px)",
                        transition: "opacity 0.8s ease 0.15s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
                    }}
                >
                    Manage projects,{" "}
                    <span className="italic bg-gradient-to-r from-[hsl(258,65%,58%)] to-[hsl(220,80%,55%)] bg-clip-text text-transparent">
                        not spreadsheets
                    </span>
                </h1>

                {/* Subheading */}
                <p
                    className="text-muted-foreground text-[17px] sm:text-lg leading-relaxed max-w-[480px] mx-auto mb-9"
                    style={{
                        opacity: loaded ? 1 : 0,
                        transform: loaded ? "translateY(0)" : "translateY(18px)",
                        transition: "opacity 0.8s ease 0.3s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
                    }}
                >
                    Milestones, payments, time tracking, and revenue splits — in one workspace built for freelancers.
                </p>

                {/* Single CTA */}
                <div
                    style={{
                        opacity: loaded ? 1 : 0,
                        transform: loaded ? "translateY(0)" : "translateY(14px)",
                        transition: "opacity 0.8s ease 0.45s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.45s",
                    }}
                >
                    <Button asChild size="lg" className="group/btn rounded-full h-11 px-7 text-[14px] font-medium">
                        <Link href="/register">
                            Get started — it&apos;s free
                            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
