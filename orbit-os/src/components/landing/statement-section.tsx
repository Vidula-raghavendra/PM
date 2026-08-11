/**
 * The single dark, full-bleed break in the page. The reference uses one of
 * these to reset the rhythm, with an oversized low-opacity script word bleeding
 * off the edge for depth. Here the watermark is "Paid" — the moment the whole
 * product exists to produce.
 */
export function StatementSection() {
    return (
        <section
            className="relative overflow-hidden py-28 sm:py-40 px-6 sm:px-10"
            style={{ background: "var(--gradient-ember)" }}
        >
            {/* Watermark — bleeds off the right edge, clipped by overflow */}
            <span
                className="pointer-events-none absolute select-none font-serif italic leading-none text-white/[0.045]"
                style={{
                    right: "-4%",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "clamp(12rem, 34vw, 32rem)",
                }}
                aria-hidden="true"
            >
                Paid
            </span>

            {/* Warm bloom from the lower left */}
            <div
                className="pointer-events-none absolute"
                style={{
                    left: "-10%",
                    bottom: "-30%",
                    width: "min(70vw, 760px)",
                    height: "min(70vw, 760px)",
                    background:
                        "radial-gradient(circle, hsl(31 74% 53% / 0.18) 0%, transparent 66%)",
                }}
                aria-hidden="true"
            />

            <div className="relative max-w-[1240px] mx-auto">
                <div className="max-w-[620px]">
                    <p className="text-overline uppercase text-amber-200/70 mb-7">
                        Why Orbit exists
                    </p>

                    <h2 className="font-serif text-white leading-[0.98] tracking-[-0.025em] text-[clamp(2.25rem,5.5vw,4rem)]">
                        Most tools track the work.
                        <br />
                        <em className="italic text-amber-200">Almost none</em> track
                        whether you got paid for it.
                    </h2>

                    <p className="mt-8 text-[15px] sm:text-base text-white/60 leading-relaxed max-w-[480px]">
                        A milestone is a deliverable and an invoice line at the same time.
                        Orbit treats it as one record, so progress and revenue can never
                        drift apart.
                    </p>
                </div>
            </div>
        </section>
    );
}
