"use client"

import { useEffect, useRef, useState } from "react"
import { CHANNELS, type ChannelKey } from "./content"

const TOTAL_BUDGET = 300

// Where the budget ends up once the autopilot has found the winners.
const TARGET: Record<ChannelKey, number> = {
  google: 0.34,
  tiktok: 0.4,
  meta: 0.18,
  reddit: 0.05,
  instagram: 0.03,
}

const EVEN = 1 / CHANNELS.length

export type AllocationState = {
  pct: Record<ChannelKey, number> // 0..1
  dollars: Record<ChannelKey, number>
  paused: Record<ChannelKey, boolean>
  signups: number
  phase: number // 0..1 progress through the current find-the-winners cycle
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const on = () => setReduced(mq.matches)
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])
  return reduced
}

/**
 * Drives the "live allocation console".
 * Budget flows from an even split toward the winners on a gentle loop;
 * losers dim to "paused", a signups counter ticks up.
 */
export function useAllocation(): AllocationState {
  const reduced = usePrefersReducedMotion()
  const [t, setT] = useState(reduced ? 1 : 0)
  const raf = useRef<number | null>(null)
  const start = useRef<number | null>(null)

  const CYCLE = 7000 // ms to find the winners
  const HOLD = 2600 // ms to admire the result before resetting

  useEffect(() => {
    if (reduced) {
      setT(1)
      return
    }
    const loop = (now: number) => {
      if (start.current === null) start.current = now
      const elapsed = (now - start.current) % (CYCLE + HOLD)
      const next = elapsed < CYCLE ? easeInOut(elapsed / CYCLE) : 1
      setT(next)
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
      start.current = null
    }
  }, [reduced])

  const pct = {} as Record<ChannelKey, number>
  const dollars = {} as Record<ChannelKey, number>
  const paused = {} as Record<ChannelKey, boolean>

  for (const { key } of CHANNELS) {
    const v = EVEN + (TARGET[key] - EVEN) * t
    pct[key] = v
    dollars[key] = Math.round(v * TOTAL_BUDGET)
    paused[key] = t > 0.55 && TARGET[key] < EVEN * 0.6
  }

  const signups = Math.round((12 + t * 119) * (0.6 + 0.4))

  return { pct, dollars, paused, signups, phase: t }
}

export { TOTAL_BUDGET }
