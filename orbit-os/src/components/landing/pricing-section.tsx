"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Reveal } from "./reveal";

/**
 * Three-card pricing row. Orbit is genuinely free during beta, so every
 * tier prices at zero and the toggle switches the billing label rather
 * than inventing a discount that does not exist — the structure matches
 * the reference without the page making a claim the product does not.
 */

const plans = [
    {
        name: "Solo",
        price: "0",
        desc: "For freelancers billing their own milestones.",
        cta: "Start free",
        href: "/register",
        featured: false,
        features: [
            "Unlimited projects & milestones",
            "Payment tracking",
            "Time tracking & calendar",
            "Goals and deadlines",
        ],
    },
    {
        name: "Studio",
        price: "0",
        desc: "For small teams sharing revenue across a project.",
        cta: "Start free",
        href: "/register",
        featured: true,
        features: [
            "Everything in Solo",
            "Team collaboration",
            "Revenue splits per project",
            "Collaborator roles",
            "Shared project calendar",
        ],
    },
    {
        name: "Beta partner",
        price: "0",
        desc: "For early users who want a say in what we build.",
        cta: "Get started",
        href: "/register",
        featured: false,
        features: [
            "Everything in Studio",
            "All future features included",
            "Lifetime beta pricing",
            "Direct line to the team",
        ],
    },
];

function PlanCard({ plan, billing }: { plan: (typeof plans)[number]; billing: string }) {
    return (
        <div
            className={`relative flex h-full flex-col overflow-hidden rounded-xl border bg-card p-6 transition-all duration-200 sm:p-7 ${
                plan.featured
                    ? "border-[hsl(0_0%_88%)] shadow-card-hover lg:-my-4 lg:py-10"
                    : "border-border shadow-card hover:-translate-y-1 hover:border-[hsl(0_0%_88%)] hover:shadow-card-hover"
            }`}
        >
            {plan.featured && (
                <>
                    {/* Gradient strip pinned to the top edge */}
                    <span
                        className="absolute inset-x-0 top-0 h-1"
                        style={{
                            background:
                                "linear-gradient(90deg, hsl(var(--accent-deep)) 0%, hsl(var(--accent)) 45%, #F5A623 100%)",
                        }}
                        aria-hidden="true"
                    />
                </>
            )}

            <div className="flex min-h-[24px] items-center justify-between gap-3">
                <p className="text-[13px] font-semibold tracking-[-0.01em]">{plan.name}</p>
                {plan.featured && (
                    <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-accent-foreground">
                        Most popular
                    </span>
                )}
            </div>

            <div className="mt-4 flex items-end gap-1.5">
                <span className="text-[40px] font-bold leading-none tracking-[-0.035em] tabular-nums">
                    ₹{plan.price}
                </span>
                <span className="pb-1 text-[13px] text-muted-foreground">/{billing}</span>
            </div>

            <p className="mt-3 min-h-[40px] text-[13px] leading-[1.55] text-muted-foreground">
                {plan.desc}
            </p>

            <Link
                href={plan.href}
                className={`mt-6 inline-flex h-11 w-full items-center justify-center rounded-full text-[13px] font-semibold transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    plan.featured
                        ? "bg-accent text-accent-foreground hover:bg-[hsl(79_98%_44%)] hover:shadow-glow"
                        : "bg-primary text-primary-foreground hover:bg-[hsl(0_0%_16%)] hover:shadow-card"
                }`}
            >
                {plan.cta}
            </Link>

            <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="eyebrow text-[10px] text-muted-foreground">
                    Stand out features
                </span>
                <span className="h-px flex-1 bg-border" />
            </div>

            <ul className="mt-auto space-y-3">
                {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                        <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent">
                            <Check className="h-2.5 w-2.5 text-accent-foreground" strokeWidth={3.5} />
                        </span>
                        <span className="text-[13px] leading-[1.5] text-muted-foreground">{f}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function PricingSection() {
    const [annual, setAnnual] = useState(false);

    return (
        <section
            id="pricing"
            className="bg-[hsl(var(--background-alt))] px-5 py-24 sm:px-8 sm:py-32"
        >
            <div className="mx-auto max-w-[1120px]">
                <Reveal>
                    <div className="mx-auto max-w-[560px] text-center">
                        <p className="eyebrow mb-5 text-accent-ink">Pricing</p>
                        <h2 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-medium italic leading-[1.1] tracking-[-0.01em]">
                            Free while in beta
                        </h2>
                        <p className="mx-auto mt-4 max-w-[440px] text-[15px] leading-[1.6] text-muted-foreground">
                            Early users keep lifetime access to everything we ship.
                        </p>

                        {/* Billing toggle */}
                        <div className="mt-8 flex items-center justify-center gap-3">
                            <span
                                className={`text-[13px] font-medium transition-colors duration-150 ${
                                    annual ? "text-muted-foreground" : "text-foreground"
                                }`}
                            >
                                Monthly
                            </span>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={annual}
                                aria-label="Toggle annual billing"
                                onClick={() => setAnnual((v) => !v)}
                                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                                    annual ? "bg-accent" : "bg-[hsl(0_0%_86%)]"
                                }`}
                            >
                                <span
                                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                        annual ? "translate-x-[22px]" : "translate-x-0.5"
                                    }`}
                                />
                            </button>
                            <span
                                className={`text-[13px] font-medium transition-colors duration-150 ${
                                    annual ? "text-foreground" : "text-muted-foreground"
                                }`}
                            >
                                Annually
                            </span>
                        </div>
                    </div>
                </Reveal>

                <div className="mt-14 grid items-stretch gap-5 sm:mt-16 lg:grid-cols-3">
                    {plans.map((plan, i) => (
                        <Reveal key={plan.name} delay={i * 110} scale className="h-full">
                            <PlanCard plan={plan} billing={annual ? "year" : "month"} />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
