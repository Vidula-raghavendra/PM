
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-white">
      {/* Navigation */}
      <nav className="border-b border-border/50 px-6 py-6 sm:px-12 flex justify-between items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex gap-8 items-center text-[13px] tracking-widest uppercase font-medium text-muted-foreground overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link href="#about" className="hover:text-foreground transition-colors">About Orbit</Link>
          <Link href="#features" className="hover:text-foreground transition-colors">OS Features</Link>
          <Link href="#dashboard" className="hover:text-foreground transition-colors">Interface</Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">Access</Link>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-[13px] tracking-widest uppercase font-medium hover:text-accent transition-colors">Login</Link>
          <Button asChild className="rounded-full px-8 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="px-6 py-20 sm:px-12 lg:py-32 border-b border-border/50">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-12">
              <h1 className="text-7xl sm:text-8xl lg:text-[10rem] font-serif leading-[0.9] tracking-tight">
                Personal <br />
                Operating ____ <br />
                System
              </h1>

              <div className="max-w-md space-y-8">
                <p className="text-xl sm:text-2xl font-light leading-relaxed text-muted-foreground">
                  A minimalist workspace designed for creators who value intentionality,
                  focus, and high-quality organization in every project.
                </p>
                <div className="flex items-center gap-8">
                  <Button asChild size="lg" className="rounded-full px-12 py-8 text-lg bg-accent text-accent-foreground hover:opacity-90">
                    <Link href="/register">Join the Space</Link>
                  </Button>
                  <Link href="#explore" className="flex items-center gap-2 group font-medium text-[13px] tracking-widest uppercase">
                    Learn More <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="aspect-[4/5] bg-[#D8D2C9] overflow-hidden rounded-sm grayscale-[0.2] transition-all duration-700 group-hover:grayscale-0">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
                  alt="Minimalist Workspace"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-background p-8 border border-border/50 shadow-xl max-w-[240px] hidden sm:block">
                <p className="text-xs tracking-widest uppercase font-semibold mb-4 opacity-50">Interface Design</p>
                <p className="text-sm font-medium leading-relaxed">
                  "Architecture is the learned game, correct and magnificent, of forms assembled in the light."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="px-6 py-24 sm:px-12 border-b border-border/50 bg-[#F5F2ED]">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-24">
            <div className="lg:col-span-2">
              <h2 className="text-4xl sm:text-6xl font-serif leading-tight mb-12">
                At Orbit, we are dedicated to designing <br />
                sustainable productivity tools that harmonize <br />
                with focus and inspire elegant workflows.
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                <p className="text-muted-foreground leading-relaxed">
                  We believe in shaping a clearer future by blending cutting-edge design
                  with minimalist practices. From task management to financial tracking,
                  every project we undertake is a step towards preserving your mental clarity.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our interface is not just a tool; it's a space. A space where architecture
                  meets data, and where sustainability means staying organized without the noise.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-end">
              <div className="aspect-square bg-[#E5E0D8] overflow-hidden rounded-sm relative group">
                <img
                  src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=1000"
                  alt="Architecture Details"
                  className="object-cover w-full h-full grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute bottom-6 right-6">
                  <div className="bg-background/20 backdrop-blur-md p-3 rounded-full">
                    <ArrowUpRight className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-6 py-24 sm:px-12 border-b border-border/50">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-12">
            <div className="flex justify-between items-end border-b border-border/20 pb-4">
              <span className="text-[13px] tracking-widest uppercase font-semibold opacity-50">Innovative Features</span>
              <span className="text-[13px] tracking-widest uppercase font-semibold opacity-50">OrbitOS 2024</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: "Project Focus", value: "95%", detail: "Focus retention rate" },
                { label: "Time Optimized", value: "2.4h", detail: "Daily time saved" },
                { label: "Financial Clarity", value: "100%", detail: "Budget transparency" },
                { label: "User Delight", value: "High", detail: "Premium interface" }
              ].map((stat, i) => (
                <div key={i} className="space-y-4 border-b border-border/20 md:border-b-0 pb-8">
                  <p className="text-sm font-medium">{stat.label}</p>
                  <p className="text-5xl font-serif">{stat.value}</p>
                  <p className="text-xs tracking-widest uppercase opacity-40">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-12 sm:px-12 bg-background border-t border-border/50">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-8">
          <p className="text-[13px] tracking-widest uppercase font-medium opacity-50">&copy; Orbit OS. Precision in digital space.</p>
          <div className="flex gap-12 list-none text-[13px] tracking-widest uppercase font-medium opacity-50">
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
            <Link href="#">System Status</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

