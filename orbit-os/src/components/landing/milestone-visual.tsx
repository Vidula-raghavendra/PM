/**
 * The reference never shows a product on white — it shows the product doing its
 * job, in a warm environment. The equivalent here is not a UI screenshot but
 * the *outcome*: a payment schedule filling up as milestones get paid.
 *
 * Rendered as real markup rather than an image so it stays crisp, themeable,
 * and readable to screen readers.
 */

const phases = [
    { name: "Concept", pct: 20, amount: "₹2,40,000", state: "paid" },
    { name: "Schematic", pct: 30, amount: "₹3,60,000", state: "paid" },
    { name: "Detailed drawings", pct: 30, amount: "₹3,60,000", state: "pending" },
    { name: "Site supervision", pct: 20, amount: "₹2,40,000", state: "upcoming" },
] as const;

const stateStyles = {
    paid: {
        dot: "bg-[#59662F]",
        chip: "bg-[#EFF2E2] text-[#59662F]",
        label: "Paid",
    },
    pending: {
        dot: "bg-[#8A6015]",
        chip: "bg-[#FBF1DC] text-[#8A6015]",
        label: "Due",
    },
    upcoming: {
        dot: "bg-sand-300",
        chip: "bg-secondary text-muted-foreground",
        label: "Upcoming",
    },
} as const;

export function MilestoneVisual() {
    return (
        <div className="relative">
            {/* Ambient warmth behind the card — the reference's light bloom,
                scaled down to a UI context. */}
            <div
                className="pointer-events-none absolute -inset-10 -z-10"
                style={{
                    background:
                        "radial-gradient(60% 55% at 50% 45%, hsl(31 74% 53% / 0.16) 0%, transparent 70%)",
                    filter: "blur(28px)",
                }}
                aria-hidden="true"
            />

            <div className="rounded-xl border border-border bg-card p-7 shadow-[0_12px_32px_-8px_hsl(27_50%_11%/0.12)]">
                <div className="flex items-baseline justify-between mb-1">
                    <p className="text-overline uppercase text-muted-foreground">
                        Villa Anand — payment schedule
                    </p>
                </div>

                <p className="font-serif text-stat tabular-nums mb-1">₹12,00,000</p>
                <p className="text-[13px] text-muted-foreground mb-7">
                    <span className="text-[#59662F] font-medium">₹6,00,000 collected</span>
                    {" · "}50% of contract
                </p>

                {/* Progress rail */}
                <div className="flex gap-1 mb-8" role="img" aria-label="50 percent of contract value collected">
                    {phases.map((phase) => (
                        <div
                            key={phase.name}
                            className="h-1.5 rounded-full overflow-hidden bg-secondary"
                            style={{ flex: phase.pct }}
                        >
                            {phase.state === "paid" && (
                                <div className="h-full w-full rounded-full bg-[#59662F]" />
                            )}
                        </div>
                    ))}
                </div>

                <ul className="space-y-0">
                    {phases.map((phase) => {
                        const s = stateStyles[phase.state];
                        return (
                            <li
                                key={phase.name}
                                className="flex items-center gap-3 py-3 border-b border-border/60 last:border-0"
                            >
                                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${s.dot}`} />
                                <span className="text-[14px] flex-1 min-w-0 truncate">
                                    {phase.name}
                                </span>
                                <span className="font-serif text-[14px] tabular-nums">
                                    {phase.amount}
                                </span>
                                <span
                                    className={`text-[11px] font-medium rounded-full px-2 py-0.5 w-[72px] text-center shrink-0 ${s.chip}`}
                                >
                                    {s.label}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
