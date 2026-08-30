import { TrendingUp, TrendingDown } from "lucide-react";

/**
 * KPI tile. Label, big number, a delta pill, and a thin progress strip.
 * Deliberately no icon chip: an icon beside every label adds no
 * information and is the clearest tell of a generated dashboard.
 */
export function StatCard({
    label,
    value,
    caption,
    delta,
    fill = 0,
    tone = "accent",
}: {
    label: string;
    value: string | number;
    caption?: string;
    /** Percentage change vs the previous period. Omit to hide the pill. */
    delta?: number | null;
    /** 0–100, drives the strip beneath the number. */
    fill?: number;
    tone?: "accent" | "success" | "info";
}) {
    const strip =
        tone === "success"
            ? "hsl(var(--success))"
            : tone === "info"
              ? "hsl(200 70% 50%)"
              : "hsl(var(--accent))";

    const up = (delta ?? 0) >= 0;

    return (
        <div className="surface-card surface-card-hover p-5">
            <p className="eyebrow text-[11px] text-muted-foreground">{label}</p>

            <div className="mt-4 flex flex-wrap items-baseline gap-2">
                <span className="text-[28px] font-bold leading-none tracking-[-0.03em] tabular-nums">
                    {value}
                </span>
                {delta != null && (
                    <span className={`pill ${up ? "pill-success" : "pill-danger"}`}>
                        {up ? (
                            <TrendingUp className="h-2.5 w-2.5" strokeWidth={2.5} />
                        ) : (
                            <TrendingDown className="h-2.5 w-2.5" strokeWidth={2.5} />
                        )}
                        {up ? "+" : ""}
                        {delta}%
                    </span>
                )}
            </div>

            {/* Thin progress strip */}
            <div className="mt-4 h-1 overflow-hidden rounded-full bg-[hsl(0_0%_94%)]">
                <div
                    className="h-full rounded-full transition-[width] duration-500 ease-out"
                    style={{ width: `${Math.min(Math.max(fill, 0), 100)}%`, background: strip }}
                />
            </div>

            {caption && (
                <p className="mt-3 text-[12px] text-muted-foreground">{caption}</p>
            )}
        </div>
    );
}
