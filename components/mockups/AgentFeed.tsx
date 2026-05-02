"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { MonoNumeral } from "@/components/ui/MonoNumeral";
import { StaggerList, StaggerItem } from "@/components/primitives/StaggerList";
import { cn } from "@/lib/cn";

type FeedItem = {
  id: string;
  agent: { initials: string; name: string };
  status: "pending" | "executed";
  time: string;
  title: string;
  diff: Array<{ op: "+" | "-" | " "; line: string }>;
  amount?: string;
};

const items: FeedItem[] = [
  {
    id: "1",
    agent: { initials: "IR", name: "Inventory Reconciliation" },
    status: "pending",
    time: "14:02",
    title: "Variance · SKU-3340 · DC-East",
    amount: "$3,184.20",
    diff: [
      { op: "-", line: "Inventory · DC-East   12,840.00" },
      { op: "+", line: "Inventory · DC-East   16,024.20" },
      { op: " ", line: "Source: CM-02 partial shipment" },
    ],
  },
  {
    id: "2",
    agent: { initials: "3W", name: "Three-Way Match" },
    status: "pending",
    time: "13:58",
    title: "PO 4821 · GR · Invoice mismatch",
    amount: "$148.40",
    diff: [
      { op: " ", line: "PO 4821 · 1,200 units · $12.00" },
      { op: " ", line: "GR    · 1,212 units" },
      { op: "+", line: "Suggested: book overage to GR/IR" },
    ],
  },
  {
    id: "3",
    agent: { initials: "RR", name: "Revenue Recognition" },
    status: "pending",
    time: "13:51",
    title: "Subscription · 412 orders · December",
    amount: "$84,210.00",
    diff: [
      { op: " ", line: "Recognize ratably · Dec 1–31" },
      { op: "+", line: "Deferred → Recognized · 2,716.45/day" },
    ],
  },
  {
    id: "4",
    agent: { initials: "FX", name: "Flux Analysis" },
    status: "executed",
    time: "13:14",
    title: "Q4 GM commentary · drafted",
    diff: [
      { op: " ", line: "Auto-executed · audit trail attached" },
      { op: " ", line: "Top driver: SKU-3340 freight variance −3.2pp" },
    ],
  },
];

export function AgentFeed() {
  return (
    <GlassPanel className="w-full">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="font-mono text-[11px] uppercase tracking-eyebrow text-muted">
          Agent activity · December 14
        </span>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-eyebrow text-faint">
          <span>3 pending</span>
          <span>1 auto-executed</span>
        </div>
      </header>

      <StaggerList
        className="divide-y divide-border"
        staggerChildren={0.08}
        delayChildren={0.2}
      >
        {items.map((it) => (
          <StaggerItem key={it.id} className="px-4 py-3">
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full font-mono text-[10px] ring-1",
                  it.status === "pending"
                    ? "bg-accent/15 text-accent ring-accent/30"
                    : "bg-positive/10 text-positive ring-positive/20",
                )}
              >
                {it.agent.initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-primary">{it.agent.name}</span>
                  <MonoNumeral className="text-[10px] text-faint">{it.time}</MonoNumeral>
                  {it.status === "executed" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-positive/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-eyebrow text-positive">
                      Auto-executed
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[12px] text-muted">{it.title}</p>
                <div className="mt-2 rounded-md bg-bg-subtle/60 px-2.5 py-2 ring-1 ring-border font-mono text-[11px] tabular leading-relaxed">
                  {it.diff.map((d, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex gap-2",
                        d.op === "+" && "text-positive",
                        d.op === "-" && "text-anomaly",
                        d.op === " " && "text-muted",
                      )}
                    >
                      <span className="w-2 select-none text-faint">{d.op}</span>
                      <span className="truncate">{d.line}</span>
                    </div>
                  ))}
                </div>
                {it.status === "pending" && (
                  <div className="mt-2.5 flex items-center gap-2">
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
                    {it.amount && (
                      <MonoNumeral className="ml-auto text-[11px] text-primary">
                        {it.amount}
                      </MonoNumeral>
                    )}
                  </div>
                )}
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerList>
    </GlassPanel>
  );
}
