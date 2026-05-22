import ProductCard from "./components/ProductCard";

const CTA_HREF = "https://calendar.app.google/egNmyHmeZKrR9UfM8";

function FosburyMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden
      className="shrink-0"
    >
      <rect width="32" height="32" rx="7" fill="#1c1814" />
      <path
        d="M6.5 22 Q 16 5 25.5 22"
        stroke="#f5f1e8"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      <line
        x1="5"
        y1="25"
        x2="27"
        y2="25"
        stroke="#c0512e"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PrimaryCTA({ children = "Become a design partner" }: { children?: string }) {
  return (
    <a
      href={CTA_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent)] px-6 py-3.5 text-[15px] font-medium tracking-tight text-white shadow-[0_10px_28px_-10px_rgba(234,90,30,0.55)] transition-all hover:bg-[color:var(--color-accent-hover)] hover:shadow-[0_14px_32px_-10px_rgba(234,90,30,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-accent)]"
    >
      {children}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-0.5">
        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen">
      {/* ───────── Screen 1 · Hero ───────── */}
      <section className="hero-bg relative overflow-hidden">
        {/* atmospheric pigment volumes */}
        <span
          className="pigment"
          style={{
            width: 520,
            height: 520,
            top: -120,
            right: -160,
            background: "radial-gradient(circle, rgba(234,90,30,0.40) 0%, rgba(234,90,30,0) 70%)",
          }}
        />
        <span
          className="pigment"
          style={{
            width: 460,
            height: 460,
            bottom: -180,
            left: -120,
            background: "radial-gradient(circle, rgba(214,168,108,0.32) 0%, rgba(214,168,108,0) 70%)",
            opacity: 0.7,
          }}
        />
        <span
          className="pigment"
          style={{
            width: 380,
            height: 380,
            top: "30%",
            left: "42%",
            background: "radial-gradient(circle, rgba(255,221,180,0.40) 0%, rgba(255,221,180,0) 70%)",
            opacity: 0.55,
          }}
        />

        {/* heavier paper grain scoped to hero */}
        <span className="grain-paper" aria-hidden />

        <header className="relative z-10 mx-auto flex max-w-[1240px] items-center justify-between px-6 pt-7">
          <a href="/" className="flex items-center gap-2.5" aria-label="Fosbury home">
            <FosburyMark size={28} />
            <span className="text-[15px] font-semibold tracking-tight">Fosbury</span>
          </a>
        </header>

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-[1280px] grid-cols-1 items-center gap-14 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-16 lg:py-16">
          <div>
            <div className="text-[11.5px] font-medium uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
              Revenue intelligence · for the modern CRO
            </div>

            <h1 className="mt-5 font-medium tracking-[-0.035em] leading-[1.04] text-[42px] sm:text-[54px] lg:text-[64px]">
              Run revenue on{" "}
              <span className="marker-highlight">signals,</span>
              <br className="hidden sm:block" />{" "}
              <span className="marker-highlight marker-highlight--step-2">not stories.</span>
            </h1>

            <p className="mt-7 max-w-[52ch] text-[18px] leading-[1.55] text-[color:var(--color-ink-soft)]">
              Forecasts miss because the inputs lie. Fosbury reads every buyer
              signal — calls, product usage, email, support — and surfaces
              what&rsquo;s actually <span className="font-medium text-[color:var(--color-ink)]">closing</span>,{" "}
              <span className="font-medium text-[color:var(--color-ink)]">slipping</span>, or about to{" "}
              <span className="font-medium text-[color:var(--color-ink)]">churn</span>.
              Less pipeline theater. A number the board can trust.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <PrimaryCTA />
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <ProductCard />
          </div>
        </div>
      </section>

      {/* ───────── Screen 2 · Manifesto ───────── */}
      <section className="manifesto-bg relative overflow-hidden px-6 py-28 text-white">
        {/* warm ember pigment in lower-left */}
        <span
          className="pigment"
          style={{
            width: 700,
            height: 700,
            bottom: -260,
            left: -200,
            background: "radial-gradient(circle, rgba(234,90,30,0.55) 0%, rgba(234,90,30,0) 70%)",
            opacity: 0.45,
            filter: "blur(90px)",
          }}
        />
        {/* faint cool light upper-right */}
        <span
          className="pigment"
          style={{
            width: 520,
            height: 520,
            top: -180,
            right: -160,
            background: "radial-gradient(circle, rgba(180,160,120,0.30) 0%, rgba(180,160,120,0) 70%)",
            opacity: 0.5,
          }}
        />
        {/* horizon glow at very bottom */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
          style={{
            background:
              "linear-gradient(to top, rgba(234,90,30,0.10), transparent)",
          }}
        />
        {/* light specks across the dark */}
        <span className="grain-screen" aria-hidden />

        <div className="relative z-10 mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <h2 className="max-w-[20ch] text-[36px] font-medium leading-[1.05] tracking-[-0.03em] sm:text-[48px] lg:text-[58px]">
              A revenue number with{" "}
              <span className="text-[color:var(--color-accent)]">
                evidence behind it.
              </span>
            </h2>
            <p className="mt-7 max-w-[42ch] text-[17px] leading-[1.55] text-white/70">
              Fosbury reads every buyer signal — calls, product usage, email,
              support, CRM — and turns them into a forecast you can defend.
              Every account, every motion, traceable to what actually happened.
            </p>
            <p className="mt-7 text-[18px] font-medium tracking-tight text-[color:var(--color-accent)]">
              This is what modern revenue runs on.
            </p>
          </div>

          <div className="border-t border-white/12 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            <div className="grid grid-cols-3 gap-6">
              {[
                { n: "Every",  l: "signal, in one view" },
                { n: "Days",   l: "to deploy, not quarters" },
                { n: "1",      l: "defensible number, every week" },
              ].map((s) => (
                <div key={s.n}>
                  <div className="font-[var(--font-mono)] text-[26px] font-medium tabular-nums tracking-tight text-white sm:text-[32px]">
                    {s.n}
                  </div>
                  <div className="mt-1 text-[11.5px] uppercase tracking-[0.14em] text-white/55">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-[12px] leading-[1.5] text-white/40">
              Built for revenue leaders who lead with the work.
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Screen 3 · CRM vs Fosbury contrast + CTA ───────── */}
      <section className="contrast-bg relative flex min-h-screen flex-col justify-between overflow-hidden px-6 py-24">
        {/* atmospheric pigments — mint upper-left, peach upper-right, deep amber bottom */}
        <span
          className="pigment"
          style={{
            width: 540,
            height: 540,
            top: -160,
            left: -120,
            background: "radial-gradient(circle, rgba(110,169,135,0.30) 0%, rgba(110,169,135,0) 70%)",
            opacity: 0.6,
          }}
        />
        <span
          className="pigment"
          style={{
            width: 560,
            height: 560,
            top: -180,
            right: -140,
            background: "radial-gradient(circle, rgba(234,90,30,0.28) 0%, rgba(234,90,30,0) 70%)",
            opacity: 0.55,
          }}
        />
        <span
          className="pigment"
          style={{
            width: 900,
            height: 500,
            bottom: -260,
            left: "20%",
            background: "radial-gradient(ellipse, rgba(214,168,108,0.30) 0%, rgba(214,168,108,0) 70%)",
            opacity: 0.6,
            filter: "blur(90px)",
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-[1100px]">
          <h2 className="max-w-[22ch] text-[36px] font-medium leading-[1.1] tracking-[-0.025em] sm:text-[44px]">
            One signal is noise.{" "}
            <span className="text-[color:var(--color-accent)]">The combination</span>{" "}
            is the answer.
          </h2>
          <p className="mt-5 max-w-[58ch] text-[16px] leading-[1.6] text-[color:var(--color-ink-soft)]">
            What your pipeline meeting sounds like today — vs. what it sounds
            like when the inputs are real.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* LEFT — Today: chaos of rep stories */}
            <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_44px_-28px_rgba(40,30,20,0.20)]">
              <span className="grain-paper" aria-hidden style={{ opacity: 0.35 }} />
              <div className="mb-6 flex items-center justify-between">
                <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
                  Today · forecast meeting
                </div>
                <div className="rounded-full bg-[color:var(--color-risk-tint)] px-2.5 py-0.5 text-[10.5px] font-medium text-[color:var(--color-risk)]">
                  gut feel
                </div>
              </div>

              <div className="relative h-[260px]">
                {[
                  { t: "“It’s still in play.”",          x: "6%",  y: "8%",  r: "-3deg", o: 0.9  },
                  { t: "“Champion went dark.”",                x: "44%", y: "2%",  r: "2deg",  o: 1    },
                  { t: "“They’re reorging.”",             x: "10%", y: "38%", r: "1deg",  o: 0.85 },
                  { t: "“Q3 was solid, right?”",               x: "52%", y: "32%", r: "-2deg", o: 0.95 },
                  { t: "“Procurement is slow.”",               x: "20%", y: "66%", r: "3deg",  o: 0.8  },
                  { t: "“Let me circle back.”",                x: "55%", y: "62%", r: "-1deg", o: 0.9  },
                ].map((q, i) => (
                  <div
                    key={i}
                    className="absolute max-w-[60%] rounded-md bg-[#FFFDF6] px-3 py-2 text-[12.5px] leading-[1.35] text-[color:var(--color-ink-soft)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_18px_-10px_rgba(40,30,20,0.25)]"
                    style={{
                      left: q.x,
                      top: q.y,
                      transform: `rotate(${q.r})`,
                      opacity: q.o,
                    }}
                  >
                    {q.t}
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-dashed border-[color:var(--color-line)] pt-5 text-[13px] leading-[1.5] text-[color:var(--color-muted)]">
                Five reps. Five stories. No shared truth. The number you take
                to the board is the average of guesses.
              </div>
            </div>

            {/* RIGHT — On Fosbury: crisp shared truth */}
            <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-accent)]/30 bg-[color:var(--color-card)] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_48px_-28px_rgba(234,90,30,0.35)]">
              <span className="grain-paper" aria-hidden style={{ opacity: 0.28 }} />
              <div className="mb-6 flex items-center justify-between">
                <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
                  On Fosbury · this week
                </div>
                <div className="rounded-full bg-[color:var(--color-accent-tint)] px-2.5 py-0.5 text-[10.5px] font-medium text-[color:var(--color-accent)]">
                  defensible
                </div>
              </div>

              <div className="h-[260px] space-y-3">
                {[
                  { tag: "AT RISK",   tagColor: "var(--color-risk)",   tagBg: "var(--color-risk-tint)",   account: "Northwind Labs", metric: "$480k", reason: "Champion left · usage −38% MoM" },
                  { tag: "EXPANDING", tagColor: "var(--color-grow)",   tagBg: "var(--color-grow-tint)",   account: "Globex Inc",     metric: "+$120k", reason: "3 power users added · pricing revisited" },
                  { tag: "SLIPPING",  tagColor: "var(--color-health)", tagBg: "var(--color-health-tint)", account: "Helix Co.",      metric: "$210k", reason: "Legal silent 8d · no reply" },
                ].map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-bg)]/40 px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="rounded-full px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.14em]"
                          style={{ color: r.tagColor, background: r.tagBg }}
                        >
                          {r.tag}
                        </span>
                        <span className="text-[13.5px] font-semibold tracking-tight text-[color:var(--color-ink)]">
                          {r.account}
                        </span>
                      </div>
                      <div className="mt-1 truncate text-[12px] tracking-tight text-[color:var(--color-muted)]">
                        {r.reason}
                      </div>
                    </div>
                    <div
                      className="shrink-0 font-[var(--font-mono)] text-[14px] font-semibold tabular-nums tracking-tight"
                      style={{ color: r.tagColor }}
                    >
                      {r.metric}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-dashed border-[color:var(--color-accent)]/20 pt-5 text-[13px] leading-[1.5] text-[color:var(--color-ink-soft)]">
                Three accounts. <span className="font-semibold text-[color:var(--color-ink)]">$810k</span> in motion.
                Every line traceable to a real signal. The number you take to
                the board has evidence behind it.
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-20 w-full max-w-[960px]">
          <div className="flex flex-col items-start justify-between gap-6 border-t border-[color:var(--color-line)] pt-10 md:flex-row md:items-center">
            <div>
              <div className="text-[22px] font-medium tracking-tight">
                See your pipeline the way it actually is.
              </div>
            </div>
            <PrimaryCTA />
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-3 text-[12px] tracking-tight text-[color:var(--color-muted)]">
            <div className="flex items-center gap-2.5">
              <FosburyMark size={20} />
              <span className="text-[color:var(--color-ink)]">Fosbury</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
