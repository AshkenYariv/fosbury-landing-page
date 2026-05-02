"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MonoNumeral } from "@/components/ui/MonoNumeral";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { fadeUp, reducedMotionVariants, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

const tasks = [
  { label: "Bank reconciliation — Q4", done: true },
  { label: "Inventory variance — DC East", done: true },
  { label: "Three-way match — CM02", done: true },
  { label: "Revenue recognition — Shopify", done: true },
  { label: "Landed cost allocation", done: true },
  { label: "Intercompany eliminations", done: false },
  { label: "Flux analysis — gross margin", done: false },
];

const margins = [
  { sku: "SKU-1184", name: "Hydrating Serum 30ml", margin: 64.2, delta: +1.8 },
  { sku: "SKU-2207", name: "Refill Cartridge 4-pack", margin: 58.7, delta: +0.4 },
  { sku: "SKU-3340", name: "Travel Set", margin: 42.1, delta: -3.2, anomaly: true },
];

export function CloseCockpit() {
  const reduced = useReducedMotion();

  return (
    <GlassPanel className="w-full max-w-5xl">
      <header className="flex items-center justify-between border-b border-border/80 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-positive" />
          <span className="font-mono text-[11px] uppercase tracking-eyebrow text-muted">
            Close Cockpit · December
          </span>
        </div>
        <span className="font-mono text-[11px] tabular text-muted">
          <span className="text-positive">●</span> live
        </span>
      </header>

      <div className="grid grid-cols-1 gap-px bg-border/60 sm:grid-cols-[1fr_1.4fr_1fr]">
        {/* Left rail — close tasks */}
        <div className="bg-surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[12px] font-medium text-primary">
              Close tasks
            </span>
            <MonoNumeral className="text-[11px] text-muted">
              <AnimatedNumber value={94} suffix="%" />
            </MonoNumeral>
          </div>
          <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-border/60">
            <motion.div
              className="h-full rounded-full bg-accent"
              initial={{ width: 0 }}
              whileInView={{ width: reduced ? "94%" : "94%" }}
              viewport={viewportOnce}
              transition={{ duration: 1.2, ease: [0.22, 0.61, 0.36, 1], delay: 0.2 }}
            />
          </div>
          <motion.ul
            className="space-y-2"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={reduced ? reducedMotionVariants : stagger(0.06, 0.4)}
          >
            {tasks.map((t, i) => (
              <motion.li
                key={t.label}
                className="flex items-center gap-2 text-[12px]"
                variants={reduced ? reducedMotionVariants : fadeUp}
              >
                <span
                  aria-hidden
                  className={cn(
                    "inline-flex h-3.5 w-3.5 flex-none items-center justify-center rounded-full ring-1",
                    t.done
                      ? "bg-accent/15 text-accent ring-accent/30"
                      : "bg-bg-subtle text-faint ring-border",
                  )}
                >
                  {t.done && (
                    <svg viewBox="0 0 12 12" width="9" height="9">
                      <path
                        d="M2 6.5L4.8 9 10 3.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span
                  className={cn(
                    "truncate",
                    t.done ? "text-muted line-through decoration-faint/60" : "text-primary",
                  )}
                >
                  {t.label}
                </span>
                <MonoNumeral className="ml-auto text-[10px] text-faint">
                  {String(i + 1).padStart(2, "0")}
                </MonoNumeral>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Center — gross margin */}
        <div className="bg-surface p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-eyebrow text-muted">
                Gross margin · today
              </p>
              <p className="mt-1 flex items-baseline gap-2 text-[28px] font-medium tracking-tight">
                <AnimatedNumber value={56.4} decimals={1} suffix="%" />
                <span className="font-mono text-[11px] tabular text-positive">
                  +1.2 vs 7d
                </span>
              </p>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-eyebrow text-faint">
              Dec 14
            </div>
          </div>

          <Sparkline />

          <ul className="mt-4 space-y-1.5">
            {margins.map((m) => (
              <li
                key={m.sku}
                className={cn(
                  "flex items-center justify-between rounded-md px-2.5 py-1.5 text-[12px] ring-1",
                  m.anomaly
                    ? "bg-anomaly-subtle/60 ring-anomaly/30"
                    : "ring-transparent hover:bg-bg-subtle/60",
                )}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <MonoNumeral className="text-[10px] text-faint">{m.sku}</MonoNumeral>
                  <span className="truncate text-primary">{m.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {m.anomaly && (
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-anomaly" />
                  )}
                  <MonoNumeral className="text-primary">
                    {m.margin.toFixed(1)}%
                  </MonoNumeral>
                  <MonoNumeral
                    className={cn(
                      "w-12 text-right text-[11px]",
                      m.delta < 0 ? "text-anomaly" : "text-positive",
                    )}
                  >
                    {m.delta > 0 ? "+" : ""}
                    {m.delta.toFixed(1)}
                  </MonoNumeral>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right rail — agent suggestion */}
        <div className="bg-surface p-4">
          <p className="mb-3 text-[12px] font-medium text-primary">
            Agent suggestion
          </p>
          <div className="rounded-lg ring-1 ring-border bg-bg-subtle/80 p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-[10px] font-mono text-accent ring-1 ring-accent/30">
                IR
              </span>
              <span className="text-[11px] text-primary">
                Inventory Reconciliation
              </span>
              <MonoNumeral className="ml-auto text-[10px] text-faint">
                14:02
              </MonoNumeral>
            </div>
            <p className="text-[12px] leading-relaxed text-muted">
              Variance of <MonoNumeral className="text-primary">$3,184.20</MonoNumeral> on
              SKU-3340 traced to a partial CM shipment. Suggested entry:
            </p>
            <div className="mt-2 rounded-md bg-surface px-2.5 py-2 ring-1 ring-border font-mono text-[11px] tabular">
              <div className="flex justify-between text-muted">
                <span>Dr · Inventory · DC-East</span>
                <span className="text-primary">3,184.20</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Cr · COGS · Q4 close</span>
                <span className="text-primary">3,184.20</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                className="rounded-md bg-accent px-2.5 py-1 text-[11px] font-medium text-accent-fg"
              >
                Approve
              </button>
              <button
                type="button"
                className="rounded-md px-2.5 py-1 text-[11px] text-muted ring-1 ring-inset ring-border hover:bg-primary/5"
              >
                Edit
              </button>
              <span className="ml-auto font-mono text-[10px] text-faint">
                3 pending
              </span>
            </div>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

function Sparkline() {
  const points =
    "0,28 12,26 24,30 36,22 48,24 60,18 72,20 84,14 96,16 108,12 120,14 132,9 144,11 156,7";
  return (
    <svg
      viewBox="0 0 156 36"
      className="h-12 w-full text-accent"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cockpit-spark" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 1.2, ease: [0.22, 0.61, 0.36, 1], delay: 0.3 }}
      />
      <polyline
        points={`0,36 ${points} 156,36`}
        fill="url(#cockpit-spark)"
        stroke="none"
      />
    </svg>
  );
}
