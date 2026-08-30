/**
 * The mid-page dark break that resets the rhythm. Ink ground with a
 * single low lime bloom — no watermark type, which is what made the
 * old version read as doubled at narrow widths.
 */
export function StatementSection() {
    return (
        <section
            className="isolate-layer relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32"
            style={{ background: "linear-gradient(180deg, rgba(10,20,18,0.62) 0%, rgba(8,16,15,0.78) 100%)" }}
        >
            <div className="layer-decor" aria-hidden="true">
                <div
                    className="absolute"
                    style={{
                        left: "-12%",
                        bottom: "-40%",
                        width: "min(70vw, 820px)",
                        height: "min(70vw, 820px)",
                        background:
                            "radial-gradient(circle, hsl(var(--accent) / 0.16) 0%, transparent 66%)",
                        filter: "blur(70px)",
                    }}
                />
            </div>

            <div className="layer-content mx-auto max-w-[1120px]">
                <div className="max-w-[680px]">
                    <p className="eyebrow mb-6 text-[hsl(var(--accent))]">
                        Why Orbit exists
                    </p>

                    <h2 className="font-display text-[clamp(2.25rem,5.2vw,3.75rem)] font-medium italic leading-[1.12] tracking-[-0.01em] text-white">
                        Most tools track the work.
                        <br />
                        <span className="text-[hsl(var(--accent))]">Almost none</span> track
                        whether you got paid for it.
                    </h2>

                    <p className="mt-7 max-w-[500px] text-[16px] leading-[1.6] text-white/55">
                        A milestone is a deliverable and an invoice line at the same time.
                        Orbit treats it as one record, so progress and revenue can never
                        drift apart.
                    </p>
                </div>
            </div>
        </section>
    );
}
