import { Check } from "lucide-react";

/**
 * Payment-schedule snapshot for the Payments block. Real markup rather
 * than an image so it stays crisp, themeable and readable to screen
 * readers, and so its status pills come from the same system the real
 * dashboard uses.
 */

const phases = [
    { name: "Concept", pct: 20, amount: "₹2,40,000", state: "paid" },
    { name: "Schematic", pct: 30, amount: "₹3,60,000", state: "paid" },
    { name: "Detailed drawings", pct: 30, amount: "₹3,60,000", state: "pending" },
    { name: "Site supervision", pct: 20, amount: "₹2,40,000", state: "upcoming" },
] as const;

const stateStyles = {
    paid: { pill: "pill-success", label: "Paid", done: true },
    pending: { pill: "pill-warning", label: "Due", done: false },
    upcoming: { pill: "pill-neutral", label: "Upcoming", done: false },
} as const;

export function MilestoneVisual() {
    return (
        <div className="surface-card surface-card-hover p-6 sm:p-7">
            <p className="eyebrow text-muted-foreground">
                Villa Anand — payment schedule
            </p>

            <p className="mt-3 text-[32px] font-bold leading-none tracking-[-0.03em] tabular-nums">
                ₹12,00,000
            </p>
            <p className="mt-2 text-[13px] text-muted-foreground">
                <span className="font-semibold text-success">₹6,00,000 collected</span>
                {" · "}50% of contract
            </p>

            {/* Progress rail */}
            <div
                className="mt-6 flex gap-1"
                role="img"
                aria-label="50 percent of contract value collected"
            >
                {phases.map((phase) => (
                    <div
                        key={phase.name}
                        className="h-1.5 overflow-hidden rounded-full bg-[hsl(0_0%_94%)]"
                        style={{ flex: phase.pct }}
                    >
                        {phase.state === "paid" && (
                            <div className="h-full w-full rounded-full bg-accent" />
                        )}
                    </div>
                ))}
            </div>

            <ul className="mt-7">
                {phases.map((phase) => {
                    const s = stateStyles[phase.state];
                    return (
                        <li
                            key={phase.name}
                            className="flex items-center gap-3 border-b border-border py-3 last:border-0"
                        >
                            <span
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                                    s.done
                                        ? "bg-success-bg text-success"
                                        : "bg-[hsl(0_0%_95%)] text-muted-foreground"
                                }`}
                            >
                                {s.done && <Check className="h-3 w-3" strokeWidth={3} />}
                            </span>
                            <span className="min-w-0 flex-1 truncate text-[14px]">
                                {phase.name}
                            </span>
                            <span className="shrink-0 text-[14px] font-semibold tabular-nums">
                                {phase.amount}
                            </span>
                            <span className={`pill w-[74px] justify-center ${s.pill}`}>
                                {s.label}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
