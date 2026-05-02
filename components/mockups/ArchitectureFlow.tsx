"use client";

import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MonoNumeral } from "@/components/ui/MonoNumeral";
import { viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Layout: 3-column CSS grid of source nodes flowing into a centered Fosbury node,
 * with a NetSuite "replaced" tile rendered with strikethrough on the side.
 * SVG overlay (absolute, sized to the container) draws Bezier paths between
 * node centers — `pathLength` 0→1 on inView, with a wide blurred copy underneath
 * for the soft glow.
 */

const sources = [
  { label: "Shopify", category: "Channel" },
  { label: "Amazon", category: "Channel" },
  { label: "Stripe", category: "Payments" },
  { label: "Ramp", category: "Spend" },
  { label: "3PL", category: "Fulfillment" },
  { label: "Contract Mfr", category: "Supply" },
];

// Connection paths in viewBox coords (1000 wide × 480 tall).
// Sources sit in two columns (left + right), 3 rows. Fosbury sits centered.
const cx = 500;
const cy = 360;
const sourcePositions = [
  { x: 110, y: 80 },   // top-left  — Shopify
  { x: 890, y: 80 },   // top-right — Amazon
  { x: 80,  y: 200 },  // mid-left  — Stripe
  { x: 920, y: 200 },  // mid-right — Ramp
  { x: 130, y: 320 },  // low-left  — 3PL
  { x: 870, y: 320 },  // low-right — Contract Mfr
];

function bezierTo(x: number, y: number) {
  const dx = (cx - x) * 0.55;
  return `M ${x} ${y} C ${x + dx} ${y}, ${cx - dx * 0.6} ${cy - 60}, ${cx} ${cy - 14}`;
}

export function ArchitectureFlow() {
  return (
    <GlassPanel className="relative w-full p-6 sm:p-8">
      <header className="mb-6 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-eyebrow text-muted">
          The substrate beneath your stack
        </span>
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-faint">
          one ledger
        </span>
      </header>

      <div className="relative aspect-[1000/480] w-full">
        {/* SVG overlay — draws connection lines */}
        <svg
          viewBox="0 0 1000 480"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <filter id="arch-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          {/* Glow layer */}
          <g
            stroke="rgb(var(--accent))"
            strokeOpacity="0.35"
            strokeWidth="6"
            fill="none"
            filter="url(#arch-glow)"
          >
            {sourcePositions.map((p, i) => (
              <motion.path
                key={`glow-${i}`}
                d={bezierTo(p.x, p.y)}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={viewportOnce}
                transition={{
                  duration: 1.4,
                  ease: [0.22, 0.61, 0.36, 1],
                  delay: 0.15 + i * 0.06,
                }}
              />
            ))}
          </g>

          {/* Crisp lines */}
          <g
            stroke="rgb(var(--accent))"
            strokeOpacity="0.85"
            strokeWidth="1.25"
            fill="none"
          >
            {sourcePositions.map((p, i) => (
              <motion.path
                key={`line-${i}`}
                d={bezierTo(p.x, p.y)}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={viewportOnce}
                transition={{
                  duration: 1.2,
                  ease: [0.22, 0.61, 0.36, 1],
                  delay: 0.2 + i * 0.06,
                }}
              />
            ))}
          </g>

          {/* Pulsing dots traveling along the lines (stationary at midpoint for simplicity) */}
          {sourcePositions.map((p, i) => {
            const midX = (p.x + cx) / 2;
            const midY = (p.y + cy - 14) / 2 - 30;
            return (
              <motion.circle
                key={`pulse-${i}`}
                cx={midX}
                cy={midY}
                r="2.5"
                fill="rgb(var(--accent))"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: [0, 1, 0] }}
                viewport={viewportOnce}
                transition={{
                  duration: 2.4,
                  delay: 1 + i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 1.6,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </svg>

        {/* HTML node tiles, absolutely positioned in % so they line up with svg coords */}
        {sources.map((s, i) => {
          const p = sourcePositions[i];
          return (
            <Node
              key={s.label}
              label={s.label}
              category={s.category}
              style={{
                left: `${(p.x / 1000) * 100}%`,
                top: `${(p.y / 480) * 100}%`,
              }}
            />
          );
        })}

        {/* NetSuite — replaced tile, in the corner */}
        <div
          className="absolute"
          style={{ left: "50%", top: "10%", transform: "translate(-50%, -50%)" }}
        >
          <div className="relative inline-flex items-center gap-2 rounded-full bg-bg-subtle px-3 py-1.5 ring-1 ring-border">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-faint line-through decoration-anomaly/70 decoration-[1.5px]">
              NetSuite
            </span>
            <span className="font-mono text-[9px] uppercase tracking-eyebrow text-anomaly">
              replaced
            </span>
          </div>
        </div>

        {/* Fosbury center node */}
        <div
          className="absolute"
          style={{ left: `${(cx / 1000) * 100}%`, top: `${(cy / 480) * 100}%`, transform: "translate(-50%, -50%)" }}
        >
          <div className="relative">
            <div className="absolute inset-0 -z-10 scale-110 rounded-2xl bg-accent/20 blur-2xl" aria-hidden />
            <div className="rounded-2xl bg-surface px-5 py-4 text-center ring-1 ring-accent/30 shadow-glass-light dark:shadow-glass">
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-accent">
                Fosbury
              </p>
              <p className="mt-1 text-[13px] font-medium text-primary">
                Perpetual ledger · agents
              </p>
              <div className="mt-2 flex items-center justify-center gap-1.5">
                <span className="inline-flex h-1 w-1 rounded-full bg-positive" />
                <MonoNumeral className="text-[10px] text-muted">
                  one source of truth
                </MonoNumeral>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

function Node({
  label,
  category,
  style,
}: {
  label: string;
  category: string;
  style: React.CSSProperties;
}) {
  return (
    <div
      className="absolute"
      style={{ ...style, transform: "translate(-50%, -50%)" }}
    >
      <div
        className={cn(
          "rounded-lg bg-surface px-3 py-2 ring-1 ring-border",
          "shadow-glass-light dark:shadow-glass",
        )}
      >
        <p className="text-[12px] font-medium text-primary">{label}</p>
        <p className="mt-0.5 font-mono text-[9px] uppercase tracking-eyebrow text-faint">
          {category}
        </p>
      </div>
    </div>
  );
}
