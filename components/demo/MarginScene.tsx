"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MonoNumeral } from "@/components/ui/MonoNumeral";
import { Reveal } from "@/components/primitives/Reveal";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type Row = {
  sku: string;
  name: string;
  channel: "DTC" | "Amazon" | "Wholesale";
  margin: number;
  delta: number;
  trend: number[];
  anomaly?: boolean;
};

const rows: Row[] = [
  { sku: "SKU-1184", name: "Hydrating Serum 30ml",  channel: "DTC",       margin: 64.2, delta:  +1.8, trend: [56, 58, 60, 61, 62, 63, 63, 64, 64, 64, 64, 64] },
  { sku: "SKU-1185", name: "Hydrating Serum 50ml",  channel: "DTC",       margin: 61.8, delta:  +0.9, trend: [55, 57, 58, 59, 60, 60, 61, 61, 61, 61, 61, 62] },
  { sku: "SKU-2207", name: "Refill Cartridge 4-pk", channel: "Amazon",    margin: 58.7, delta:  +0.4, trend: [57, 57, 58, 58, 58, 58, 58, 58, 58, 59, 59, 59] },
  { sku: "SKU-3340", name: "Travel Set",            channel: "DTC",       margin: 42.1, delta: -12.9, trend: [55, 54, 52, 50, 48, 47, 46, 45, 44, 43, 42, 42], anomaly: true },
  { sku: "SKU-4011", name: "Body Lotion 250ml",     channel: "Amazon",    margin: 38.9, delta:  -7.4, trend: [46, 45, 44, 43, 42, 41, 40, 40, 39, 39, 39, 39], anomaly: true },
  { sku: "SKU-5008", name: "Lip Treatment 10ml",    channel: "Amazon",    margin: 60.3, delta:  +2.1, trend: [56, 57, 58, 58, 59, 59, 60, 60, 60, 60, 60, 60] },
  { sku: "SKU-6101", name: "Gift Set · Holiday",    channel: "DTC",       margin: 53.2, delta:  +0.8, trend: [51, 51, 52, 52, 52, 53, 53, 53, 53, 53, 53, 53] },
];

export function MarginScene({ onReady }: { onReady: () => void }) {
  const [openSku, setOpenSku] = useState<string | null>(null);
  const [pricingApplied, setPricingApplied] = useState(false);

  useEffect(() => {
    if (openSku) onReady();
  }, [openSku, onReady]);

  const openRow = (sku: string) => {
    if (openSku === sku) return;
    trackEvent("demo_margin_drilldown_opened", { sku });
    setOpenSku(sku);
    setPricingApplied(false);
  };

  const applyPricing = () => {
    if (pricingApplied) return;
    trackEvent("demo_margin_pricing_applied", { sku: openSku ?? "" });
    setPricingApplied(true);
  };

  return (
    <section>
      <Reveal as="header" className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted">
          Tuesday · 7:14 AM
        </p>
        <h1 className="mt-4 text-display-md font-medium tracking-tight text-primary">
          The leak no one would have caught till month-end.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-balance text-[15px] leading-relaxed text-muted">
          Two SKUs are flagged this morning. Click a flagged row to drill in — same data
          model your books just closed on.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-4 lg:grid-cols-[7fr_5fr]">
        <Reveal delay={0.1}>
          <GlassPanel className="h-full">
            <header className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-mono text-[11px] uppercase tracking-eyebrow text-muted">
                SKU margin · last 30 days
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-eyebrow text-faint">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-anomaly" />
                2 anomalies
              </span>
            </header>
            <div className="px-4 py-3 text-[12px]">
              <div className={cn(rowGridCls, "mb-1.5")}>
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-faint">SKU</div>
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-faint">Name</div>
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-faint">Ch</div>
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-faint text-right">Trend</div>
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-faint text-right">Margin</div>
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-faint text-right">Δ 30d</div>
              </div>
              <div className="space-y-0.5">
                {rows.map((r, i) => (
                  <RowRender
                    key={r.sku}
                    row={r}
                    i={i}
                    active={openSku === r.sku}
                    onClick={r.anomaly ? () => openRow(r.sku) : undefined}
                  />
                ))}
              </div>
            </div>
          </GlassPanel>
        </Reveal>

        <Reveal delay={0.15}>
          <Drilldown
            sku={openSku}
            row={rows.find((r) => r.sku === openSku) ?? null}
            applied={pricingApplied}
            onApply={applyPricing}
          />
        </Reveal>
      </div>
    </section>
  );
}

// Shared 6-column template — applied to header and every data row so columns line up.
const rowGridCls =
  "grid grid-cols-[68px_minmax(0,1fr)_44px_88px_56px_56px] items-center gap-x-3";

function RowRender({
  row,
  i,
  active,
  onClick,
}: {
  row: Row;
  i: number;
  active: boolean;
  onClick?: () => void;
}) {
  const interactive = !!onClick;
  const handleKey = (e: React.KeyboardEvent) => {
    if (!interactive) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      className={cn(
        rowGridCls,
        "-mx-4 rounded-md px-4 py-1.5 transition-colors",
        row.anomaly && "bg-anomaly-subtle/40",
        active && "bg-accent/10 ring-1 ring-inset ring-accent/30",
        interactive && "cursor-pointer hover:bg-anomaly-subtle/70",
      )}
      onClick={onClick}
      onKeyDown={handleKey}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      <MonoNumeral
        className={cn(
          "text-[10px]",
          row.anomaly ? "text-anomaly" : "text-faint",
        )}
      >
        {row.sku}
      </MonoNumeral>
      <div className="flex min-w-0 items-center gap-2">
        {row.anomaly && (
          <span className="inline-flex h-1.5 w-1.5 flex-none rounded-full bg-anomaly" />
        )}
        <span className="truncate text-primary">{row.name}</span>
        {interactive && (
          <span className="ml-1 hidden flex-none font-mono text-[9px] uppercase tracking-eyebrow text-anomaly md:inline">
            click to drill
          </span>
        )}
      </div>
      <span className="font-mono text-[10px] tabular text-muted">
        {row.channel}
      </span>
      <Sparkline values={row.trend} negative={!!row.anomaly} delay={0.04 * i} />
      <MonoNumeral
        className={cn(
          "text-right",
          row.anomaly ? "text-anomaly" : "text-primary",
        )}
      >
        {row.margin.toFixed(1)}%
      </MonoNumeral>
      <MonoNumeral
        className={cn(
          "text-right text-[11px]",
          row.delta < 0 ? "text-anomaly" : "text-positive",
        )}
      >
        {row.delta > 0 ? "+" : ""}
        {row.delta.toFixed(1)}
      </MonoNumeral>
    </div>
  );
}

