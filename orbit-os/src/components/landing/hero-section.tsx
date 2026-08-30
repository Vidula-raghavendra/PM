"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroBackdrop } from "./hero-backdrop";
import { ProductShot } from "./product-shot";

/**
 * Drop a landscape photograph at this path (under /public) and the hero
 * renders it instead of the coded field. One constant, one file — nothing
 * else about the layout changes.
 */
const HERO_PHOTO: string | undefined = "/hero-field-wide.jpg";

export function HeroSection() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setLoaded(true));
        return () => cancelAnimationFrame(id);
    }, []);

    /**
     * One authored entrance: the type rises out of the landscape and
     * resolves from blur, the way a subject settles into focus. Ordered so
     * the eye lands on the headline first and the screenshot last.
     */
    const rise = (delay: number, distance = 24) => ({
        opacity: loaded ? 1 : 0,
        transform: loaded ? "none" : `translateY(${distance}px)`,
        filter: loaded ? "blur(0px)" : "blur(10px)",
        transition: `opacity 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms, filter 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    });

    return (
        <section className="isolate-layer pt-20 sm:pt-32">
            <HeroBackdrop photo={HERO_PHOTO} />

            <div className="layer-content mx-auto w-full max-w-[1120px] px-5 sm:px-8">
                <h1
                    className="mx-auto max-w-[18ch] text-center font-tagline text-[clamp(2.25rem,7.4vw,5.25rem)] font-normal leading-[1.08] tracking-[-0.01em] text-white [text-shadow:0_2px_40px_rgba(20,26,12,0.55)]"
                    style={rise(60, 28)}
                >
                    Track every milestone,
                    <br />
                    <span className="text-white/75">get paid for it</span>
                </h1>

                <p
                    className="mx-auto mt-5 max-w-[52ch] text-center text-[17px] leading-[1.6] text-white/90 [text-shadow:0_1px_18px_rgba(20,26,12,0.5)]"
                    style={rise(180, 20)}
                >
                    Milestones, payments, time tracking and revenue splits — one
                    workspace for people who bill by the deliverable.
                </p>

                <div
                    className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row"
                    style={rise(300, 16)}
                >
                    <Link
                        href="/register"
                        className="group/cta inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-8 text-[14px] font-semibold text-foreground shadow-[0_2px_20px_rgba(20,26,12,0.28)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(20,26,12,0.36)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:w-auto"
                    >
                        Start free
                        <ArrowRight
                            className="h-4 w-4 transition-transform duration-300 ease-out group-hover/cta:translate-x-1"
                            strokeWidth={2}
                        />
                    </Link>
                    <Link
                        href="#features"
                        className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/50 bg-black/25 px-8 text-[14px] font-semibold text-white backdrop-blur-md transition-[transform,background-color,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-white/80 hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:w-auto"
                    >
                        See how it works
                    </Link>
                </div>
            </div>

            {/* The screenshot rises into the lower third of the landscape and
                bleeds across the section seam into the page below. */}
            <div
                className="layer-content mx-auto mt-[13vw] w-full max-w-[1120px] px-5 sm:mt-[14vw] sm:px-8"
                style={{ ...rise(460, 40), marginBottom: "var(--hero-overhang)" }}
            >
                <div className="float-soft">
                    <ProductShot />
                </div>
            </div>
        </section>
    );
}
