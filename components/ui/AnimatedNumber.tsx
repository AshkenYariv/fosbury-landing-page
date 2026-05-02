"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useMotionValue, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

type Props = {
  value: number;
  /** number of decimals to render */
  decimals?: number;
  /** characters before the number (e.g. "$") */
  prefix?: string;
  /** characters after the number (e.g. " days", "%", "M") */
  suffix?: string;
  /** override duration in seconds */
  duration?: number;
  className?: string;
};

export function AnimatedNumber({
  value,
  decimals = 0,
  prefix,
  suffix,
  duration = 1.4,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value.toFixed(decimals));
      return;
    }
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.16, 0.84, 0.44, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, value, decimals, duration, motionValue, reduced]);

  return (
    <span ref={ref} className={cn("tabular", className)}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
