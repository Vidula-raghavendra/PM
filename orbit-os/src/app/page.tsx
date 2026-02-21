
import Link from "next/link";
import { ArrowUpRight, Shield, Zap, Layout, IndianRupee, Clock, Target, Layers, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] selection:bg-[#E2D1C3] selection:text-black font-sans antialiased">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-8 sm:px-16 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-serif italic text-lg">O</div>
          <span className="text-[12px] tracking-[0.3em] uppercase font-bold group-hover:tracking-[0.4em] transition-all">Orbit</span>
        </div>

        <div className="hidden md:flex gap-12 items-center text-[10px] tracking-[0.2em] uppercase font-bold text-black/40">
          <Link href="#about" className="hover:text-black transition-colors">Origins</Link>
          <Link href="#features" className="hover:text-black transition-colors">Manifesto</Link>
          <Link href="#interface" className="hover:text-black transition-colors">Interface</Link>
          <Link href="#pricing" className="hover:text-black transition-colors">Access</Link>
        </div>

        <div className="flex items-center gap-8">
          <Link href="/login" className="text-[10px] tracking-[0.2em] uppercase font-bold hover:text-accent transition-colors hidden sm:block">Login</Link>
          <Button asChild className="rounded-full px-8 h-12 bg-black text-white hover:bg-neutral-800 text-[10px] tracking-[0.2em] font-bold uppercase transition-transform hover:scale-105">
            <Link href="/register">Enter Space</Link>
          </Button>
        </div>
      </nav>

      <main className="pt-32">
        {/* Modern Hero Section */}
        <section className="px-6 py-20 sm:px-16 lg:py-32">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-12 mb-16">
              <p className="text-[11px] tracking-[0.4em] uppercase font-bold text-black/30 mb-8 border-l-2 border-black/10 pl-4">Digital Operating System 2.0</p>
              <h1 className="text-6xl sm:text-8xl lg:text-[10rem] font-serif leading-[0.9] tracking-tighter max-w-5xl">
                Intentionality <br />
                <span className="italic">as an</span> Infrastructure.
              </h1>
            </div>

            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <p className="text-xl sm:text-2xl font-light leading-relaxed text-black/60 max-w-md">
                  A minimalist digital retreat for founders and high-stakes creators. Manage your projects and capital with architectural precision.
                </p>
                <div className="flex items-center gap-10 pt-4">
                  <Button asChild size="lg" className="rounded-full px-12 h-16 bg-black text-white hover:bg-neutral-800 text-[11px] tracking-[0.2em] font-bold uppercase ring-offset-4 ring-offset-white focus:ring-2 ring-black">
                    <Link href="/register">Start Configuration</Link>
                  </Button>
                  <Link href="#about" className="group flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase font-bold text-black/50 hover:text-black transition-all">
                    The Manifesto <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-12 border-t border-black/5">
                <div>
                  <p className="text-3xl font-serif leading-none mb-2">95%</p>
                  <p className="text-[9px] tracking-widest uppercase font-bold opacity-30">Concentration Gain</p>
                </div>
                <div>
                  <p className="text-3xl font-serif leading-none mb-2">Clean</p>
                  <p className="text-[9px] tracking-widest uppercase font-bold opacity-30">No Noise UX</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden rounded-md shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
                  className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-1000"
                  alt="Workspace"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Manifesto Section */}
        <section id="about" className="px-6 py-40 sm:px-16 bg-black text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-neutral-900/50 -skew-x-12 translate-x-1/2 pointer-events-none" />

          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 relative z-10">
            <div className="lg:col-span-8">
              <p className="text-[11px] tracking-[0.4em] uppercase font-bold text-accent mb-12">The Manifesto</p>
              <h2 className="text-5xl sm:text-7xl lg:text-8xl font-serif leading-tight mb-16">
                Distraction is <br />
                the <span className="italic text-accent">enemy</span> of scale.
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-neutral-400 leading-relaxed text-lg">
                <p>
                  Legacy tools are designed to keep you inside them. We designed OrbitOS to get you through your work and back to your life. Every interaction is optimized for the fewest clicks possible.
                </p>
                <p>
                  Sustainable productivity isn't about doing more. It's about doing what matters in a space that feels like a quiet gallery, not a chaotic stock exchange.
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 flex items-center justify-center">
              <div className="w-full aspect-square border border-neutral-800 rounded-full flex items-center justify-center p-12 group hover:border-accent transition-colors duration-700">
                <div className="text-center">
                  <Zap className="h-12 w-12 text-accent mx-auto mb-6 group-hover:scale-125 transition-transform" />
                  <p className="text-2xl font-serif italic mb-2">Instant Flow</p>
                  <p className="text-[10px] tracking-widest uppercase font-bold opacity-40">Load speed: 0.2s</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interface Evolution */}
        <section id="interface" className="px-6 py-40 sm:px-16">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-32 space-y-6">
              <p className="text-[11px] tracking-[0.4em] uppercase font-bold text-black/30">The Interface</p>
              <h2 className="text-5xl sm:text-7xl font-serif">Redefining Digital Space</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 px-4 sm:px-0">
              {[
                { title: "Financial Pulse", img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800", cat: "Capital management" },
                { title: "Ambition Grid", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800", cat: "Project scaling" },
                { title: "Nexus Control", img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800", cat: "Central command" }
              ].map((item, i) => (
                <div key={i} className="group relative aspect-[3/4] overflow-hidden bg-neutral-200">
                  <img src={item.img} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" alt={item.title} />
                  <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black/80 to-transparent text-white translate-y-4 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100">
                    <p className="text-[10px] tracking-widest uppercase font-bold opacity-60 mb-2">{item.cat}</p>
                    <h4 className="text-3xl font-serif italic">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing / Access */}
        <section id="pricing" className="px-6 py-40 sm:px-16 bg-[#F8F5F2]">
          <div className="max-w-[1000px] mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-black text-white text-[9px] tracking-[0.3em] uppercase font-bold mb-12 rounded-full">Membership</div>
            <h2 className="text-5xl sm:text-7xl font-serif mb-16 leading-tight">Access the sanctuary. <br /> Reclaim your concentration.</h2>
            <div className="bg-white p-12 sm:p-24 shadow-xl border border-black/5 rounded-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="text-left space-y-8">
                  <h3 className="text-4xl font-serif italic tracking-tighter">Lifetime Beta Residency</h3>
                  <p className="text-black/60 leading-relaxed">Early access to the full operating suite, including future AI-driven optimizations. One-time entry for pioneering residents.</p>
                  <Button asChild block className="rounded-full h-16 bg-black text-white hover:bg-neutral-800 text-[11px] tracking-[0.2em] font-bold uppercase w-full sm:w-auto px-12">
                    <Link href="/register">Request Invite</Link>
                  </Button>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-8xl font-serif leading-none tracking-tighter mb-4">₹00</p>
                  <p className="text-[11px] tracking-widest uppercase font-bold opacity-30">Launch Cohort Only</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-32 sm:px-16 bg-[#FDFCFB] border-t border-black/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-2 space-y-12">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-serif italic text-xl">O</div>
              <span className="text-2xl font-serif italic tracking-tight">Orbit OS</span>
            </div>
            <p className="text-black/40 max-w-sm leading-relaxed text-sm font-medium">
              Designing digital systems with architectural integrity. Built for those who build things that matter.
            </p>
          </div>

          <div className="space-y-8">
            <p className="text-[10px] tracking-widest uppercase font-bold opacity-30">Infrastructure</p>
            <nav className="flex flex-col gap-4 text-[10px] tracking-widest uppercase font-bold text-black/60">
              <Link href="/dashboard" className="hover:text-black">Dashboard</Link>
              <Link href="/dashboard/projects" className="hover:text-black">Projects</Link>
              <Link href="/dashboard/finance" className="hover:text-black">Capital</Link>
            </nav>
          </div>

          <div className="space-y-8">
            <p className="text-[10px] tracking-widest uppercase font-bold opacity-30">Legal</p>
            <nav className="flex flex-col gap-4 text-[10px] tracking-widest uppercase font-bold text-black/60">
              <Link href="#" className="hover:text-black">Privacy Policy</Link>
              <Link href="#" className="hover:text-black">Terms of Service</Link>
            </nav>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto mt-24 pt-12 border-t border-black/5 flex flex-col sm:flex-row justify-between items-center gap-8 text-[10px] tracking-widest uppercase font-bold opacity-30">
          <p>© 2024 Orbit Ecosystem. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Systems Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
