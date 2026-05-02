"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MonoNumeral } from "@/components/ui/MonoNumeral";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/primitives/Reveal";
import { IntegrationTile, type Phase, type Source } from "@/components/demo/IntegrationTile";
import { cn } from "@/lib/cn";

const sources: Source[] = [
  { id: "shopify",     label: "Shopify",      category: "Channel" },
  { id: "amazon",      label: "Amazon",       category: "Channel" },
  { id: "stripe",      label: "Stripe",       category: "Payments" },
  { id: "threepl",     label: "ShipBob (3PL)", category: "Fulfillment" },
  { id: "contractmfr", label: "Contract Mfr", category: "Supply" },
  { id: "netsuite",    label: "NetSuite",     category: "ERP", replaced: true },
];

// Positions in the SVG viewBox (1000 × 480) — used for both desktop tile placement and curve geometry.
const cx = 500;
const cy = 240;
const positions: Record<string, { x: number; y: number }> = {
  shopify:     { x: 130, y: 90 },
  amazon:      { x: 870, y: 90 },
  stripe:      { x: 90,  y: 240 },
  threepl:     { x: 910, y: 240 },
  contractmfr: { x: 130, y: 390 },
  netsuite:    { x: 870, y: 390 },
};

function bezierTo(x: number, y: number) {
  const dx = (cx - x) * 0.55;
  return `M ${x} ${y} C ${x + dx} ${y}, ${cx - dx * 0.6} ${y * 0.45 + cy * 0.55}, ${cx} ${cy}`;
}

