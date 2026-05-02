"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { MonoNumeral } from "@/components/ui/MonoNumeral";
import { motion } from "framer-motion";
import { viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Row = {
  sku: string;
  name: string;
  channel: "DTC" | "Amazon" | "Wholesale";
  margin: number;
  trend: number[];
  anomaly?: boolean;
};

const rows: Row[] = [
  { sku: "SKU-1184", name: "Hydrating Serum 30ml", channel: "DTC",       margin: 64.2, trend: [40, 42, 45, 47, 50, 53, 56, 58, 60, 62, 63, 64] },
  { sku: "SKU-1185", name: "Hydrating Serum 50ml", channel: "DTC",       margin: 61.8, trend: [38, 40, 42, 45, 48, 51, 53, 55, 58, 59, 60, 61] },
  { sku: "SKU-2207", name: "Refill Cartridge 4-pk", channel: "Amazon",   margin: 58.7, trend: [55, 56, 56, 57, 57, 58, 58, 58, 58, 58, 58, 59] },
  { sku: "SKU-2240", name: "Cleansing Balm",         channel: "DTC",       margin: 57.4, trend: [50, 51, 52, 54, 55, 55, 56, 56, 57, 57, 57, 57] },
  { sku: "SKU-2280", name: "Toner 100ml",             channel: "Wholesale", margin: 51.2, trend: [48, 48, 49, 49, 50, 50, 50, 51, 51, 51, 51, 51] },
  { sku: "SKU-3340", name: "Travel Set",              channel: "DTC",       margin: 42.1, trend: [55, 54, 52, 50, 48, 47, 46, 45, 44, 43, 42, 42], anomaly: true },
  { sku: "SKU-3402", name: "Eye Cream 15ml",          channel: "DTC",       margin: 49.0, trend: [52, 52, 51, 51, 50, 50, 49, 49, 49, 49, 49, 49] },
  { sku: "SKU-4011", name: "Body Lotion 250ml",       channel: "Amazon",   margin: 38.9, trend: [50, 49, 47, 46, 44, 42, 41, 40, 39, 39, 39, 39], anomaly: true },
  { sku: "SKU-4120", name: "Hand Cream 75ml",         channel: "DTC",       margin: 55.6, trend: [54, 54, 54, 55, 55, 55, 55, 55, 55, 56, 56, 56] },
  { sku: "SKU-5008", name: "Lip Treatment 10ml",      channel: "Amazon",   margin: 60.3, trend: [55, 56, 56, 57, 58, 58, 59, 59, 60, 60, 60, 60] },
  { sku: "SKU-5012", name: "Sunscreen SPF50",         channel: "Wholesale", margin: 47.8, trend: [44, 44, 45, 45, 46, 46, 46, 47, 47, 47, 47, 48] },
  { sku: "SKU-6101", name: "Gift Set — Holiday",      channel: "DTC",       margin: 53.2, trend: [49, 50, 51, 51, 52, 52, 52, 53, 53, 53, 53, 53] },
];

export function MarginGrid() {
  return (
    <GlassPanel className="w-full">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="font-mono text-[11px] uppercase tracking-eyebrow text-muted">
          SKU margin · last 30 days
        </span>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-eyebrow text-faint">
          <span className="flex items-center gap-1.5">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-anomaly" />
            anomaly
          </span>
          <span>2 flagged</span>
        </div>
      </header>

      <div className="grid grid-cols-[auto_1fr_auto_88px_auto] items-center gap-x-4 gap-y-1 px-4 py-3 text-[12px]">
        <div className="font-mono text-[10px] uppercase tracking-eyebrow text-faint">SKU</div>
        <div className="font-mono text-[10px] uppercase tracking-eyebrow text-faint">Name</div>
        <div className="font-mono text-[10px] uppercase tracking-eyebrow text-faint">Ch</div>
        <div className="font-mono text-[10px] uppercase tracking-eyebrow text-faint text-right">Trend</div>
        <div className="font-mono text-[10px] uppercase tracking-eyebrow text-faint text-right">Margin</div>

        {rows.map((r, i) => (
          <Row key={r.sku} row={r} i={i} />
        ))}
      </div>
    </GlassPanel>
  );
}

function Row({ row, i }: { row: Row; i: number }) {
  return (
    <>
      <MonoNumeral
        className={cn(
          "text-[10px] text-faint contents",
          row.anomaly && "text-anomaly",
        )}
      >
        <span className={cn("col-start-1 py-1.5", row.anomaly && "text-anomaly")}>
          {row.sku}
        </span>
      </MonoNumeral>
      <div
        className={cn(
          "col-start-2 flex min-w-0 items-center gap-2 truncate py-1.5",
          row.anomaly ? "text-primary" : "text-primary",
        )}
      >
        {row.anomaly && (
          <span className="inline-flex h-1.5 w-1.5 flex-none rounded-full bg-anomaly" />
        )}
        <span className="truncate">{row.name}</span>
      </div>
      <span className="col-start-3 py-1.5 font-mono text-[10px] tabular text-muted">
        {row.channel}
      </span>
      <div className="col-start-4 py-1.5">
        <Sparkline values={row.trend} negative={!!row.anomaly} delay={0.05 * i} />
      </div>
      <MonoNumeral
        className={cn(
          "col-start-5 py-1.5 text-right",
          row.anomaly ? "text-anomaly" : "text-primary",
        )}
      >
        {row.margin.toFixed(1)}%
      </MonoNumeral>
    </>
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
      className={cn(
        "h-[18px] w-[84px]",
        negative ? "text-anomaly" : "text-accent",
      )}
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
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1], delay }}
      />
    </svg>
  );
}
