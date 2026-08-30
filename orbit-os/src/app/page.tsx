import { LandingNav } from "@/components/landing/landing-nav";
import { PageBackdrop } from "@/components/landing/page-backdrop";
import { HeroSection } from "@/components/landing/hero-section";
import { StatementSection } from "@/components/landing/statement-section";
import { MilestoneVisual } from "@/components/landing/milestone-visual";
import { SplitVisual } from "@/components/landing/split-visual";
import { SplitFeature } from "@/components/landing/split-feature";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { PricingSection } from "@/components/landing/pricing-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCta } from "@/components/landing/final-cta";
import { SiteFooter } from "@/components/landing/site-footer";
import { Reveal } from "@/components/landing/reveal";

const steps = [
    { title: "Create a project", desc: "Client, budget, milestones, deadlines — all in one form." },
    { title: "Invite your team", desc: "Add collaborators by email. Set roles and revenue splits." },
    { title: "Track everything", desc: "Time, payments, contracts, meetings — nothing falls through." },
    { title: "Stay in control", desc: "One dashboard for revenue, progress, and what's next." },
];

export default function LandingPage() {
    return (
        <div className="relative min-h-screen font-sans text-foreground antialiased">
            <PageBackdrop photo="/hero-field-wide.jpg" />
            <LandingNav />

            <main>
                <HeroSection />

                {/* Alternating splits */}
                {/* pt clears the hero screenshot's overhang above */}
                <section
                    id="features"
                    className="bg-background px-5 pb-24 sm:px-8 sm:pb-32"
                    style={{ paddingTop: "var(--hero-clearance)" }}
                >
                    <div className="mx-auto max-w-[1120px] space-y-24 sm:space-y-32">
                        <SplitFeature
                            overline="Payments"
                            title={<>A milestone is <em className="not-italic text-accent-ink">an invoice</em></>}
                            body="Set the phase, the amount and the date once. Mark it paid when the money lands, and revenue updates everywhere — dashboard, project and finance view."
                            visual={<MilestoneVisual />}
                        />

                        <SplitFeature
                            reverse
                            overline="Collaboration"
                            title={<>Split revenue <em className="not-italic text-accent-ink">fairly</em></>}
                            body="Invite collaborators by email and give each one a percentage. Orbit works out who is owed what on every project, so a shared job never turns into a spreadsheet argument."
                            visual={<SplitVisual />}
                        />
                    </div>
                </section>

                <StatementSection />

                <section className="bg-background px-5 pb-16 pt-24 sm:px-8 sm:pb-20 sm:pt-32">
                    <div className="mx-auto max-w-[1120px]">
                        <Reveal>
                            <h2 className="mx-auto mb-16 max-w-[20ch] text-center font-display text-[clamp(2.25rem,5vw,3.5rem)] font-medium italic leading-[1.1] tracking-[-0.01em] sm:mb-20">
                                Built for the whole job
                            </h2>
                        </Reveal>

                        <FeatureGrid />
                    </div>
                </section>

                {/* Process — sticky heading against a scrolling list of cards */}
                <section className="bg-background px-5 py-24 sm:px-8 sm:py-32">
                    <div className="mx-auto grid max-w-[1120px] gap-12 lg:grid-cols-[0.8fr_1fr] lg:gap-20">
                        <Reveal>
                            <div className="lg:sticky lg:top-32">
                                <p className="eyebrow mb-5 text-accent-ink">Process</p>
                                <h2 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-medium italic leading-[1.1] tracking-[-0.01em]">
                                    Four steps,
                                    <br />
                                    then it runs itself
                                </h2>
                            </div>
                        </Reveal>

                        <div className="space-y-3">
                            {steps.map((item, i) => (
                                <Reveal key={item.title} delay={i * 90} direction="right">
                                    <div className="surface-card hover-lift group flex gap-5 p-5 sm:p-6">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--background-alt))] text-[13px] font-bold tabular-nums text-accent-ink ring-1 ring-border transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:ring-accent">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <div className="min-w-0">
                                            <h3 className="mb-1.5 text-[16px] font-semibold tracking-[-0.01em]">
                                                {item.title}
                                            </h3>
                                            <p className="text-[14px] leading-[1.6] text-muted-foreground">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                <PricingSection />

                <FaqSection />

                <FinalCta />
            </main>

            <SiteFooter />
        </div>
    );
}
