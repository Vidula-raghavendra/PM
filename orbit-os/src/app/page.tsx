import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LandingNav } from "@/components/landing/landing-nav";
import { HeroSection } from "@/components/landing/hero-section";
import { StatementSection } from "@/components/landing/statement-section";
import { MilestoneVisual } from "@/components/landing/milestone-visual";
import { SplitVisual } from "@/components/landing/split-visual";
import { SplitFeature } from "@/components/landing/split-feature";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

const steps = [
    { title: "Create a project", desc: "Client, budget, milestones, deadlines — all in one form." },
    { title: "Invite your team", desc: "Add collaborators by email. Set roles and revenue splits." },
    { title: "Track everything", desc: "Time, payments, contracts, meetings — nothing falls through." },
    { title: "Stay in control", desc: "One dashboard for revenue, progress, and what's next." },
];

const planFeatures = [
    "Unlimited projects & milestones",
    "Payment tracking & revenue splits",
    "Time tracking & calendar",
    "Team collaboration",
    "All future features included",
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased">
            <LandingNav />

            <main>
                <HeroSection />

                {/* Alternating splits — the rhythm that carries you down the page */}
                <section id="features" className="py-24 sm:py-32 px-6 sm:px-10">
                    <div className="max-w-[1240px] mx-auto space-y-24 sm:space-y-36">
                        <SplitFeature
                            overline="Payments"
                            title={<>A milestone is <em className="italic">an invoice</em></>}
                            body="Set the phase, the amount and the date once. Mark it paid when the money lands, and revenue updates everywhere — dashboard, project and finance view."
                            visual={<MilestoneVisual />}
                        />

                        <SplitFeature
                            reverse
                            overline="Collaboration"
                            title={<>Split revenue <em className="italic">fairly</em></>}
                            body="Invite collaborators by email and give each one a percentage. Orbit works out who is owed what on every project, so a shared job never turns into a spreadsheet argument."
                            visual={<SplitVisual />}
                        />
                    </div>
                </section>

                <StatementSection />

                <section className="py-24 sm:py-32 px-6 sm:px-10">
                    <div className="max-w-[1240px] mx-auto">
                        <ScrollReveal>
                            <div className="max-w-[520px] mb-14 sm:mb-20">
                                <p className="text-overline uppercase text-muted-foreground mb-5">
                                    Everything else
                                </p>
                                <h2 className="font-serif text-display-md sm:text-display-lg leading-[1.02] tracking-[-0.02em]">
                                    Built for the whole job
                                </h2>
                            </div>
                        </ScrollReveal>

                        <FeatureGrid />
                    </div>
                </section>

                {/* Process — sticky heading against a scrolling list */}
                <section className="py-24 sm:py-32 px-6 sm:px-10 bg-secondary/50">
                    <div className="max-w-[1240px] mx-auto grid lg:grid-cols-[0.85fr_1fr] gap-14 lg:gap-24">
                        <ScrollReveal>
                            <div className="lg:sticky lg:top-32">
                                <p className="text-overline uppercase text-muted-foreground mb-5">
                                    Process
                                </p>
                                <h2 className="font-serif text-display-md sm:text-display-lg leading-[1.02] tracking-[-0.02em]">
                                    Four steps,
                                    <br />
                                    then it runs itself
                                </h2>
                            </div>
                        </ScrollReveal>

                        <div>
                            {steps.map((item, i) => (
                                <ScrollReveal key={item.title} delay={i * 90}>
                                    <div className="flex gap-7 py-7 border-b border-border/60 last:border-0 group">
                                        <span className="font-serif text-[26px] tabular-nums text-muted-foreground/50 shrink-0 leading-none pt-0.5 transition-colors duration-[160ms] group-hover:text-accent">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <div>
                                            <h3 className="text-[16px] font-semibold tracking-tight mb-1.5">
                                                {item.title}
                                            </h3>
                                            <p className="text-[14px] text-muted-foreground leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="pricing" className="py-24 sm:py-32 px-6 sm:px-10">
                    <div className="max-w-[520px] mx-auto text-center">
                        <ScrollReveal>
                            <p className="text-overline uppercase text-muted-foreground mb-5">
                                Pricing
                            </p>
                            <h2 className="font-serif text-display-md sm:text-display-lg mb-4 leading-[1.02] tracking-[-0.02em]">
                                Free while in beta
                            </h2>
                            <p className="text-muted-foreground text-[15px] leading-relaxed mb-12">
                                Early users keep lifetime access to everything we ship.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal delay={80}>
                            <div className="relative rounded-xl border border-border bg-card p-8 sm:p-10 text-left">
                                <div
                                    className="pointer-events-none absolute -inset-6 -z-10"
                                    style={{
                                        background:
                                            "radial-gradient(55% 50% at 50% 40%, hsl(31 74% 53% / 0.14) 0%, transparent 70%)",
                                        filter: "blur(24px)",
                                    }}
                                    aria-hidden="true"
                                />

                                <div className="text-center mb-8">
                                    <p className="font-serif text-[52px] leading-none tabular-nums">
                                        {"₹"}0
                                    </p>
                                    <p className="text-overline uppercase text-accent mt-3">
                                        Forever — no catch
                                    </p>
                                </div>

                                <div className="space-y-3 mb-9 text-[14px] text-muted-foreground">
                                    {planFeatures.map((item) => (
                                        <div key={item} className="flex items-center gap-3">
                                            <div className="h-1 w-1 rounded-full bg-accent shrink-0" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href="/register"
                                    className="group/btn flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent text-accent-foreground text-[13px] font-semibold transition-transform duration-[160ms] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                >
                                    Get started
                                    <ArrowRight
                                        className="h-4 w-4 transition-transform duration-[160ms] group-hover/btn:translate-x-0.5"
                                        strokeWidth={2}
                                    />
                                </Link>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>
            </main>

            <footer className="border-t border-border px-6 sm:px-10 py-10">
                <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[12px] text-muted-foreground">
                    <span className="font-serif text-[15px] text-foreground">Orbit</span>
                    <div className="flex gap-7">
                        <Link href="#features" className="hover:text-foreground transition-colors duration-[100ms]">
                            Features
                        </Link>
                        <Link href="#pricing" className="hover:text-foreground transition-colors duration-[100ms]">
                            Pricing
                        </Link>
                        <Link href="/login" className="hover:text-foreground transition-colors duration-[100ms]">
                            Sign in
                        </Link>
                    </div>
                    <span>&copy; {new Date().getFullYear()} Orbit</span>
                </div>
            </footer>
        </div>
    );
}
