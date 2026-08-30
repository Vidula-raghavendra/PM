"use client";

import { useState } from "react";
import { ChevronDown, Wallet, Users, Clock, ShieldCheck } from "lucide-react";
import { Reveal } from "./reveal";

/**
 * Near-black FAQ band. Heading left, accordion right. Each row carries a
 * small square thumbnail so the stack has rhythm even when collapsed.
 * Answers animate on grid-template-rows, which transitions smoothly at
 * any content height without a measured max-height hack.
 */

const faqs = [
    {
        icon: Wallet,
        q: "How does a milestone become an invoice?",
        a: "You set the phase, the amount and the date once. Orbit treats that record as both the deliverable and the invoice line, so when you mark it paid, revenue updates on the dashboard, the project and the finance view at the same time.",
    },
    {
        icon: Users,
        q: "How do revenue splits work on a shared project?",
        a: "Invite collaborators by email and give each one a percentage. Orbit works out who is owed what on every milestone, so a shared job never turns into a spreadsheet argument at the end of the month.",
    },
    {
        icon: Clock,
        q: "Can I track time against a project?",
        a: "Yes. Start the timer from the dashboard or log hours after the fact. Time sits against the project it belongs to, so you can see hours and revenue side by side rather than in two different tools.",
    },
    {
        icon: ShieldCheck,
        q: "What happens when the beta ends?",
        a: "Early users keep lifetime access to everything we ship. Nothing you have created gets locked behind a plan later, and your projects, milestones and time logs stay yours to export.",
    },
];

export function FaqSection() {
    const [open, setOpen] = useState<number | null>(0);

    return (
        <section
            id="faq"
            className="isolate-layer relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32"
            style={{ background: "linear-gradient(180deg, rgba(8,16,15,0.78) 0%, rgba(10,20,18,0.66) 100%)" }}
        >
            <div className="relative z-10 mx-auto grid max-w-[1120px] gap-12 lg:grid-cols-[0.8fr_1fr] lg:gap-20">
                <div className="lg:sticky lg:top-32 lg:self-start">
                    <p className="eyebrow mb-5 text-[hsl(var(--accent))]">FAQ</p>
                    <h2 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-medium italic leading-[1.1] tracking-[-0.01em] text-white">
                        Common questions
                    </h2>
                    <p className="mt-5 max-w-[380px] text-[15px] leading-[1.6] text-white/55">
                        Everything you might want to know before you start billing by
                        the deliverable.
                    </p>
                </div>

                <div className="space-y-2.5">
                    {faqs.map((item, i) => {
                        const isOpen = open === i;
                        return (
                            <Reveal key={item.q} delay={i * 90} direction="right">
                            <div
                                className={`overflow-hidden rounded-xl border transition-colors duration-200 ${
                                    isOpen
                                        ? "border-white/[0.14] bg-white/[0.06]"
                                        : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.05]"
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpen(isOpen ? null : i)}
                                    aria-expanded={isOpen}
                                    className="flex w-full items-center gap-4 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:p-5"
                                >
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06]">
                                        <item.icon
                                            className="h-[18px] w-[18px] text-[hsl(var(--accent))]"
                                            strokeWidth={1.75}
                                        />
                                    </span>
                                    <span className="min-w-0 flex-1 text-[14px] font-semibold leading-snug text-white sm:text-[15px]">
                                        {item.q}
                                    </span>
                                    <ChevronDown
                                        className={`h-4 w-4 shrink-0 text-white/50 transition-transform duration-300 ${
                                            isOpen ? "rotate-180" : ""
                                        }`}
                                        strokeWidth={2}
                                    />
                                </button>

                                <div
                                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                                >
                                    <div className="overflow-hidden">
                                        <p className="px-4 pb-5 pl-[72px] pr-6 text-[14px] leading-[1.65] text-white/60 sm:px-5 sm:pl-[76px]">
                                            {item.a}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
