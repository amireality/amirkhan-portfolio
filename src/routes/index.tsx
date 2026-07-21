import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { SmoothScroll } from "@/components/portfolio/SmoothScroll";
import { Reveal, SplitHeading } from "@/components/portfolio/Reveal";
import { MagneticButton } from "@/components/portfolio/MagneticButton";
import { BookCall } from "@/components/portfolio/BookCall";

const Hero3D = lazy(() =>
  import("@/components/portfolio/Hero3D").then((m) => ({ default: m.Hero3D })),
);

export const Route = createFileRoute("/")({
  component: Index,
});

const ventures = [
  {
    idx: "01",
    kind: "Agency / Founder",
    name: "Setupr",
    body: "Full-stack business setup for Indian founders and SMBs. Brand identity, digital presence, cloud infrastructure, and the ops tooling that lets a two-person team ship like a fifty-person one.",
    tags: ["Brand", "Cloud Infra", "GTM"],
    status: "OPERATING",
  },
  {
    idx: "02",
    kind: "D2C Brand",
    name: "Altered",
    body: "Pre-launch women's urban ethnic apparel. Traditional silhouettes cut for the way women in Indian cities actually live, work, and move now.",
    tags: ["Branding", "Ecommerce", "Product"],
    status: "PRE-LAUNCH",
  },
  {
    idx: "03",
    kind: "AI Product",
    name: "Alt",
    body: "On-premise LLM stack for teams that can't or won't ship their data to a US API endpoint. Local models, private context, sensible latency.",
    tags: ["LLM", "Infra", "Privacy"],
    status: "IN BUILD",
  },
  {
    idx: "04",
    kind: "Advisory",
    name: "Consulting",
    body: "Sales process, ICP work and outreach tooling for advisory clients, including a strategic firm doing forensic accounting and M&A. Turning senior expertise into a repeatable pipeline.",
    tags: ["Sales Ops", "ICP", "Outreach"],
    status: "ONGOING",
  },
];

const services = [
  { n: "01", t: "Business Setup Consulting", d: "Entity, banking, ops stack, the whole first-90-days sprint that most founders lose to admin." },
  { n: "02", t: "Brand Identity", d: "Naming, positioning, mark, type system, launch collateral. Brands built to be scaled, not just launched." },
  { n: "03", t: "Digital Presence", d: "Sites, landing pages, content OS. What people find when they Google you, designed on purpose." },
  { n: "04", t: "Cloud Infrastructure", d: "AWS / Cloudflare / edge. Sensible defaults, real observability, invoices you can explain." },
  { n: "05", t: "Sales Process & GTM", d: "ICP, message-market fit, outbound systems. Structuring how you sell so it's not just the founder closing every deal." },
  { n: "06", t: "AI-Assisted Builds", d: "End-to-end web products shipped through vibecoding, from prompt to production on real infra." },
];

const sites = [
  { name: "Setupr", one: "Agency site and lead engine.", stack: ["Next.js", "Tailwind", "Sanity"], href: "#" },
  { name: "Altered", one: "D2C ethnic apparel storefront.", stack: ["Shopify", "Hydrogen", "GSAP"], href: "#" },
  { name: "Alt", one: "On-prem LLM product page.", stack: ["Astro", "Tailwind", "MDX"], href: "#" },
  { name: "Advisory Portal", one: "M&A advisory client portal.", stack: ["React", "TanStack", "Supabase"], href: "#" },
  { name: "Founder Landing", one: "Personal brand landing for a solo operator.", stack: ["Framer", "Motion"], href: "#" },
  { name: "Cohort Site", one: "Application site for a private cohort.", stack: ["Next.js", "Resend"], href: "#" },
];

const processSteps = [
  { n: "01", t: "Vibe Check", d: "We align on what the thing wants to feel like before I touch a prompt or a Figma frame." },
  { n: "02", t: "Architecture", d: "I map data, surfaces, and the shortest path from user intent to shipped value." },
  { n: "03", t: "Prompt & Ship", d: "AI-assisted build cycles, daily deployable increments, no month-long silences." },
  { n: "04", t: "Operate", d: "Once it's live it's a system, not a project. Analytics, iteration, ownership handoff." },
];

