import {
    LayoutDashboard,
    FolderOpen,
    Wallet,
    Clock,
    Calendar as CalendarIcon,
    Search,
    Bell,
    Settings,
    Check,
} from "lucide-react";
import { OrbitMark } from "./orbit-mark";

/**
 * The Orbit dashboard, rendered as real markup rather than a bitmap so
 * it stays crisp at every density and inherits the design tokens. This
 * is the hero's anchor image — it sits in a white card with a heavy
 * shadow and bleeds out of the hero into the section below.
 *
 * It mirrors the real dashboard's structure exactly (KPI row, bar chart
 * with range toggle, donut breakdown, milestone list), so what the
 * marketing page promises is what the product delivers.
 */

const kpis = [
    { label: "Total Milestones", value: "42", delta: "+12.5%", up: true, bar: "hsl(var(--accent))", fill: 72 },
    { label: "Revenue", value: "₹12.4L", delta: "+17.1%", up: true, bar: "hsl(var(--success))", fill: 58 },
    { label: "Time Logged", value: "168h", delta: "+24%", up: true, bar: "hsl(200 70% 50%)", fill: 84 },
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const barHeights = [38, 52, 44, 66, 48, 96, 58, 42, 70, 54, 78, 46];
const HIGHLIGHT = 5;

const sources = [
    { label: "Villa Anand", pct: 38, color: "hsl(var(--accent))" },
    { label: "Retail fitout", pct: 27, color: "hsl(var(--accent-deep))" },
    { label: "Studio brand", pct: 19, color: "hsl(200 70% 50%)" },
    { label: "Other", pct: 16, color: "hsl(0 0% 82%)" },
];

const milestones = [
    { name: "Concept", amount: "₹2,40,000", state: "success", label: "Paid" },
    { name: "Schematic", amount: "₹3,60,000", state: "success", label: "Paid" },
    { name: "Detailed drawings", amount: "₹3,60,000", state: "warning", label: "Due" },
    { name: "Site supervision", amount: "₹2,40,000", state: "neutral", label: "Upcoming" },
] as const;

const railIcons = [LayoutDashboard, FolderOpen, Wallet, Clock, CalendarIcon];

/** Donut built from a conic-gradient — no chart library, no runtime cost. */
function Donut() {
    let acc = 0;
    const stops = sources
        .map((s) => {
            const from = acc;
            acc += s.pct;
            return `${s.color} ${from}% ${acc}%`;
        })
        .join(", ");

    return (
        <div className="relative mx-auto h-[104px] w-[104px] shrink-0">
            <div
                className="h-full w-full rounded-full"
                style={{ background: `conic-gradient(${stops})` }}
            />
            <div className="absolute inset-[15px] flex flex-col items-center justify-center rounded-full bg-card">
                <span className="text-[15px] font-bold leading-none tracking-[-0.02em]">38%</span>
                <span className="mt-0.5 text-[9px] text-muted-foreground">Top project</span>
            </div>
        </div>
    );
}

export function ProductShot() {
    return (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl">
            <div className="flex">
                {/* Icon rail */}
                <div className="hidden w-[52px] shrink-0 flex-col items-center gap-1.5 border-r border-border py-4 sm:flex">
                    <div className="mb-2 flex h-7 w-7 items-center justify-center">
                        <OrbitMark className="h-6 w-6" />
                    </div>
                    {railIcons.map((Icon, i) => (
                        <div
                            key={i}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                i === 0
                                    ? "bg-accent text-accent-foreground"
                                    : "text-muted-foreground"
                            }`}
                        >
                            <Icon className="h-[15px] w-[15px]" strokeWidth={1.75} />
                        </div>
                    ))}
                </div>

                <div className="min-w-0 flex-1">
                    {/* Top bar */}
                    <div className="flex h-[52px] items-center gap-3 border-b border-border px-3 sm:px-4">
                        <div className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-[hsl(var(--background-alt))] px-3">
                            <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                            <span className="truncate text-[11px] text-muted-foreground">
                                Search anything…
                            </span>
                        </div>
                        <Bell className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" strokeWidth={1.75} />
                        <Settings className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" strokeWidth={1.75} />
                        <div className="flex shrink-0 items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[hsl(88_40%_72%)] to-[hsl(150_25%_62%)]" />
                            <div className="hidden leading-tight sm:block">
                                <p className="text-[11px] font-semibold">Meera Nair</p>
                                <p className="text-[10px] text-muted-foreground">Principal</p>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="space-y-3 bg-[hsl(var(--background-alt))] p-3 sm:p-4">
                        {/* KPI row */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                            {kpis.map((k) => (
                                <div
                                    key={k.label}
                                    className="rounded-lg border border-border bg-card p-2.5 sm:p-3"
                                >
                                    <p className="truncate text-[9px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
                                        {k.label}
                                    </p>
                                    <div className="mt-1.5 flex flex-wrap items-baseline gap-1.5">
                                        <span className="text-[17px] font-bold leading-none tracking-[-0.02em] tabular-nums sm:text-[19px]">
                                            {k.value}
                                        </span>
                                        <span className="rounded-full bg-success-bg px-1.5 py-px text-[9px] font-semibold text-success">
                                            {k.delta}
                                        </span>
                                    </div>
                                    {/* Thin progress strip beneath the number */}
                                    <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-[hsl(0_0%_94%)]">
                                        <div
                                            className="h-full rounded-full"
                                            style={{ width: `${k.fill}%`, background: k.bar }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid gap-2 sm:gap-3 lg:grid-cols-[1.55fr_1fr]">
                            {/* Bar chart */}
                            <div className="rounded-lg border border-border bg-card p-3 sm:p-4">
                                <div className="mb-4 flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[12px] font-semibold tracking-[-0.01em]">
                                            Revenue Overview
                                        </p>
                                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                                            Monthly pipeline performance
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-0.5 rounded-full bg-[hsl(var(--background-alt))] p-0.5">
                                        {["W", "M", "Q", "Y"].map((t) => (
                                            <span
                                                key={t}
                                                className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold ${
                                                    t === "M"
                                                        ? "bg-accent text-accent-foreground"
                                                        : "text-muted-foreground"
                                                }`}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative flex h-[112px] items-end gap-[3px] sm:gap-1.5">
                                    {/* Dark tooltip over the highlighted bar */}
                                    <div
                                        className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-md bg-ink px-2 py-1 text-[10px] font-semibold text-white shadow-card"
                                        style={{
                                            left: `${((HIGHLIGHT + 0.5) / months.length) * 100}%`,
                                            bottom: `${barHeights[HIGHLIGHT]}%`,
                                            marginBottom: "8px",
                                        }}
                                    >
                                        ₹8,524
                                    </div>
                                    {months.map((m, i) => (
                                        <div key={m} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                                            <div
                                                className="w-full rounded-t-[3px]"
                                                style={{
                                                    height: `${barHeights[i]}%`,
                                                    background:
                                                        i === HIGHLIGHT
                                                            ? "linear-gradient(180deg, hsl(var(--accent)) 0%, hsl(var(--accent-deep)) 100%)"
                                                            : "hsl(0 0% 92%)",
                                                }}
                                            />
                                            <span className="hidden text-[8px] text-muted-foreground sm:block">
                                                {m}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Donut breakdown */}
                            <div className="rounded-lg border border-border bg-card p-3 sm:p-4">
                                <p className="mb-3 text-[12px] font-semibold tracking-[-0.01em]">
                                    Revenue by project
                                </p>
                                <Donut />
                                <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1.5">
                                    {sources.map((s) => (
                                        <div key={s.label} className="flex items-center gap-1.5">
                                            <span
                                                className="h-1.5 w-1.5 shrink-0 rounded-full"
                                                style={{ background: s.color }}
                                            />
                                            <span className="min-w-0 flex-1 truncate text-[9px] text-muted-foreground">
                                                {s.label}
                                            </span>
                                            <span className="shrink-0 text-[9px] font-semibold tabular-nums">
                                                {s.pct}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Milestone list with status pills */}
                        <div className="rounded-lg border border-border bg-card p-3 sm:p-4">
                            <div className="mb-1 flex items-center justify-between">
                                <p className="text-[12px] font-semibold tracking-[-0.01em]">
                                    Recent Milestones
                                </p>
                                <span className="text-[10px] font-medium text-accent-ink">View all</span>
                            </div>
                            <ul>
                                {milestones.map((m) => (
                                    <li
                                        key={m.name}
                                        className="flex items-center gap-2.5 border-b border-border py-2 last:border-0 sm:gap-3"
                                    >
                                        <span
                                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                                                m.state === "success"
                                                    ? "bg-success-bg text-success"
                                                    : "bg-[hsl(0_0%_95%)] text-muted-foreground"
                                            }`}
                                        >
                                            {m.state === "success" && (
                                                <Check className="h-2.5 w-2.5" strokeWidth={3} />
                                            )}
                                        </span>
                                        <span className="min-w-0 flex-1 truncate text-[11px]">
                                            {m.name}
                                        </span>
                                        <span className="shrink-0 text-[11px] font-semibold tabular-nums">
                                            {m.amount}
                                        </span>
                                        <span
                                            className={`pill w-[62px] justify-center text-[9px] ${
                                                m.state === "success"
                                                    ? "pill-success"
                                                    : m.state === "warning"
                                                      ? "pill-warning"
                                                      : "pill-neutral"
                                            }`}
                                        >
                                            {m.label}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
