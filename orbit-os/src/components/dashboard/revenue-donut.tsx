import { PieChart } from "lucide-react";
import { formatMoney } from "@/lib/utils";

type Slice = { title: string; value: number; pct: number };

/**
 * Revenue-by-project breakdown. The ring is a conic-gradient rather than
 * a charting library — no runtime dependency, and it inherits the token
 * palette directly.
 */

const COLORS = [
    "hsl(var(--accent))",
    "hsl(var(--accent-deep))",
    "hsl(200 70% 50%)",
    "hsl(38 85% 55%)",
    "hsl(0 0% 82%)",
];

export function RevenueDonut({
    breakdown,
    total,
}: {
    breakdown: Slice[];
    total: number;
}) {
    const hasData = breakdown.length > 0 && total > 0;

    let acc = 0;
    const stops = hasData
        ? breakdown
              .map((s, i) => {
                  const from = acc;
                  acc += s.pct;
                  return `${COLORS[i % COLORS.length]} ${from}% ${acc}%`;
              })
              .join(", ")
        : "hsl(0 0% 93%) 0% 100%";

    return (
        <div className="surface-card flex h-full flex-col p-5 sm:p-6">
            <div className="mb-5 flex items-start justify-between">
                <div>
                    <p className="text-[15px] font-semibold tracking-[-0.01em]">
                        Revenue by project
                    </p>
                    <p className="mt-0.5 text-[13px] text-muted-foreground">
                        Share of paid milestones
                    </p>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--background-alt))] ring-1 ring-border">
                    <PieChart className="h-4 w-4 text-accent-ink" strokeWidth={1.75} />
                </span>
            </div>

            <div className="relative mx-auto h-[152px] w-[152px] shrink-0">
                <div
                    className="h-full w-full rounded-full"
                    style={{ background: `conic-gradient(${stops})` }}
                    role="img"
                    aria-label={
                        hasData
                            ? `Revenue split across ${breakdown.length} projects`
                            : "No revenue recorded yet"
                    }
                />
                <div className="absolute inset-[22px] flex flex-col items-center justify-center rounded-full bg-card">
                    <span className="text-[18px] font-bold leading-none tracking-[-0.025em] tabular-nums">
                        {hasData ? `${breakdown[0].pct}%` : "—"}
                    </span>
                    <span className="mt-1 text-[10px] text-muted-foreground">
                        {hasData ? "Top project" : "No data"}
                    </span>
                </div>
            </div>

            {hasData ? (
                <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5">
                    {breakdown.map((s, i) => (
                        <div key={s.title} className="flex items-center gap-2">
                            <span
                                className="h-2 w-2 shrink-0 rounded-full"
                                style={{ background: COLORS[i % COLORS.length] }}
                            />
                            <span className="min-w-0 flex-1 truncate text-[12px] text-muted-foreground">
                                {s.title}
                            </span>
                            <span className="shrink-0 text-[12px] font-semibold tabular-nums">
                                {s.pct}%
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-6 text-center text-[13px] text-muted-foreground">
                    Mark a milestone paid to see how revenue splits across projects.
                </p>
            )}

            {hasData && (
                <div className="mt-auto flex items-baseline justify-between border-t border-border pt-4">
                    <span className="eyebrow text-[11px] text-muted-foreground">Total</span>
                    <span className="text-[15px] font-bold tabular-nums">
                        {formatMoney(total)}
                    </span>
                </div>
            )}
        </div>
    );
}
