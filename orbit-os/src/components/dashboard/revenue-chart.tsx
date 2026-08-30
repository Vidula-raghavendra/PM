"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/utils";

type Point = { label: string; value: number };

const RANGES = [
    { key: "W", months: 3 },
    { key: "M", months: 12 },
    { key: "Q", months: 6 },
    { key: "Y", months: 12 },
] as const;

/**
 * Revenue over time. The range toggle slices the trailing-12 series the
 * server already computed, so switching ranges costs nothing and never
 * shows a loading state. The tooltip is a dark card pinned above the
 * hovered bar with that bar's exact value.
 */
export function RevenueChart({ series }: { series: Point[] }) {
    const [range, setRange] = useState<string>("M");
    const [hover, setHover] = useState<number | null>(null);

    const months = RANGES.find((r) => r.key === range)?.months ?? 12;
    const data = series.slice(-months);
    const max = Math.max(...data.map((d) => d.value), 1);
    const hasRevenue = data.some((d) => d.value > 0);
    const peakIndex = data.reduce(
        (best, d, i) => (d.value > data[best].value ? i : best),
        0
    );

    return (
        <div className="surface-card flex h-full flex-col p-5 sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p className="text-[15px] font-semibold tracking-[-0.01em]">
                        Revenue Overview
                    </p>
                    <p className="mt-0.5 text-[13px] text-muted-foreground">
                        Paid milestones over time
                    </p>
                </div>

                <div
                    className="flex shrink-0 items-center gap-0.5 rounded-full bg-[hsl(var(--background-alt))] p-1"
                    role="group"
                    aria-label="Time range"
                >
                    {RANGES.map((r) => (
                        <button
                            key={r.key}
                            type="button"
                            onClick={() => setRange(r.key)}
                            aria-pressed={range === r.key}
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                                range === r.key
                                    ? "bg-accent text-accent-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {r.key}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative flex min-h-[180px] flex-1 items-end gap-1.5 sm:gap-2">
                {data.map((d, i) => {
                    const pct = hasRevenue ? Math.max((d.value / max) * 100, 2) : 2;
                    // With nothing hovered the peak month carries the accent, so
                    // the chart reads as finished rather than uniformly grey.
                    const isHot = hover === null ? hasRevenue && i === peakIndex : hover === i;
                    return (
                        <div
                            key={`${d.label}-${i}`}
                            className="group/bar relative flex min-w-0 flex-1 cursor-default flex-col items-center justify-end gap-2"
                            style={{ height: "100%" }}
                            onMouseEnter={() => setHover(i)}
                            onMouseLeave={() => setHover(null)}
                        >
                            {/* Dark tooltip card */}
                            {isHot && hasRevenue && (
                                <div
                                    className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 shadow-card"
                                    role="tooltip"
                                >
                                    <span className="block text-[12px] font-bold text-white tabular-nums">
                                        {formatMoney(d.value)}
                                    </span>
                                    <span className="block text-[10px] text-white/55">
                                        {d.label}
                                    </span>
                                </div>
                            )}

                            <div
                                className="w-full rounded-t-[4px] transition-[background] duration-150"
                                style={{
                                    height: `${pct}%`,
                                    background: isHot
                                        ? "linear-gradient(180deg, hsl(var(--accent)) 0%, hsl(var(--accent-deep)) 100%)"
                                        : "hsl(0 0% 92%)",
                                }}
                            />
                            <span className="text-[10px] text-muted-foreground">
                                {d.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {!hasRevenue && (
                <p className="mt-4 text-center text-[13px] text-muted-foreground">
                    No paid milestones yet — revenue appears here as you get paid.
                </p>
            )}
        </div>
    );
}
