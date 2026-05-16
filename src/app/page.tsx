import { AgentFeed } from "@/components/AgentFeed";
import { LogoLink, TrackedAnchor } from "@/components/Tracked";
import { BOOK_DEMO_URL } from "@/lib/copy";

function RequestAccessButton({
  size = "md",
  track,
}: {
  size?: "md" | "lg";
  track: string;
}) {
  const sizing =
    size === "lg" ? "px-7 py-3.5 text-[15px]" : "px-5 py-2 text-[13px]";
  return (
    <TrackedAnchor
      href={BOOK_DEMO_URL}
      target="_blank"
      rel="noopener noreferrer"
      track={track}
      className={`group inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] font-medium text-[var(--color-bg)] transition hover:bg-[var(--color-accent-deep)] ${sizing}`}
    >
      Request access
      <span className="transition group-hover:translate-x-0.5">→</span>
    </TrackedAnchor>
  );
}

const VALUE = [
  {
    n: "01",
    headline: "Pipeline in days.",
    sub: "Not the quarter it takes to interview, hire, and ramp a first rep. Start sourcing and meeting prospects this week.",
  },
  {
    n: "02",
    headline: "You stay on product.",
    sub: "Building and closing are the only two things only you can do. Everything else — list-building, sequences, prep, follow-ups — agents handle in your voice.",
  },
  {
    n: "03",
    headline: "Postpone the first hire.",
    sub: "Prove the motion before you commit a $300k+ comp plan. Hire for leverage — not to do the work yourself in a different seat.",
  },
];

const FEATURES = [
  {
    n: "01",
    name: "Prospect identification",
    body: "ICP fit scored continuously. Triggers — funding, hiring, tech adoption, traffic — surfaced before competitors notice.",
  },
  {
    n: "02",
    name: "AI outbound outreach",
    body: "Sequences drafted in your voice with account-specific context. Reply intent classified, routed, and continued — coherent across 12+ days.",
  },
  {
    n: "03",
    name: "Meeting helper",
    body: "Pre-call brief auto-generated. Live pointers during the call. Recording, transcript, and committed actions in the right place by the time you hang up.",
  },
  {
    n: "04",
    name: "Lightweight CRM",
    body: "Pipeline is the byproduct of what the agents already know — not a chore you do on Fridays. Drift and expansion signals surface on their own.",
  },
];