function Sparkline({
  values,
  negative,
  delay,
}: {
  values: number[];
  negative: boolean;
  delay: number;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const w = 84;
  const h = 18;
  const step = w / (values.length - 1);
  const pts = values
    .map((v, i) => `${(i * step).toFixed(2)},${(h - ((v - min) / range) * h).toFixed(2)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn("h-[18px] w-[84px]", negative ? "text-anomaly" : "text-accent")}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.polyline
        points={pts}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0.4 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1], delay }}
      />
    </svg>
  );
}

const drivers = [
  {
    bps: -8.2,
    label: "Freight cost",
    detail: "+28% on last 3 CM-02 shipments · $2.40 / unit landed",
  },
  {
    bps: -3.1,
    label: "Promo depth",
    detail: "Black Friday discount carried into Dec on bundle SKU",
  },
  {
    bps: -1.6,
    label: "Returns rate",
    detail: "+180 bps post-holiday · QA flag on travel-size pump",
  },
];

function Drilldown({
  sku,
  row,
  applied,
  onApply,
}: {
  sku: string | null;
  row: Row | null;
  applied: boolean;
  onApply: () => void;
}) {
  const reduced = useReducedMotion();

  if (!sku || !row) {
    return (
      <GlassPanel className="flex h-full min-h-[280px] items-center justify-center p-6">
        <div className="text-center">
          <span
            aria-hidden
            className="mx-auto mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-anomaly-subtle text-anomaly ring-1 ring-anomaly/30"
          >
            <svg viewBox="0 0 16 16" width="14" height="14">
              <path
                d="M8 4v4.5M8 11.5h.01"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <p className="text-[13px] text-muted">
            Click a flagged SKU to see what&apos;s draining margin.
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-eyebrow text-faint">
            2 anomalies waiting · 7:14 AM
          </p>
        </div>
      </GlassPanel>
    );
  }

  return (
    <motion.div
      key={sku}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <GlassPanel className="h-full">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-anomaly" />
            <span className="font-mono text-[11px] uppercase tracking-eyebrow text-muted">
              Margin drilldown
            </span>
          </div>
          <MonoNumeral className="text-[11px] text-muted">{row.sku}</MonoNumeral>
        </header>

        <div className="space-y-4 px-4 py-4">
          <div>
            <p className="text-[14px] font-medium text-primary">{row.name}</p>
            <p className="mt-1 text-[12px] text-muted">
              Margin{" "}
              <MonoNumeral className="text-anomaly">
                −{Math.abs(row.delta).toFixed(1)}pp
              </MonoNumeral>{" "}
              over last 30 days · now{" "}
              <MonoNumeral className="text-anomaly">{row.margin.toFixed(1)}%</MonoNumeral>
            </p>
          </div>

          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-eyebrow text-faint">
              Driver attribution
            </p>
            <ul className="space-y-1.5">
              {drivers.map((d) => (
                <li
                  key={d.label}
                  className="flex items-start gap-3 rounded-md bg-bg-subtle/60 px-2.5 py-2 ring-1 ring-border"
                >
                  <MonoNumeral className="w-12 flex-none text-[12px] text-anomaly">
                    {d.bps.toFixed(1)}pp
                  </MonoNumeral>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] text-primary">{d.label}</p>
                    <p className="mt-0.5 text-[11px] text-muted">{d.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md bg-accent/5 px-3 py-3 ring-1 ring-accent/20">
            <p className="font-mono text-[10px] uppercase tracking-eyebrow text-accent">
              Recommendation
            </p>
            <p className="mt-1 text-[13px] text-primary">
              Reprice{" "}
              <MonoNumeral className="text-muted line-through decoration-faint/60">
                $79.00
              </MonoNumeral>{" "}
              →{" "}
              <MonoNumeral className="font-medium text-primary">$89.00</MonoNumeral>
            </p>
            <p className="mt-1 text-[12px] text-muted">
              Restores +10.8pp · forecast Q1 contribution{" "}
              <MonoNumeral className="text-positive">+$184k</MonoNumeral>
            </p>
          </div>

          {!applied ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onApply}
                className="rounded-md bg-accent px-3 py-1.5 text-[12px] font-medium text-accent-fg hover:bg-accent/90"
              >
                Apply price change
              </button>
              <button
                type="button"
                className="rounded-md px-3 py-1.5 text-[12px] text-muted ring-1 ring-inset ring-border hover:bg-primary/5"
              >
                Snooze 7d
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-2 rounded-full bg-positive/10 px-2.5 py-1 ring-1 ring-positive/20"
            >
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-positive" />
              <span className="font-mono text-[11px] uppercase tracking-eyebrow text-positive">
                Pricing engine notified · effective tomorrow
              </span>
            </motion.div>
          )}
        </div>
      </GlassPanel>
    </motion.div>
  );
}
