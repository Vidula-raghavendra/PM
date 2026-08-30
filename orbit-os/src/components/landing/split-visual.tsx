/**
 * Revenue-split snapshot for the Collaboration block. Shows the outcome —
 * who is owed what — rather than the form used to configure it.
 */

const people = [
    { name: "You", role: "Lead architect", pct: 60, color: "hsl(var(--accent))" },
    { name: "Priya M.", role: "Interiors", pct: 25, color: "hsl(var(--accent-deep))" },
    { name: "Dev R.", role: "3D visualisation", pct: 15, color: "hsl(200 70% 50%)" },
];

export function SplitVisual() {
    return (
        <div className="surface-card surface-card-hover p-6 sm:p-7">
            <p className="eyebrow text-muted-foreground">Revenue split</p>

            <div className="mt-6 space-y-6">
                {people.map((p) => (
                    <div key={p.name}>
                        <div className="mb-2.5 flex items-baseline justify-between gap-4">
                            <div className="min-w-0">
                                <p className="truncate text-[14px] font-semibold">{p.name}</p>
                                <p className="truncate text-[12px] text-muted-foreground">
                                    {p.role}
                                </p>
                            </div>
                            <span className="shrink-0 text-[17px] font-bold tracking-[-0.02em] tabular-nums">
                                {p.pct}%
                            </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-[hsl(0_0%_94%)]">
                            <div
                                className="h-full rounded-full"
                                style={{ width: `${p.pct}%`, background: p.color }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-7 flex items-baseline justify-between border-t border-border pt-5">
                <span className="eyebrow text-muted-foreground">Your share</span>
                <span className="text-[20px] font-bold tracking-[-0.025em] tabular-nums">
                    ₹7,20,000
                </span>
            </div>
        </div>
    );
}
