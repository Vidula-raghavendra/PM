import Link from "next/link";
import { Mail, Github, Linkedin } from "lucide-react";
import { OrbitMark } from "./orbit-mark";

/**
 * Footer. Shares the CTA band's ground so the two read as one dark block
 * with no seam. Every link resolves to a route Orbit actually has —
 * marketing anchors, auth, or dashboard sections behind the guard.
 */

const groups = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "Projects", href: "/dashboard/projects" },
            { label: "Finance", href: "/dashboard/finance" },
        ],
    },
    {
        title: "Resources",
        links: [
            { label: "FAQ", href: "#faq" },
            { label: "Time tracking", href: "/dashboard/time" },
            { label: "Calendar", href: "/dashboard/calendar" },
            { label: "Goals", href: "/dashboard/goals" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "Sign in", href: "/login" },
            { label: "Create account", href: "/register" },
            { label: "Settings", href: "/settings" },
            { label: "People", href: "/dashboard/people" },
        ],
    },
];

const socials = [
    { label: "Email", href: "mailto:hello@orbit.app", icon: Mail },
    { label: "GitHub", href: "https://github.com", icon: Github },
    { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
];

export function SiteFooter() {
    return (
        <footer
            className="px-5 pb-10 pt-4 sm:px-8"
            style={{ background: "rgba(8,16,15,0.58)" }}
        >
            <div className="mx-auto max-w-[1120px]">
                <div className="grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-8">
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-[17px] font-bold tracking-[-0.02em] text-white"
                        >
                            <OrbitMark className="h-6 w-6" />
                            Orbit
                        </Link>
                        <p className="mt-4 max-w-[280px] text-[13px] leading-[1.6] text-white/50">
                            Milestones, payments, time tracking and revenue splits — one
                            workspace for people who bill by the deliverable.
                        </p>
                        <div className="mt-6 flex items-center gap-2">
                            {socials.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    aria-label={s.label}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors duration-150 hover:border-white/25 hover:bg-white/[0.06] hover:text-[hsl(var(--accent))]"
                                >
                                    <s.icon className="h-4 w-4" strokeWidth={1.75} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {groups.map((group) => (
                        <div key={group.title}>
                            <p className="eyebrow mb-4 text-[11px] text-white/40">
                                {group.title}
                            </p>
                            <ul className="space-y-2.5">
                                {group.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-[13px] text-white/60 transition-colors duration-200 hover:text-[hsl(var(--accent))]"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-white/10 pt-6">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <span className="text-[12px] text-white/40">
                            &copy; {new Date().getFullYear()} Orbit
                        </span>
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                            {[
                                { label: "Privacy", href: "#faq" },
                                { label: "Terms", href: "#faq" },
                                { label: "Contact", href: "mailto:hello@orbit.app" },
                                { label: "Status", href: "#faq" },
                            ].map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="text-[12px] text-white/40 transition-colors duration-150 hover:text-white"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
