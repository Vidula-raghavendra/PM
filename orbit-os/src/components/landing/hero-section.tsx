"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Wallet, Clock3, Users } from "lucide-react";
import { DuskCanvas } from "./dusk-canvas";

/**
 * Asymmetric hero: full-bleed environmental light, proof chips floating at the
 * upper left, and the display headline anchored bottom-left over the image.
 * The headline is deliberately oversized — scale contrast is what separates an
 * editorial layout from a template.
 */

const chips = [
    { icon: Wallet, value: "Milestone", label: "= invoice" },
    { icon: Clock3, value: "One place", label: "for every deadline" },
    { icon: Users, value: "Revenue splits", label: "built in" },
];

export function HeroSection() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 60);
        return () => clearTimeout(timer);
    }, []);

    // Staged entrance — each element trails the last so the eye is led from
    // the headline down to the CTA rather than everything arriving at once.
    const rise = (delay: number, distance = 20) => ({
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : `translateY(${distance}px)`,
        transition: `opacity 0.9s ease ${delay}ms, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    });

    return (
        <section className="relative min-h-[92vh] flex flex-col justify-end overflow-hidden">
            <DuskCanvas />

            {/* Proof chips — pinned to the upper left, mirroring the reference's
                floating stat pills over the photograph. */}
            <div className="absolute top-24 left-0 right-0 sm:top-28">
                <div className="max-w-[1240px] mx-auto px-6 sm:px-10">
                    <div className="flex flex-col items-start gap-2.5 sm:gap-3">
                        {chips.map((chip, i) => (
                            <div
                                key={chip.value}
                                className="flex items-center gap-3 rounded-full border border-white/15 bg-black/25 px-4 py-2 backdrop-blur-md"
                                style={rise(500 + i * 110, 12)}
                            >
                                <chip.icon
                                    className="h-3.5 w-3.5 text-amber-200"
                                    strokeWidth={1.5}
                                />
                                <span className="text-[13px] font-medium text-white">
                                    {chip.value}
                                </span>
                                <span className="text-[12px] text-white/55">{chip.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Headline block — bottom-left anchored, not centered */}
            <div className="relative max-w-[1240px] mx-auto w-full px-6 sm:px-10 pb-16 sm:pb-24">
                <div className="max-w-[900px]">
                    <p
                        className="text-overline uppercase text-amber-200/80 mb-6"
                        style={rise(120, 10)}
                    >
                        Free during beta
                    </p>

                    <h1
                        className="font-serif text-white leading-[0.86] tracking-[-0.035em] text-[clamp(3.25rem,10vw,8.5rem)]"
                        style={rise(220, 28)}
                    >
                        Get paid for
                        <br />
                        <em className="italic">every</em> milestone
                    </h1>

                    <div className="mt-9 flex flex-col sm:flex-row sm:items-end gap-8 sm:gap-14">
                        <p
                            className="text-[15px] sm:text-base text-white/70 leading-relaxed max-w-[420px]"
                            style={rise(400, 18)}
                        >
                            Milestones, payments, time tracking and revenue splits — one
                            workspace for people who bill by the deliverable.
                        </p>

                        <div style={rise(520, 14)}>
                            <Link
                                href="/register"
                                className="group/cta inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-7 text-[13px] font-semibold text-espresso transition-transform duration-[160ms] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                                style={{ color: "#2B1A0E" }}
                            >
                                Start free
                                <ArrowRight
                                    className="h-4 w-4 transition-transform duration-[160ms] group-hover/cta:translate-x-0.5"
                                    strokeWidth={2}
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