function Wordmark({ size = "md" }: { size?: "sm" | "md" }) {
  const dim = size === "sm" ? 22 : 28;
  return (
    <div className="flex items-center gap-2.5">
      <svg width={dim} height={dim} viewBox="0 0 32 32" className="shrink-0">
        <rect width="32" height="32" rx="7" fill="var(--color-ink)" />
        <path d="M6.5 22 Q 16 5 25.5 22" stroke="#f5f1e8" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <line x1="5" y1="25" x2="27" y2="25" stroke="#b8421d" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <span className="font-display text-[20px] tracking-[-0.01em] text-[var(--color-ink)]">Fosbury</span>
    </div>
  );
}

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      {/* nav */}
      <header className="sticky top-0 z-40 border-b hairline bg-[var(--color-bg)]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <LogoLink
            track="Nav - Logo"
            className="rounded-sm transition hover:opacity-80"
          >
            <Wordmark />
          </LogoLink>
          <nav className="flex items-center gap-6 font-mono text-[11.5px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
            <TrackedAnchor
              href="#value"
              track="Nav - Why"
              className="hover:text-[var(--color-ink)]"
            >
              Why
            </TrackedAnchor>
            <TrackedAnchor
              href="#agents"
              track="Nav - What it does"
              className="hidden hover:text-[var(--color-ink)] sm:inline"
            >
              What it does
            </TrackedAnchor>
            <TrackedAnchor
              href={BOOK_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              track="Request Access - Nav"
              className="rounded-full bg-[var(--color-accent)] px-3.5 py-1.5 text-[var(--color-bg)] hover:bg-[var(--color-accent-deep)]"
            >
              Request access
            </TrackedAnchor>
          </nav>
        </div>
      </header>

      {/* hero */}
      <section className="relative">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-70" />
        <div className="warm-halo pointer-events-none absolute left-1/2 top-0 -z-10 h-[460px] w-[820px] -translate-x-1/2 rounded-full blur-2xl" />

        <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-20">
          <div className="flex flex-col justify-center">
            <h1 className="display-tight text-[52px] sm:text-[68px] lg:text-[80px]">
              The first sales hire<br />
              <span className="italic text-[var(--color-fg-muted)]">you actually&nbsp;</span>
              <span className="ink-underline">need.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-[var(--color-fg-muted)] sm:text-[18px]">
              Built for founders still doing sales themselves. Get pipeline in days,
              stay focused on product and closing, and postpone the head-of-sales hire
              until the motion is proven.
            </p>

            <div className="mt-8">
              <RequestAccessButton size="lg" track="Request Access - Hero" />
              <p className="mt-3 font-mono text-[11px] tracking-wider text-[var(--color-fg-muted)]">
                Series A B2B SaaS · founder-led sales · seed cohort
              </p>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t hairline pt-5 font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-muted)]">
              <div>
                <div className="font-display text-[20px] tracking-tight text-[var(--color-ink)]">Pipeline</div>
                <div className="mt-0.5">in days</div>
              </div>
              <div>
                <div className="font-display text-[20px] tracking-tight text-[var(--color-ink)]">Founder</div>
                <div className="mt-0.5">on product</div>
              </div>
              <div>
                <div className="font-display text-[20px] tracking-tight text-[var(--color-ink)]">First rep</div>
                <div className="mt-0.5">later, not now</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <AgentFeed />
            <div className="warm-halo absolute -bottom-6 -right-6 -z-10 size-44 rounded-full blur-2xl" />
          </div>
        </div>
      </section>

      {/* value — founder-led sales, crystal clear */}
      <section id="value" className="relative border-t hairline">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <SectionLabel index="// 01" title="Why this exists" />
          <h2 className="display-tight mt-5 max-w-3xl text-[38px] sm:text-[52px]">
            What founder-led sales{" "}
            <span className="italic text-[var(--color-fg-muted)]">actually needs.</span>
          </h2>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border hairline bg-[var(--color-line)] sm:grid-cols-3">
            {VALUE.map((v) => (
              <div key={v.n} className="relative bg-[var(--color-bg-elev)] p-8">
                <div className="grain-heavy pointer-events-none absolute inset-0 opacity-40" />
                <div className="relative">
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
                    {v.n}
                  </div>
                  <h3 className="display-tight mt-4 text-[28px] sm:text-[32px]">{v.headline}</h3>
                  <p className="mt-4 text-[14.5px] leading-relaxed text-[var(--color-fg-muted)]">{v.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* agents — what it does */}
      <section id="agents" className="relative border-t hairline">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <SectionLabel index="// 02" title="What it does" />
          <h2 className="display-tight mt-5 max-w-3xl text-[38px] sm:text-[52px]">
            Four agents.{" "}
            <span className="italic text-[var(--color-fg-muted)]">One sales motion.</span>
          </h2>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border hairline bg-[var(--color-line)] sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.n} className="group relative bg-[var(--color-bg-elev)] p-8 transition hover:bg-[var(--color-paper)]">
                <div className="grain-heavy pointer-events-none absolute inset-0 opacity-35" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
                      {f.n} · agent
                    </div>
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
                      v1 · live
                    </div>
                  </div>
                  <h3 className="font-display mt-5 text-[26px] tracking-[-0.01em]">{f.name}</h3>
                  <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-[var(--color-fg-muted)]">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* wedge + CTA — bigger picture, then the ask */}
      <section id="waitlist" className="relative grain-heavy border-t hairline">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="warm-halo absolute left-1/2 top-1/2 -z-10 h-[460px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 py-24">
          <SectionLabel index="// 03" title="The bigger picture" />

          <blockquote className="font-display mt-6 max-w-4xl text-[28px] leading-[1.25] tracking-[-0.015em] sm:text-[40px]">
            <span className="text-[var(--color-accent)]">&ldquo;</span>
            Sales is the wedge.{" "}
            <span className="italic text-[var(--color-fg-muted)]">
              The same agent layer extends to customer success — catching drift and
              expansion — and then to marketing, recruiting, and ops. The operating
              system for an agentic company.
            </span>
            <span className="text-[var(--color-accent)]">&rdquo;</span>
          </blockquote>

          <div className="mt-10 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.2em]">
            {["sales · live", "customer success · soon", "marketing · 2027", "recruiting · 2027", "ops · 2027"].map((t) => {
              const live = t.includes("live");
              return (
                <span
                  key={t}
                  className={`rounded-full border px-3 py-1.5 ${
                    live
                      ? "border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)] text-[var(--color-accent-deep)]"
                      : "hairline bg-[var(--color-bg-elev)] text-[var(--color-fg-muted)]"
                  }`}
                >
                  {t}
                </span>
              );
            })}
          </div>

          <div className="mt-20 flex flex-col items-center text-center">
            <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--color-fg-muted)]">
              · the ask ·
            </div>
            <h3 className="display-tight mt-4 max-w-2xl text-[40px] sm:text-[56px]">
              Hire the first agent.<br />
              <span className="italic text-[var(--color-fg-muted)]">Postpone the first rep.</span>
            </h3>
            <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-[var(--color-fg-muted)]">
              Small seed cohort. White-glove setup. Direct line to the founders building this.
            </p>
            <div className="mt-8 flex w-full max-w-lg justify-center">
              <RequestAccessButton size="lg" track="Request Access - Footer" />
            </div>
            <div className="mt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-fg-muted)]">
              · no spam · no public launch list · founders only ·
            </div>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t hairline">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 sm:flex-row sm:items-center">
          <Wordmark size="sm" />
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-fg-muted)]">
            © 2026 · the company OS, starting with sales
          </div>
        </div>
      </footer>
    </main>
  );
}

function SectionLabel({ index, title, centered }: { index: string; title: string; centered?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--color-fg-muted)] ${
        centered ? "justify-center" : ""
      }`}
    >
      <span className="text-[var(--color-accent)]">{index}</span>
      <span className="h-px w-8 bg-[var(--color-line-strong)]" />
      <span>{title}</span>
    </div>
  );
}