const tools = [
  "React", "Next.js", "TanStack", "Tailwind", "Three.js", "Motion",
  "Cursor", "Claude", "GPT", "Cloudflare", "AWS", "Supabase",
  "Shopify", "Figma", "Notion", "Zapier",
];

const writing = [
  { tag: "LinkedIn", title: "Why 'vibecoding' isn't a shortcut, it's a discipline", excerpt: "The people scoffing at AI-assisted development are the same people who scoffed at Squarespace in 2013." },
  { tag: "Blog", title: "The first 90 days of any Indian SMB", excerpt: "A working checklist from GST to Google Workspace, written from the receipts of doing it dozens of times." },
  { tag: "LinkedIn", title: "Your ICP is a person, not a segment", excerpt: "If you can't name three actual humans that match it, you don't have an ICP, you have a slide." },
];

function Index() {
  return (
    <div className="noise relative min-h-screen bg-bg font-body text-fg selection:bg-accent selection:text-bg">
      <SmoothScroll />
      <Nav />
      <Hero />
      <Marquee />
      <About />
      <Services />
      <Ventures />
      <Sites />
      <Stats />
      <Process />
      <ToolsSection />
      <Writing />
      <BookCall />
      <Contact />
      <Footer />
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = [
    { href: "#about", label: "Narrative" },
    { href: "#work", label: "Work" },
    { href: "#sites", label: "Sites" },
    { href: "#writing", label: "Writing" },
    { href: "#book", label: "Book Call" },
    { href: "#contact", label: "Contact" },
  ];
  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-bg/80 py-3 backdrop-blur-md" : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 md:px-12">
        <a href="#top" className="flex items-center gap-2">
          <span className="size-2 animate-pulse rounded-full bg-accent" />
          <span className="font-mono text-xs uppercase tracking-[0.2em]">AK / 407</span>
        </a>
        <div className="hidden gap-8 font-mono text-[10px] uppercase tracking-[0.25em] text-muted md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-fg">{l.label}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="border border-accent/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-accent transition-all hover:bg-accent hover:text-bg"
          >
            Initiate
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex size-9 flex-col items-center justify-center gap-1.5 border border-border md:hidden"
          >
            <span className={`h-px w-4 bg-fg transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`h-px w-4 bg-fg transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>
      <div
        className={`overflow-hidden border-t border-border bg-bg/95 backdrop-blur-md transition-[max-height] duration-300 md:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="flex flex-col px-6 py-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-border/50 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted hover:text-accent"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section id="top" className="relative flex min-h-[calc(100svh-8rem)] flex-col justify-center overflow-hidden px-6 pb-8 pt-20 md:min-h-[calc(100svh-9rem)] md:px-20 md:pt-24">
      <div className="specimen-glow absolute inset-0 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-[12%] mx-auto h-[55vh] w-[95vw] opacity-70 sm:opacity-90 md:right-[-4%] md:left-auto md:top-1/2 md:mx-0 md:h-[70vh] md:w-[70vw] md:-translate-y-1/2 md:opacity-100 lg:h-[80vh] lg:w-[60vw]">
        <Suspense fallback={null}>
          <Hero3D />
        </Suspense>
      </div>
      <div className="relative z-10">
        <div className="fade-up mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          <span className="size-2 bg-accent" />
          <span>Founder · Operator · Vibecoder · Jaipur, IN</span>
        </div>
        <SplitHeading
          text="Amir Khan"
          className="font-display text-[15vw] leading-[0.85] uppercase tracking-tight md:text-[11vw]"
        />
        <div className="mt-6 flex flex-col justify-between gap-6 md:mt-8 md:flex-row md:items-end">
          <p className="fade-up max-w-xl text-pretty text-base font-light leading-relaxed text-fg/90 md:text-xl" style={{ animationDelay: "0.6s" }}>
            I build brands, cloud infrastructure, and AI-native systems, end to end,{" "}
            <span className="text-accent">through AI-assisted prompting</span>, from a workshop in Jaipur.
          </p>
          <div className="fade-up font-mono text-[11px] uppercase tracking-[0.2em] text-muted" style={{ animationDelay: "0.9s" }}>
            <NodeTicker />
            <div>[STATUS] Taking on new work, Q1</div>
            <div>[LAST SHIP] 4 hours ago</div>
          </div>
        </div>
        <div className="fade-up mt-8 flex flex-wrap gap-4 md:mt-10" style={{ animationDelay: "1.1s" }}>
          <MagneticButton
            href="#work"
            className="bg-accent px-6 py-3 font-display text-base uppercase tracking-widest text-bg md:px-8 md:py-4 md:text-lg"
          >
            See the work
          </MagneticButton>
          <MagneticButton
            href="#book"
            className="border border-border px-6 py-3 font-display text-base uppercase tracking-widest text-fg hover:border-accent md:px-8 md:py-4 md:text-lg"
          >
            Book a call
          </MagneticButton>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-3 left-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted md:left-20">
        Scroll ↓ to enter
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Vibecoding", "Cloud Architecture", "Brand Identity", "D2C Apparel", "LLM Orchestration", "GTM Operations", "Forensic Accounting Tooling"];
  return (
    <div className="overflow-hidden border-y border-border bg-bg/60 py-5 backdrop-blur">
      <div className="marquee-track flex gap-12 whitespace-nowrap font-mono text-xs uppercase tracking-[0.3em] text-muted">
        {[...items, ...items, ...items].map((s, i) => (
          <span key={i} className="flex items-center gap-12">
            <span className={i % 3 === 1 ? "text-accent" : ""}>{s}</span>
            <span className="opacity-30">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="grid grid-cols-1 gap-12 px-6 py-32 md:grid-cols-12 md:px-20">
      <div className="md:col-span-4">
        <Reveal>
          <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">[01] The Narrative</p>
          <h2 className="font-display text-5xl uppercase leading-none md:text-6xl">
            Heavy<br />generalist,<br /><span className="text-accent">on purpose.</span>
          </h2>
        </Reveal>
      </div>
      <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-muted md:col-span-8">
        <Reveal delay={0.05}>
          <p className="text-fg">
            I don't fit in a single lane, and after ten years of trying I've stopped pretending I should. My path runs from the technical precision of cloud infrastructure to the tactile world of D2C ethnic apparel, and every stop in between.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p>
            Setupr is the through-line: an agency that helps Indian founders and SMBs stop losing months to setup admin and start shipping. Alongside it I run <span className="text-fg">Altered</span>, a pre-launch women's urban ethnic apparel brand, and <span className="text-fg">Alt</span>, an on-premise LLM project for teams that can't send their data to someone else's cloud.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p>
            I call myself a <span className="italic text-fg">vibecoder</span>. That's not a shortcut, it's a discipline. I build through AI-assisted prompting instead of hand-coding line by line, which means I spend my time on architecture, taste, and outcomes rather than on syntax. Same jump front-end got when it stopped being &ldquo;write CSS by hand&rdquo; and became &ldquo;compose from a design system.&rdquo;
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <p>
            The through-line across all of it: I like being the person you point at a hard, cross-functional problem and hear back &ldquo;shipped&rdquo; instead of &ldquo;scoped.&rdquo;
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="border-t border-border px-6 py-32 md:px-20">
      <Reveal>
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">[02] Services</p>
        <h2 className="mb-16 font-display text-5xl uppercase md:text-6xl">What I actually do</h2>
      </Reveal>
      <div className="grid grid-cols-1 border border-border md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.05}>
            <div className="group h-full border-b border-r border-border p-8 transition-colors hover:bg-accent/[0.03]">
              <div className="mb-16 flex items-start justify-between">
                <span className="font-mono text-[10px] text-muted">{s.n}</span>
                <span className="size-2 rounded-full bg-border transition-colors group-hover:bg-accent" />
              </div>
              <h3 className="mb-3 font-display text-3xl uppercase">{s.t}</h3>
              <p className="text-sm leading-relaxed text-muted">{s.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Ventures() {
  return (
    <section id="work" className="border-t border-border bg-white/[0.015] px-6 py-32 md:px-20">
      <Reveal>
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">[03] Core Holdings</p>
        <h2 className="mb-16 font-display text-5xl uppercase md:text-6xl">Ventures &amp; case studies</h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-2">
        {ventures.map((v, i) => (
          <Reveal key={v.name} delay={i * 0.06}>
            <article className="group relative flex h-full flex-col justify-between bg-bg p-8 transition-colors hover:bg-accent/[0.03] md:p-12">
              <div className="mb-16 flex items-start justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  {v.idx} / {v.kind}
                </span>
                <span className="border border-accent/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-accent">
                  {v.status}
                </span>
              </div>
              <div>
                <h3 className="mb-5 font-display text-6xl uppercase md:text-7xl">{v.name}</h3>
                <p className="mb-8 max-w-md text-pretty leading-relaxed text-muted">{v.body}</p>
                <div className="flex flex-wrap gap-2">
                  {v.tags.map((t) => (
                    <span key={t} className="border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function BrowserFrame({ children }: { children?: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-[#111]">
      <div className="flex items-center gap-1.5 border-b border-border bg-[#0c0c0c] px-3 py-2">
        <span className="size-2.5 rounded-full bg-white/10" />
        <span className="size-2.5 rounded-full bg-white/10" />
        <span className="size-2.5 rounded-full bg-white/10" />
        <span className="ml-3 rounded bg-black/40 px-2 py-0.5 font-mono text-[9px] text-muted">https://</span>
      </div>
      <div className="aspect-video bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.15),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(251,191,36,0.08),transparent_60%)]">
        {children}
      </div>
    </div>
  );
}

function Sites() {
  return (
    <section id="sites" className="border-t border-border px-6 py-32 md:px-20">
      <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">[04] Web Archive</p>
          <h2 className="font-display text-5xl uppercase md:text-6xl">Sites I&rsquo;ve built</h2>
          <p className="mt-4 max-w-md text-pretty text-muted">
            End-to-end web builds shipped through AI-assisted prompting. Placeholder previews, swap in real screenshots and links.
          </p>
        </Reveal>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">{sites.length} shipped</span>
      </div>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        {sites.map((s, i) => (
          <Reveal key={s.name} delay={i * 0.05}>
            <a href={s.href} className="group block">
              <BrowserFrame />
              <div className="mt-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h4 className="font-display text-2xl uppercase transition-colors group-hover:text-accent">{s.name}</h4>
                  <p className="mt-1 text-sm text-muted">{s.one}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {s.stack.map((t) => (
                      <span key={t} className="border border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="grid size-10 shrink-0 place-items-center border border-border transition-all group-hover:bg-accent group-hover:text-bg">↗</span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const dur = 1600;
    let raf = 0;
    const step = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / dur, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span>{n}{suffix}</span>;
}

function Stats() {
  const stats = [
    { label: "Clients served", value: 42, suffix: "+" },
    { label: "Sites shipped", value: 60, suffix: "+" },
    { label: "Active ventures", value: 4, suffix: "" },
    { label: "Years operating", value: 8, suffix: "" },
  ];
  return (
    <section className="grid grid-cols-2 gap-px border-y border-border bg-border md:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-bg p-10">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">{s.label}</div>
          <div className="font-display text-5xl md:text-6xl">
            <Counter to={s.value} suffix={s.suffix} />
          </div>
        </div>
      ))}
    </section>
  );
}

function Process() {
  return (
    <section className="px-6 py-32 md:px-20">
      <Reveal>
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">[05] Protocol</p>
        <h2 className="mb-16 font-display text-5xl uppercase md:text-6xl">How I work</h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {processSteps.map((p, i) => (
          <Reveal key={p.n} delay={i * 0.05}>
            <div className="flex gap-6 border-l border-border pl-6">
              <span className="font-mono text-xs text-accent">{p.n}</span>
              <div>
                <h3 className="mb-3 font-display text-3xl uppercase">{p.t}</h3>
                <p className="leading-relaxed text-muted">{p.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ToolsSection() {
  return (
    <section className="border-t border-border px-6 py-32 md:px-20">
      <Reveal>
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">[06] Instruments</p>
        <h2 className="mb-16 font-display text-5xl uppercase md:text-6xl">Tools of the workshop</h2>
      </Reveal>
      <div className="flex flex-wrap gap-3">
        {tools.map((t, i) => (
          <Reveal key={t} delay={i * 0.02}>
            <span className="border border-border bg-white/[0.02] px-5 py-3 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:border-accent hover:text-accent">
              {t}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Writing() {
  return (
    <section id="writing" className="border-t border-border bg-white/[0.015] px-6 py-32 md:px-20">
      <Reveal>
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">[07] Signals</p>
        <h2 className="mb-16 font-display text-5xl uppercase md:text-6xl">Writing &amp; content</h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-3">
        {writing.map((w, i) => (
          <Reveal key={w.title} delay={i * 0.05}>
            <article className="flex h-full flex-col justify-between bg-bg p-8 transition-colors hover:bg-accent/[0.03]">
              <div>
                <span className="mb-6 inline-block font-mono text-[10px] uppercase tracking-widest text-accent">{w.tag}</span>
                <h3 className="mb-4 font-display text-2xl uppercase leading-tight">{w.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{w.excerpt}</p>
              </div>
              <a href="#" className="mt-10 font-mono text-[10px] uppercase tracking-widest text-fg hover:text-accent">Read →</a>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };
  return (
    <section id="contact" className="border-t border-border px-6 py-32 md:px-20">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">[08] Connection</p>
          <h2 className="mb-4 font-display text-5xl uppercase md:text-7xl">Start something.</h2>
          <p className="mb-16 max-w-xl text-lg text-muted">
            Setup, brand, cloud, GTM, or a full site built in weeks not quarters. Tell me what you&rsquo;re building.
          </p>
        </Reveal>
        {sent ? (
          <Reveal>
            <div className="border border-accent/30 bg-accent/[0.03] p-10 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Signal received</p>
              <p className="mt-4 font-display text-3xl uppercase">I&rsquo;ll be in touch inside 24 hours.</p>
            </div>
          </Reveal>
        ) : (
          <form onSubmit={onSubmit} className="space-y-12">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              <Field label="Your name" name="name" required placeholder="AMIR KHAN" />
              <Field label="Email" name="email" type="email" required placeholder="AK@SETUPR.IN" />
            </div>
            <Field label="Project parameters" name="msg" textarea required placeholder="DESCRIBE THE VISION" />
            <div>
              <MagneticButton type="submit" className="bg-accent px-10 py-5 font-display text-xl uppercase tracking-widest text-bg">
                Transmit signal ↗
              </MagneticButton>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  label, name, type = "text", textarea, required, placeholder,
}: {
  label: string; name: string; type?: string; textarea?: boolean; required?: boolean; placeholder?: string;
}) {
  const cn =
    "w-full border-b border-border bg-transparent py-4 font-display text-2xl uppercase tracking-wide outline-none transition-colors placeholder:text-fg/10 focus:border-accent";
  return (
    <label className="block space-y-4">
      <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-muted">{label}</span>
      {textarea ? (
        <textarea name={name} required={required} rows={3} placeholder={placeholder} maxLength={2000} className={cn} />
      ) : (
        <input name={name} type={type} required={required} placeholder={placeholder} maxLength={200} className={cn} />
      )}
    </label>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border px-6 py-16 md:px-20">
      <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
        <div>
          <div className="font-display text-4xl uppercase leading-none md:text-6xl">
            Amir Khan <span className="text-accent">//</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted">
            Founder of Setupr. Building brands, cloud infrastructure, and AI-native systems from Jaipur, India.
          </p>
        </div>
        <div className="flex flex-col gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted md:items-end">
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent">LinkedIn</a>
            <a href="#" className="hover:text-accent">Twitter</a>
            <a href="#" className="hover:text-accent">Github</a>
            <a href="#" className="hover:text-accent">Email</a>
          </div>
          <div>© {new Date().getFullYear()}, All systems nominal</div>
          <div className="text-fg/40">Designed for the late-night console.</div>
        </div>
      </div>
    </footer>
  );
}
