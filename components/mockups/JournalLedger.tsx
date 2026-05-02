"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { MonoNumeral } from "@/components/ui/MonoNumeral";
import { StaggerList, StaggerItem } from "@/components/primitives/StaggerList";

type Entry = {
  time: string;
  source: "Shopify" | "3PL" | "Contract Mfr";
  ref: string;
  lines: Array<{ label: string; amount: string; cr?: boolean }>;
};

const entries: Entry[] = [
  {
    time: "14:02:11",
    source: "Shopify",
    ref: "ord_4821-A",
    lines: [
      { label: "Dr · Cash", amount: "486.00" },
      { label: "Cr · Revenue · DTC", amount: "412.00", cr: true },
      { label: "Cr · Sales tax payable", amount: "74.00", cr: true },
    ],
  },
  {
    time: "14:02:09",
    source: "3PL",
    ref: "rcpt_DC-E-9914",
    lines: [
      { label: "Dr · Inventory · DC-East", amount: "12,840.00" },
      { label: "Cr · GR/IR · CM-02", amount: "12,840.00", cr: true },
    ],
  },
  {
    time: "14:01:58",
    source: "Contract Mfr",
    ref: "inv_CM02-2207",
    lines: [
      { label: "Dr · GR/IR · CM-02", amount: "12,840.00" },
      { label: "Cr · AP · Vendor 2207", amount: "12,840.00", cr: true },
    ],
  },
];

const sourceTone: Record<Entry["source"], string> = {
  Shopify: "bg-accent/15 text-accent ring-accent/30",
  "3PL": "bg-bg-subtle text-muted ring-border",
  "Contract Mfr": "bg-bg-subtle text-muted ring-border",
};

export function JournalLedger() {
  return (
    <GlassPanel className="w-full">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-eyebrow text-muted">
            General Ledger · live
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-positive/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-eyebrow text-positive ring-1 ring-positive/20">
            <span className="inline-flex h-1 w-1 rounded-full bg-positive" />
            Reconciled
          </span>
        </div>
      </header>

      <StaggerList className="divide-y divide-border" staggerChildren={0.1} delayChildren={0.2}>
        {entries.map((e) => (
          <StaggerItem key={e.ref} className="px-4 py-3">
            <div className="mb-2 flex items-center gap-2">
              <MonoNumeral className="text-[10px] text-faint">{e.time}</MonoNumeral>
              <span
                className={`inline-flex rounded-md px-1.5 py-0.5 font-mono text-[10px] ring-1 ${sourceTone[e.source]}`}
              >
                {e.source}
              </span>
              <MonoNumeral className="text-[10px] text-muted">{e.ref}</MonoNumeral>
              <MonoNumeral className="ml-auto text-[10px] text-faint">auto-posted</MonoNumeral>
            </div>
            <ul className="space-y-1">
              {e.lines.map((l) => (
                <li
                  key={l.label}
                  className="flex items-center justify-between text-[12px]"
                >
                  <span className={l.cr ? "text-muted pl-4" : "text-primary"}>
                    {l.label}
                  </span>
                  <MonoNumeral className="text-primary">{l.amount}</MonoNumeral>
                </li>
              ))}
            </ul>
          </StaggerItem>
        ))}
      </StaggerList>
    </GlassPanel>
  );
}
