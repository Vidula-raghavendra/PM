
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/landing/hero-section";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

const steps = [
    { title: "Create a project", desc: "Client, budget, milestones, deadlines — all in one form." },
    { title: "Invite your team", desc: "Add collaborators by email. Set roles and revenue splits." },
    { title: "Track everything", desc: "Time, payments, contracts, meetings — nothing falls through." },
    { title: "Stay in control", desc: "One dashboard for revenue, progress, and what's next." },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
                <div className="max-w-[1120px] mx-auto px-6 h-14 flex items-center justify-between">
                    <Link href="/" className="text-[15px] font-semibold tracking-tight">
                        Orbit
                    </Link>

                    <div className="hidden sm:flex items-center gap-8 text-[13px] text-muted-foreground">
                        <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
                        <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
                    </div>

                    <Link href="/login" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                        Sign in
                    </Link>
                </div>
            </nav>

            <main>
                <HeroSection />

                {/* Features */}
                <section id="features" className="py-24 sm:py-32 px-6">
                    <div className="max-w-[1000px] mx-auto">
                        <ScrollReveal>
                            <div className="text-center mb-14 sm:mb-16">
                                <h2 className="text-3xl sm:text-[2.75rem] font-serif tracking-tight leading-tight">
                                    Everything you need.
                                    <br />
                                    <span className="italic text-muted-foreground">Nothing you don&apos;t.</span>
                                </h2>
                            </div>
                        </ScrollReveal>

                        <FeatureGrid />
                    </div>
                </section>

                {/* How it works */}
                <section className="py-24 sm:py-32 px-6 bg-secondary/60">
                    <div className="max-w-[600px] mx-auto">
                        <ScrollReveal>
                            <h2 className="text-3xl sm:text-[2.75rem] font-serif tracking-tight text-center mb-14 sm:mb-16 leading-tight">
                                How it works
                            </h2>
                        </ScrollReveal>

                        {steps.map((item, i) => (
                            <ScrollReveal key={i} delay={i * 90}>
                                <div className="flex gap-5 py-7 border-b border-border/50 last:border-0 group">
                                    <span className="text-[13px] font-mono text-muted-foreground pt-0.5 shrink-0 w-6 group-hover:text-accent transition-colors duration-300">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <div>
                                        <h3 className="text-[15px] font-semibold tracking-tight mb-1 group-hover:text-accent transition-colors duration-300">{item.title}</h3>
                                        <p className="text-[14px] text-muted-foreground leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </section>

                {/* Pricing */}
                <section id="pricing" className="py-24 sm:py-32 px-6">
                    <div className="max-w-[440px] mx-auto text-center">
                        <ScrollReveal>
                            <h2 className="text-3xl sm:text-[2.75rem] font-serif tracking-tight mb-3 leading-tight">
                                Free while in beta
                            </h2>
                            <p className="text-muted-foreground text-[15px] leading-relaxed mb-10">
                                Early users keep lifetime access to everything we ship.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal delay={80}>
                            <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
                                <p className="text-4xl sm:text-5xl font-serif tracking-tight mb-1">{"\u20B9"}0</p>
                                <p className="text-accent text-[13px] font-medium mb-8">Forever — no catch</p>

                                <div className="text-left space-y-2.5 mb-8 text-[14px] text-muted-foreground">
                                    {[
                                        "Unlimited projects & milestones",
                                        "Payment tracking & revenue splits",
                                        "Time tracking & calendar",
                                        "Team collaboration",
                                        "All future features included",
                                    ].map((item) => (
                                        <div key={item} className="flex items-center gap-2.5">
                                            <div className="h-1 w-1 rounded-full bg-accent shrink-0" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button asChild size="lg" className="group/btn w-full rounded-full h-11 text-[14px] font-medium">
                                    <Link href="/register">
                                        Get started
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                                    </Link>
                                </Button>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-border/30 px-6 py-10">
                <div className="max-w-[1120px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[13px] text-muted-foreground">
                    <span>&copy; {new Date().getFullYear()} Orbit</span>
                    <div className="flex gap-6">
                        <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
                        <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
                        <Link href="/login" className="hover:text-foreground transition-colors">Sign in</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
