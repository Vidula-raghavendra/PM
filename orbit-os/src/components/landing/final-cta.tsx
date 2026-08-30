import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";

/**
 * Final CTA band. Sits directly above the footer with no hard seam —
 * both are near-black, and the lime bloom rises from this band's bottom
 * edge across the join.
 */
export function FinalCta() {
    return (
        <section
            className="isolate-layer glow-bottom relative overflow-hidden px-5 pb-32 pt-24 sm:px-8 sm:pb-40 sm:pt-32"
            style={{ background: "linear-gradient(180deg, rgba(10,20,18,0.66) 0%, rgba(8,16,15,0.58) 100%)" }}
        >
            <Reveal scale className="relative z-10 mx-auto max-w-[720px] text-center">
                <h2 className="font-display text-[clamp(2.25rem,5.6vw,3.75rem)] font-medium italic leading-[1.1] tracking-[-0.01em] text-white">
                    Get paid for every
                    <br />
                    <span className="font-medium text-white/70">milestone you ship</span>
                </h2>

                <p className="mx-auto mt-6 max-w-[440px] text-[15px] leading-[1.6] text-white/55">
                    Free while in beta. Early users keep lifetime access to everything
                    we ship.
                </p>

                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                        href="/register"
                        className="group/cta inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-7 text-[14px] font-semibold text-accent-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-[hsl(79_98%_54%)] hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto"
                    >
                        Start free
                        <ArrowRight
                            className="h-4 w-4 transition-transform duration-[160ms] group-hover/cta:translate-x-0.5"
                            strokeWidth={2}
                        />
                    </Link>
                    <Link
                        href="/login"
                        className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/20 px-7 text-[14px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto"
                    >
                        Sign in
                    </Link>
                </div>
            </Reveal>
        </section>
    );
}
