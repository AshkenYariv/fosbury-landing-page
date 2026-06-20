"use client"

import { motion } from "framer-motion"
import {
  AUTOPILOT_SECTION,
  CHANNELS,
  CREATIVES,
  FREE_SECTION,
  POSITIONING,
  STEPS,
  SURFACES,
} from "@/lib/content"
import { useAllocation } from "@/lib/use-allocation"
import { LiveNumber } from "@/components/shared/primitives"
import { ChannelIcon } from "@/components/channel-icons"

// ─────────────────────────────────────────────────────────────────────────────
// Shared sticker-design building blocks, used by both the default and the
// focused landing pages so the two stay in sync.
// ─────────────────────────────────────────────────────────────────────────────

export const bounce = { type: "spring" as const, stiffness: 400, damping: 14 }
export const STICKER = "rounded-[2rem] border-[3px] border-black shadow-[6px_6px_0_0_#000]"

export function Pop({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
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

/** Live "budget console" — budget flows toward the winning channels. */
export function Console() {
  const { pct, dollars, paused, signups } = useAllocation()
  return (
    <div className={`bg-white p-5 ${STICKER}`}>
      <div className="flex items-center justify-between border-b-[3px] border-black pb-3">
        <span className="text-sm font-black uppercase">budget console</span>
        <span className="rounded-full bg-[#ffe14d] px-2 py-0.5 text-xs font-black">live</span>
      </div>
      <div className="space-y-3 py-4">
        {CHANNELS.map(({ key, label }) => {
          const isPaused = paused[key]
          return (
            <div key={key} className="flex items-center gap-3">
              <span className={`flex w-[5.5rem] shrink-0 items-center gap-1.5 text-xs font-black ${isPaused ? "text-black/30" : ""}`}>
                <ChannelIcon channel={key} className={`h-3.5 w-3.5 ${isPaused ? "opacity-40 grayscale" : ""}`} />
                {label}
              </span>
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

export function PositioningSection() {
  return (
    <section className="px-5 py-12">
      <Pop>
        <div className={`mx-auto max-w-4xl bg-[#7c3aed] px-8 py-10 text-white ${STICKER}`}>
          <p className="text-balance text-center text-xl font-black leading-snug md:text-3xl">{POSITIONING}</p>
        </div>
      </Pop>
    </section>
  )
}

export function FreeSection() {
  return (
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
  )
}

export function AutopilotSection() {
  return (
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
        {SURFACES.map(({ key, label }, i) => (
          <motion.span
            key={key}
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ...bounce, delay: i * 0.05 }}
            className={`inline-flex items-center gap-2 bg-white px-4 py-2 text-sm font-black ${STICKER}`}
          >
            <ChannelIcon channel={key} className="h-4 w-4" />
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
  )
}

