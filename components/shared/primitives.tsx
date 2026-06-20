"use client"

import { animate, motion, useInView, useMotionValue, useReducedMotion } from "framer-motion"
import { useEffect, useRef, useState, type ReactNode } from "react"

/** Animated number count-up that fires when scrolled into view. */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  className,
  duration = 1.1,
}: {
  value: number
  prefix?: string
  suffix?: string
  className?: string
  duration?: number
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px" })
  const [display, setDisplay] = useState(reduced ? value : 0)

  useEffect(() => {
    if (reduced) {
      setDisplay(value)
      return
    }
    if (!inView) return
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value, duration, reduced])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  )
}

/** Live number that follows a changing value smoothly (for the console). */
export function LiveNumber({
  value,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number
  prefix?: string
  suffix?: string
  className?: string
}) {
  const mv = useMotionValue(value)
  const [display, setDisplay] = useState(value)
  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 0.4,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [value, mv])
  return (
    <span className={className}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  )
}

/** Scroll-triggered staggered reveal. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  once?: boolean
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -1% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
