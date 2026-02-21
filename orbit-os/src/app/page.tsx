
import Link from "next/link";
import { ArrowUpRight, Shield, Zap, Layout, IndianRupee, Clock, Target, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-white">
      {/* Navigation */}
      <nav className="border-b border-border/50 px-6 py-6 sm:px-12 flex justify-between items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex gap-10 items-center text-[11px] tracking-[0.25em] uppercase font-bold text-muted-foreground/60 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link href="#about" className="hover:text-foreground transition-colors">About</Link>
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#interface" className="hover:text-foreground transition-colors">Interface</Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/login" className="text-[11px] tracking-[0.2em] uppercase font-bold hover:text-accent transition-colors">Login</Link>
          <Button asChild className="rounded-full px-10 h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-[11px] tracking-[0.2em] font-bold uppercase">
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="px-6 py-20 sm:px-12 lg:py-32 border-b border-border/50">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
              <h1 className="text-6xl sm:text-7xl lg:text-[7rem] font-serif leading-[0.95] tracking-tight">
                Personal <br />
                Operating ____ <br />
                System
              </h1>

              <div className="max-w-md space-y-10">
                <p className="text-xl sm:text-2xl font-light leading-relaxed text-muted-foreground/80 font-serif italic">
                  An intentional workspace for high-stakes creators.
                  Manage projects, track finances, and preserve your focus in a digital retreat.
                </p>
                <div className="flex items-center gap-10 pt-4">
                  <Button asChild className="rounded-full px-14 h-16 text-[11px] tracking-[0.2em] font-bold uppercase bg-accent text-accent-foreground hover:opacity-90 transition-all hover:scale-[1.02]">
                    <Link href="/register">Join Space</Link>
                  </Button>
                  <Link href="#features" className="flex items-center gap-2 group font-bold text-[11px] tracking-[0.25em] uppercase text-muted-foreground hover:text-foreground transition-colors">
                    Explore OS <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="aspect-[4/5] bg-[#D8D2C9] overflow-hidden rounded-sm grayscale-[0.2] transition-all duration-700 group-hover:grayscale-0 border border-border/20 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
                  alt="Minimalist Workspace"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-background p-8 border border-border/50 shadow-xl max-w-[280px] hidden sm:block">
                <p className="text-[10px] tracking-widest uppercase font-bold mb-4 opacity-40">Architectural Logic</p>
                <p className="text-sm font-medium leading-relaxed italic font-serif">
                  "The details are not the details. They make the design."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-24 sm:px-12 border-b border-border/50 bg-[#FBF9F6]">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-20 space-y-4">
              <p className="text-[11px] tracking-[0.3em] uppercase font-bold text-accent">Core Infrastructure</p>
              <h2 className="text-5xl sm:text-6xl font-serif">Engineered for Clarity</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {[
                { icon: Target, title: "Ambition Engine", desc: "Define long-term targets and break them down into actionable phases without the clutter of traditional apps." },
                { icon: IndianRupee, title: "Financial Pulse", desc: "A high-fidelity view of your project revenue, taxes, and net income with architectural precision." },
                { icon: Clock, title: "Temporal Log", desc: "Track where your most valuable asset—time—is being spent across your entire project ecosystem." },
                { icon: Shield, title: "Privacy First", desc: "Built with secure cloud-native architecture ensuring your business data stays strictly yours." },
                { icon: Layout, title: "Contextual View", desc: "Switch between project views effortlessly, maintaining mental flow across complex workflows." },
                { icon: Zap, title: "Instant OS", desc: "Zero-latency interface designed for rapid entry and retrieval of information." }
              ].map((feat, i) => (
                <div key={i} className="group space-y-6 p-8 border border-border/30 hover:bg-background hover:shadow-xl transition-all duration-500 rounded-sm">
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <feat.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-serif italic">{feat.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interface Section */}
        <section id="interface" className="px-6 py-24 sm:px-12 border-b border-border/50">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-video bg-[#E5E0D8] rounded-sm overflow-hidden border border-border/30 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200"
                  alt="Dashboard Interface Preview"
                  className="object-cover w-full h-full grayscale-[0.2]"
                />
              </div>
              <div className="absolute -top-6 -right-6 h-24 w-24 bg-accent p-6 flex flex-col justify-end text-white rounded-sm shadow-xl">
                <Layers className="h-6 w-6 mb-2" />
                <p className="text-[10px] font-bold tracking-widest uppercase">v1.2</p>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-10 text-right lg:text-left">
              <p className="text-[11px] tracking-[0.3em] uppercase font-bold opacity-30">Visual Philosophy</p>
              <h2 className="text-5xl sm:text-6xl font-serif leading-tight">A Canvas for <br /> Your Concentration</h2>
              <div className="space-y-6 max-w-lg ml-auto lg:ml-0">
                <p className="text-muted-foreground leading-relaxed italic font-serif text-lg">
                  "Design is the silent ambassador of your brand."
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  OrbitOS uses a specific hierarchy of space and light to highlight only what is
                  immediately necessary. No dashboard fatigue. No unnecessary notifications.
                </p>
                <Button asChild variant="outline" className="rounded-full px-10 h-14 border-border/50 hover:bg-accent/5 hover:text-accent font-bold text-[11px] tracking-[0.2em] uppercase">
                  <Link href="/register">View Demo Interface</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Access / Pricing Section */}
        <section id="pricing" className="px-6 py-32 sm:px-12 bg-[#F5F2ED] border-b border-border/50">
          <div className="max-w-[1400px] mx-auto text-center space-y-16">
            <div className="space-y-4">
              <p className="text-[11px] tracking-[0.4em] uppercase font-bold text-accent">Availability</p>
              <h2 className="text-5xl sm:text-7xl font-serif max-w-3xl mx-auto">Seamless Access to the Operating System</h2>
            </div>

            <div className="max-w-[500px] mx-auto bg-background p-12 border border-border/50 shadow-2xl relative">
              <div className="absolute top-0 right-0 bg-accent px-6 py-2 text-white text-[10px] font-bold tracking-widest uppercase translate-x-4 -translate-y-4">Early Access</div>
              <h3 className="text-3xl font-serif italic mb-2">Lifetime Residency</h3>
              <div className="flex justify-center items-end gap-2 mb-8 mt-6">
                <span className="text-5xl font-serif leading-none">₹00</span>
                <span className="text-sm font-bold tracking-widest uppercase opacity-30 mb-2">/ Launch Beta</span>
              </div>

              <ul className="space-y-4 text-sm text-muted-foreground mb-12 text-left border-y border-border/20 py-8">
                <li className="flex items-center gap-3"><ArrowUpRight className="h-4 w-4 text-accent" /> Unlimited Projects & Storage</li>
                <li className="flex items-center gap-3"><ArrowUpRight className="h-4 w-4 text-accent" /> Financial Tracking Suite</li>
                <li className="flex items-center gap-3"><ArrowUpRight className="h-4 w-4 text-accent" /> Team Collaboration Access</li>
                <li className="flex items-center gap-3"><ArrowUpRight className="h-4 w-4 text-accent" /> Lifetime System Updates</li>
              </ul>

              <Button asChild className="w-full h-16 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-[11px] tracking-[0.2em] font-bold uppercase">
                <Link href="/register">Request Access</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* About Section (Old section integrated/re-styled) */}
        <section id="about" className="px-6 py-24 sm:px-12 border-b border-border/50">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-24">
            <div className="lg:col-span-2 space-y-8">
              <p className="text-[11px] tracking-[0.3em] uppercase font-bold opacity-30">Our Mission</p>
              <h2 className="text-4xl sm:text-6xl font-serif leading-tight">
                Sustainable Productivity <br />
                for the Digital Sovereign.
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-8">
                <p className="text-muted-foreground leading-relaxed">
                  Founded on the principle of digital minimalism, OrbitOS is the response to an
                  over-saturated software market. We prioritize the mental space of the creator above all else.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Every pixel, every interaction is curated to minimize friction and maximize
                  the transition into your flow state.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-end">
              <div className="aspect-square bg-[#E5E0D8] overflow-hidden rounded-sm relative group border border-border/30">
                <img
                  src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=1000"
                  alt="Architecture Details"
                  className="object-cover w-full h-full grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-20 sm:px-12 bg-background border-t border-border/50">
        <div className="max-w-[1400px] mx-auto flex flex-col md:grid md:grid-cols-4 gap-16">
          <div className="col-span-2 space-y-8">
            <Link href="/" className="text-3xl font-serif italic tracking-tight">Orbit OS ____</Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed text-sm">
              Precision in digital space. Reclaiming the mental focus stolen by inefficient software.
            </p>
          </div>
          <div className="space-y-6">
            <p className="text-[11px] tracking-widest uppercase font-bold opacity-30">Legal</p>
            <div className="flex flex-col gap-4 text-xs font-bold tracking-widest uppercase opacity-60">
              <Link href="/register" className="hover:text-accent">Privacy Policy</Link>
              <Link href="/register" className="hover:text-accent">Terms of Use</Link>
            </div>
          </div>
          <div className="space-y-6 text-right md:text-left">
            <p className="text-[11px] tracking-widest uppercase font-bold opacity-30">Status</p>
            <div className="flex items-center gap-2 justify-end md:justify-start">
              <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
              <p className="text-xs font-bold tracking-widest uppercase opacity-60">System Operational</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
