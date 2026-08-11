/**
 * Revenue-split visual for the second alternating block. Shows the outcome —
 * who is owed what — rather than the form used to configure it.
 */

const people = [
    { name: "You", role: "Lead architect", pct: 60, color: "#A85F14" },
    { name: "Priya M.", role: "Interiors", pct: 25, color: "#59662F" },
    { name: "Dev R.", role: "3D visualisation", pct: 15, color: "#8B6544" },
];

export function SplitVisual() {
    return (
        <div className="relative">
            <div
                className="pointer-events-none absolute -inset-10 -z-10"
                style={{
                    background:
                        "radial-gradient(60% 55% at 50% 45%, hsl(31 74% 53% / 0.14) 0%, transparent 70%)",
                    filter: "blur(28px)",
                }}
                aria-hidden="true"
            />

            <div className="rounded-xl border border-border bg-card p-7 shadow-[0_12px_32px_-8px_hsl(27_50%_11%/0.12)]">
                <p className="text-overline uppercase text-muted-foreground mb-6">
                    Revenue split
                </p>

                <div className="space-y-7">
                    {people.map((p) => (
                        <div key={p.name}>
                            <div className="flex items-baseline justify-between gap-4 mb-2.5">
                                <div className="min-w-0">
                                    <p className="text-[14px] font-medium truncate">{p.name}</p>
                                    <p className="text-[12px] text-muted-foreground truncate">
                                        {p.role}
                                    </p>
                                </div>
                                <span className="font-serif text-[17px] tabular-nums shrink-0">
                                    {p.pct}%
                                </span>
                            </div>
                            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{ width: `${p.pct}%`, background: p.color }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-7 pt-5 border-t border-border/60 flex items-baseline justify-between">
                    <span className="text-overline uppercase text-muted-foreground">
                        Your share
                    </span>
                    <span className="font-serif text-[20px] tabular-nums">₹7,20,000</span>
                </div>
            </div>
        </div>
    );
}
