"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import {
  AUTOPILOT_SECTION,
  BRAND,
  CHANNELS,
  CREATIVES,
  EARLY_ACCESS,
  FOOTER_LINE,
  FREE_SECTION,
  HERO,
  POSITIONING,
  STEPS,
} from "@/lib/content"
import { useAllocation } from "@/lib/use-allocation"
import { useEarlyAccess } from "@/lib/submit"
import { LiveNumber } from "@/components/shared/primitives"
import { LogoMark } from "@/components/logo"

const bounce = { type: "spring" as const, stiffness: 400, damping: 14 }

function Pop({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -1% 0px" }}
      transition={{ ...bounce, delay }}
    >
      {children}
    </motion.div>
  )
}

const STICKER =
  "rounded-[2rem] border-[3px] border-black shadow-[6px_6px_0_0_#000]"

export default function Landing() {
  const [url, setUrl] = useState("")
  return (
    <div className="min-h-screen overflow-hidden bg-[#fff4d6] font-sans text-black selection:bg-black selection:text-[#fff4d6]">
      <header className="sticky top-0 z-40 bg-[#fff4d6]/90 px-5 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <LogoMark className="h-8 w-8" />
            <span className="text-xl font-black tracking-tight">{BRAND}</span>
          </a>
          <a
            href="/login"
            className={`bg-[#ff3d8b] px-4 py-2 text-sm font-black text-white ${STICKER} transition-transform hover:-translate-y-0.5`}
          >
            Login
          </a>
        </div>
      </header>

      <section className="relative mx-auto max-w-6xl px-5 pt-12 pb-10">
        <motion.div
          aria-hidden
          className="absolute -right-10 top-10 -z-0 h-40 w-40 rounded-full bg-[#7c3aed]"
          animate={{ y: [0, -18, 0], rotate: [0, 12, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          aria-hidden
          className="absolute left-1/3 top-44 -z-0 h-24 w-24 rounded-3xl bg-[#22d3a7]"
          animate={{ y: [0, 16, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Pop>
              <span className={`inline-block bg-[#ffe14d] px-3 py-1 text-xs font-black uppercase ${STICKER}`}>
                ✦ ads on autopilot
              </span>
            </Pop>
            <Pop delay={0.05}>
              <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
                Put{" "}
                <span className="bg-gradient-to-r from-[#ff3d8b] to-[#ff8a00] bg-clip-text text-transparent">$300</span>{" "}
                into ads. Watch it find what{" "}
                <span className="bg-gradient-to-r from-[#7c3aed] to-[#22d3a7] bg-clip-text text-transparent">works.</span>
              </h1>
            </Pop>
            <Pop delay={0.1}>
              <p className="mt-5 max-w-lg text-lg font-semibold leading-relaxed text-black/80">{HERO.sub}</p>
            </Pop>
            <Pop delay={0.15}>
              <form onSubmit={(e) => e.preventDefault()} className="mt-7 flex max-w-md flex-col gap-3 sm:flex-row">
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={HERO.urlPlaceholder}
                  className={`flex-1 bg-white px-4 py-3 text-sm font-bold outline-none ${STICKER} placeholder:text-black/40`}
                />
                <motion.button
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-[#7c3aed] px-6 py-3 text-sm font-black text-white ${STICKER}`}
                >
                  {HERO.cta} →
                </motion.button>
              </form>
            </Pop>
            <Pop delay={0.2}>
              <p className="mt-3 text-xs font-bold text-black/60">{HERO.reassurance}</p>
            </Pop>
          </div>
          <Pop delay={0.1}>
            <Console />
          </Pop>
        </div>
      </section>

      <section className="px-5 py-12">
        <Pop>
          <div className={`mx-auto max-w-4xl bg-[#7c3aed] px-8 py-10 text-white ${STICKER}`}>
            <p className="text-balance text-center text-xl font-black leading-snug md:text-3xl">{POSITIONING}</p>
          </div>
        </Pop>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <Pop>
          <span className={`inline-block bg-[#22d3a7] px-3 py-1 text-xs font-black uppercase ${STICKER}`}>
            {FREE_SECTION.kicker}
          </span>
        </Pop>
        <Pop delay={0.05}>
          <h2 className="mt-4 max-w-2xl text-4xl font-black leading-[0.95] tracking-tight md:text-5xl">
            {FREE_SECTION.title}
          </h2>
        </Pop>
        <Pop delay={0.1}>
          <p className="mt-4 max-w-2xl text-lg font-semibold leading-relaxed text-black/80">{FREE_SECTION.body}</p>
        </Pop>
        <Pop delay={0.15}>
          <div className={`mt-8 max-w-xl bg-white p-6 ${STICKER}`}>
            <div className="flex items-center justify-between text-xs font-black uppercase">
              <span>{FREE_SECTION.samplePost.platform}</span>
              <span className="rounded-full bg-[#ffe14d] px-2 py-0.5">54s</span>
            </div>
            <h3 className="mt-4 text-xl font-black leading-tight">{FREE_SECTION.samplePost.title}</h3>
            <p className="mt-2 font-semibold leading-relaxed text-black/70">{FREE_SECTION.samplePost.body}</p>
          </div>
        </Pop>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <Pop>
          <span className={`inline-block bg-[#ff3d8b] px-3 py-1 text-xs font-black uppercase text-white ${STICKER}`}>
            {AUTOPILOT_SECTION.kicker}
          </span>
        </Pop>
        <Pop delay={0.05}>
          <h2 className="mt-4 max-w-2xl text-4xl font-black leading-[0.95] tracking-tight md:text-5xl">
            {AUTOPILOT_SECTION.title}
          </h2>
        </Pop>
        <div className="mt-6 flex flex-wrap gap-3">
          {CHANNELS.map(({ key, label }, i) => (
            <motion.span
              key={key}
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...bounce, delay: i * 0.05 }}
              className={`bg-white px-4 py-2 text-sm font-black ${STICKER}`}
            >
              {label}
            </motion.span>
          ))}
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => {
            const colors = ["#ffe14d", "#22d3a7", "#ff8a00"]
            return (
              <Pop key={s.n} delay={i * 0.08}>
                <div className={`h-full p-6 ${STICKER}`} style={{ background: colors[i] }}>
                  <span className="text-5xl font-black">{s.n}</span>
                  <h3 className="mt-2 text-xl font-black leading-tight">{s.title}</h3>
                  <p className="mt-2 font-semibold leading-relaxed text-black/75">{s.body}</p>
                </div>
              </Pop>
            )
          })}
        </div>

        <Pop delay={0.05}>
          <p className="mt-12 text-sm font-black uppercase">✂ same offer · 4 formats · losers cut</p>
        </Pop>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CREATIVES.map((c, i) => {
            const scaling = c.status === "scaling"
            const bg = ["#ff3d8b", "#7c3aed"][i] ?? "#fff"
            return (
              <Pop key={i} delay={i * 0.06}>
                <motion.div
                  whileHover={{ rotate: scaling ? -3 : 0, scale: 1.03 }}
                  transition={bounce}
                  className={`flex h-52 flex-col justify-between p-5 ${STICKER} ${scaling ? "text-white" : "bg-neutral-200 text-black/50 grayscale"}`}
                  style={scaling ? { background: bg } : undefined}
                >
                  <div className="flex items-center justify-between text-[11px] font-black uppercase">
                    <span>{c.format}</span>
                    <span>{scaling ? "SCALING ▲" : "CUT ✕"}</span>
                  </div>
                  <p className="text-lg font-black leading-tight">{c.headline}</p>
                  <span className="text-sm font-black">{c.metric}</span>
                </motion.div>
              </Pop>
            )
          })}
        </div>
      </section>

      <EarlyAccess url={url} />

      <footer className="px-5 py-8">
        <p className="mx-auto max-w-6xl text-center text-sm font-black">{FOOTER_LINE}</p>
      </footer>
    </div>
  )
}

function Console() {
  const { pct, dollars, paused, signups } = useAllocation()
  return (
    <div className={`bg-white p-5 ${STICKER}`}>
      <div className="flex items-center justify-between border-b-[3px] border-black pb-3">
        <span className="text-sm font-black uppercase">budget console</span>
        <span className="rounded-full bg-[#ffe14d] px-2 py-0.5 text-xs font-black">$300/mo</span>
      </div>
      <div className="space-y-3 py-4">
        {CHANNELS.map(({ key, label }) => {
          const isPaused = paused[key]
          return (
            <div key={key} className="flex items-center gap-3">
              <span className={`w-16 shrink-0 text-xs font-black ${isPaused ? "text-black/30" : ""}`}>{label}</span>
              <div className="relative h-4 flex-1 overflow-hidden rounded-full border-2 border-black bg-white">
                <motion.div
                  className="absolute inset-y-0 left-0"
                  style={{ background: isPaused ? "#cbd5e1" : "linear-gradient(90deg,#ff3d8b,#ff8a00)" }}
                  animate={{ width: `${Math.max(pct[key] * 100, 3)}%` }}
                  transition={bounce}
                />
              </div>
              <span className={`w-14 shrink-0 text-right text-xs font-black ${isPaused ? "text-black/30 line-through" : ""}`}>
                {isPaused ? "paused" : <LiveNumber value={dollars[key]} prefix="$" />}
              </span>
            </div>
          )
        })}
      </div>
      <div className="flex items-center justify-between rounded-2xl bg-[#22d3a7] px-4 py-3 text-black">
        <span className="text-xs font-black uppercase">signups this week</span>
        <LiveNumber value={signups} className="text-3xl font-black tabular-nums" />
      </div>
    </div>
  )
}

function EarlyAccess({ url }: { url: string }) {
  const { email, setEmail, status, submit } = useEarlyAccess(() => url)
  return (
    <section id="early-access" className="px-5 py-16">
      <Pop>
        <div className={`mx-auto max-w-3xl bg-[#ffe14d] px-6 py-12 text-center ${STICKER}`}>
          <span className="text-xs font-black uppercase">{EARLY_ACCESS.kicker}</span>
          <h2 className="mt-3 text-4xl font-black leading-[0.95] tracking-tight md:text-5xl">{EARLY_ACCESS.title}</h2>
          <p className="mx-auto mt-4 max-w-md text-lg font-semibold leading-relaxed text-black/80">{EARLY_ACCESS.body}</p>
          {status === "done" ? (
            <motion.p
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={bounce}
              className={`mx-auto mt-7 max-w-md bg-white px-5 py-4 text-sm font-bold ${STICKER}`}
            >
              {EARLY_ACCESS.success}
            </motion.p>
          ) : (
            <form onSubmit={submit} className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={EARLY_ACCESS.placeholder}
                className={`flex-1 bg-white px-4 py-3 text-sm font-bold outline-none ${STICKER} placeholder:text-black/40`}
              />
              <motion.button
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                disabled={status === "loading"}
                className={`bg-[#7c3aed] px-6 py-3 text-sm font-black text-white ${STICKER} disabled:opacity-60`}
              >
                {status === "loading" ? "…" : EARLY_ACCESS.cta}
              </motion.button>
            </form>
          )}
        </div>
      </Pop>
    </section>
  )
}