export function ConnectScene({ onReady }: { onReady: () => void }) {
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(sources.map((s) => s.id)),
  );
  const [phase, setPhase] = useState<Phase>("idle");

  // Order in which selected sources animate from connecting → connected.
  const connectOrder = useMemo(
    () => sources.filter((s) => selected.has(s.id)).map((s) => s.id),
    [selected],
  );

  useEffect(() => {
    if (phase !== "connecting") return;
    const total = reduced ? 200 : 1200 + connectOrder.length * 100;
    const t = window.setTimeout(() => setPhase("connected"), total);
    return () => window.clearTimeout(t);
  }, [phase, reduced, connectOrder.length]);

  useEffect(() => {
    if (phase === "connected") onReady();
  }, [phase, onReady]);

  const toggle = (id: string) => {
    if (phase !== "idle") return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const startConnect = () => {
    if (selected.size === 0) return;
    setPhase("connecting");
  };

  const selectedCount = selected.size;
  const connectedCount = phase === "connected" ? selectedCount : 0;

  return (
    <section>
      <Reveal as="header" className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted">
          Step 1 · Connect
        </p>
        <h1 className="mt-4 text-display-md font-medium tracking-tight text-primary">
          Point Fosbury at your stack.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-balance text-[15px] leading-relaxed text-muted">
          Toggle the sources you actually use. Read-only — nothing leaves your account.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 sm:mt-12">
        <GlassPanel className="relative overflow-hidden p-4 sm:p-6">
          {/* Mobile / small layout: stacked grid + center node below */}
          <div className="block sm:hidden">
            <div className="grid grid-cols-2 gap-2.5">
              {sources.map((s) => (
                <IntegrationTile
                  key={s.id}
                  source={s}
                  selected={selected.has(s.id)}
                  phase={phase}
                  connectIndex={connectOrder.indexOf(s.id)}
                  onToggle={() => toggle(s.id)}
                />
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <FosburyNode phase={phase} />
            </div>
          </div>

          {/* Desktop: tiles arranged around a central Fosbury node with SVG flow lines */}
          <div className="relative hidden aspect-[1000/480] w-full sm:block">
            <FlowLines
              activeIds={phase === "idle" ? [] : connectOrder}
              phase={phase}
              reduced={!!reduced}
            />

            {sources.map((s) => {
              const p = positions[s.id];
              return (
                <div
                  key={s.id}
                  className="absolute w-[200px]"
                  style={{
                    left: `${(p.x / 1000) * 100}%`,
                    top: `${(p.y / 480) * 100}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <IntegrationTile
                    source={s}
                    selected={selected.has(s.id)}
                    phase={phase}
                    connectIndex={connectOrder.indexOf(s.id)}
                    onToggle={() => toggle(s.id)}
                  />
                </div>
              );
            })}

            <div
              className="absolute"
              style={{
                left: `${(cx / 1000) * 100}%`,
                top: `${(cy / 480) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <FosburyNode phase={phase} />
            </div>
          </div>
        </GlassPanel>
      </Reveal>

      <div className="mt-8 flex flex-col items-center gap-4">
        {phase === "idle" && (
          <Button
            variant="primary"
            size="lg"
            onClick={startConnect}
            disabled={selectedCount === 0}
          >
            Connect {selectedCount} {selectedCount === 1 ? "source" : "sources"}
          </Button>
        )}
        {phase === "connecting" && (
          <span className="inline-flex items-center gap-2 font-mono text-[12px] text-muted">
            <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Indexing transactions, mapping COGS lots, building the perpetual ledger…
          </span>
        )}
        {phase === "connected" && <ConnectedSummary count={connectedCount} />}
      </div>
    </section>
  );
}

function FosburyNode({ phase }: { phase: Phase }) {
  const live = phase === "connected";
  return (
    <div className="relative">
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 scale-110 rounded-2xl bg-accent/20 blur-2xl transition-opacity",
          live ? "opacity-100" : "opacity-30",
        )}
      />
      <div
        className={cn(
          "rounded-2xl bg-surface px-5 py-4 text-center ring-1 transition-colors",
          "shadow-glass-light dark:shadow-glass",
          live ? "ring-accent/40" : "ring-border",
        )}
      >
        <p className="font-mono text-[10px] uppercase tracking-eyebrow text-accent">
          Fosbury
        </p>
        <p className="mt-1 text-[13px] font-medium text-primary">
          Perpetual ledger · agents
        </p>
        <div className="mt-2 flex items-center justify-center gap-1.5">
          <span
            className={cn(
              "inline-flex h-1 w-1 rounded-full",
              live ? "bg-positive" : "bg-faint",
            )}
          />
          <MonoNumeral className="text-[10px] text-muted">
            {live ? "live · one source of truth" : "awaiting sources"}
          </MonoNumeral>
        </div>
      </div>
    </div>
  );
}

function FlowLines({
  activeIds,
  phase,
  reduced,
}: {
  activeIds: string[];
  phase: Phase;
  reduced: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1000 480"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <filter id="connect-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {activeIds.map((id, i) => {
        const p = positions[id];
        if (!p) return null;
        const d = bezierTo(p.x, p.y);
        const delay = reduced ? 0 : i * 0.1;
        const duration = reduced ? 0.2 : 1;
        return (
          <g key={id}>
            <motion.path
              d={d}
              stroke="rgb(var(--accent))"
              strokeOpacity="0.35"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              filter="url(#connect-glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration, delay, ease: [0.22, 0.61, 0.36, 1] }}
            />
            <motion.path
              d={d}
              stroke="rgb(var(--accent))"
              strokeOpacity="0.85"
              strokeWidth="1.25"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration, delay, ease: [0.22, 0.61, 0.36, 1] }}
            />
            {phase === "connected" && !reduced && (
              <motion.circle
                cx={(p.x + cx) / 2}
                cy={(p.y + cy) / 2 - 24}
                r="2.5"
                fill="rgb(var(--accent))"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: 2.4,
                  delay: 0.3 + i * 0.18,
                  repeat: Infinity,
                  repeatDelay: 1.6,
                  ease: "easeInOut",
                }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function ConnectedSummary({ count }: { count: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
      className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-muted"
    >
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-positive" />
        <MonoNumeral className="text-primary">
          <AnimatedNumber value={412938} />
        </MonoNumeral>
        <span className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">
          transactions
        </span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <MonoNumeral className="text-primary">
          <AnimatedNumber value={18} />
        </MonoNumeral>
        <span className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">
          months indexed
        </span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <MonoNumeral className="text-primary">{count}</MonoNumeral>
        <span className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">
          sources connected
        </span>
      </span>
    </motion.div>
  );
}
