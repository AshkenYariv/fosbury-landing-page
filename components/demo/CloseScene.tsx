"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MonoNumeral } from "@/components/ui/MonoNumeral";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Reveal } from "@/components/primitives/Reveal";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type Task = { label: string; done: boolean; agent?: string };

const tasks: Task[] = [
  { label: "Bank reconciliation · Q4",                 done: true,  agent: "—" },
  { label: "Inventory roll-forward · DC-East",          done: true,  agent: "IR" },
  { label: "Inventory roll-forward · DC-West",          done: true,  agent: "IR" },
  { label: "Three-way match · 218 POs",                 done: true,  agent: "3W" },
  { label: "Subscription rev rec · 412 orders",         done: true,  agent: "RR" },
  { label: "Landed cost allocation · freight + duty",   done: true,  agent: "IR" },
  { label: "Sales tax accruals · 47 jurisdictions",     done: true,  agent: "—" },
  { label: "Intercompany eliminations",                 done: true,  agent: "—" },
  { label: "AR aging · 1,124 invoices",                 done: true,  agent: "—" },
  { label: "AP cut-off · 218 vendors",                  done: true,  agent: "—" },
  { label: "Flux commentary · Q4 gross margin",         done: true,  agent: "FX" },
  { label: "Inventory variance · SKU-3340 · DC-East",   done: false, agent: "IR" },
];

const remainingHidden = 11; // 23 total in the checklist

export function CloseScene({ onReady }: { onReady: () => void }) {
  const reduced = useReducedMotion();
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (approved) onReady();
  }, [approved, onReady]);

  const approve = () => {
    if (approved) return;
    trackEvent("demo_close_approved");
    setApproved(true);
  };

  return (
    <section>
      <Reveal as="header" className="mx-auto max-w-2xl text-center">
        <motion.p
          key={approved ? "post" : "pre"}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-mono text-[11px] uppercase tracking-eyebrow text-muted"
        >
          {approved ? "December 2 · close locked" : "December 1 · day 1 of close"}
        </motion.p>
        <h1 className="mt-4 text-display-md font-medium tracking-tight text-primary">
          One pending entry between you and a closed month.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-balance text-[15px] leading-relaxed text-muted">
          The agents handled 22 of 23 tasks overnight. The last one is sitting on your desk —
          approve it, and the books are closed.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-4 lg:grid-cols-[5fr_7fr]">
        <Reveal delay={0.1}>
          <GlassPanel className="h-full">
            <header className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-mono text-[11px] uppercase tracking-eyebrow text-muted">
                Close checklist · December
              </span>
              <MonoNumeral className="text-[11px] text-muted">
                {approved ? "23 / 23" : "22 / 23"}
              </MonoNumeral>
            </header>
            <div className="px-4 py-3">
              <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-border/60">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  initial={{ width: "96%" }}
                  animate={{ width: approved ? "100%" : "96%" }}
                  transition={{ duration: reduced ? 0 : 0.6, ease: [0.22, 0.61, 0.36, 1] }}
                />
              </div>
              <ul className="space-y-1.5">
                {tasks.map((t, i) => {
                  const done = t.done || approved;
                  return (
                    <li
                      key={t.label}
                      className="flex items-center gap-2 text-[12px]"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "inline-flex h-3.5 w-3.5 flex-none items-center justify-center rounded-full ring-1 transition-colors",
                          done
                            ? "bg-accent/15 text-accent ring-accent/30"
                            : "bg-bg-subtle text-faint ring-border",
                        )}
                      >
                        {done && (
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
                          "min-w-0 flex-1 truncate",
                          done
                            ? "text-muted line-through decoration-faint/60"
                            : "text-primary",
                        )}
                      >
                        {t.label}
                      </span>
                      {t.agent && t.agent !== "—" && (
                        <span className="font-mono text-[9px] uppercase tracking-eyebrow text-faint">
                          {t.agent}
                        </span>
                      )}
                      <MonoNumeral className="w-4 text-right text-[10px] text-faint">
                        {String(i + 1).padStart(2, "0")}
                      </MonoNumeral>
                    </li>
                  );
                })}
                <li className="pt-1 text-center font-mono text-[10px] uppercase tracking-eyebrow text-faint">
                  + {remainingHidden} more · all done
                </li>
              </ul>
            </div>
          </GlassPanel>
        </Reveal>

        <Reveal delay={0.15}>
          <GlassPanel className="h-full">
            <header className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex h-1.5 w-1.5 rounded-full",
                    approved ? "bg-positive" : "bg-anomaly",
                  )}
                />
                <span className="font-mono text-[11px] uppercase tracking-eyebrow text-muted">
                  {approved ? "Posted · reconciled" : "Pending approval · 1"}
                </span>
              </div>
              <MonoNumeral className="text-[11px] text-muted">14:02</MonoNumeral>
            </header>

            <div className="space-y-4 px-4 py-4">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-accent/15 font-mono text-[10px] text-accent ring-1 ring-accent/30"
                >
                  IR
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-primary">
                    Inventory variance · SKU-3340 · DC-East
                  </p>
                  <p className="mt-0.5 text-[12px] text-muted">
                    CM-02 partial shipment · 1,212 received vs 1,200 invoiced.
                    Suggested journal entry below.
                  </p>
                </div>
                <MonoNumeral className="text-[13px] font-medium text-primary">
                  $3,184.20
                </MonoNumeral>
              </div>

              <div className="rounded-md bg-bg-subtle/60 px-3 py-2.5 ring-1 ring-border font-mono text-[11px] tabular leading-relaxed">
                <div className="flex justify-between text-primary">
                  <span>Dr · Inventory · DC-East</span>
                  <span>3,184.20</span>
                </div>
                <div className="flex justify-between pl-4 text-muted">
                  <span>Cr · GR/IR · CM-02</span>
                  <span>3,184.20</span>
                </div>
              </div>

              {!approved && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={approve}
                    className="rounded-md bg-accent px-3 py-1.5 text-[12px] font-medium text-accent-fg hover:bg-accent/90"
                  >
                    Approve & post
                  </button>
                  <button
                    type="button"
                    className="rounded-md px-3 py-1.5 text-[12px] text-muted ring-1 ring-inset ring-border hover:bg-primary/5"
                  >
                    Edit
                  </button>
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-eyebrow text-faint">
                    Audit trail attached
                  </span>
                </div>
              )}

              {approved && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
                  className="rounded-md bg-positive/5 px-3 py-2.5 ring-1 ring-positive/20"
                >
                  <div className="flex items-center gap-2 text-[12px]">
                    <span className="inline-flex items-center gap-1 rounded-full bg-positive/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-eyebrow text-positive ring-1 ring-positive/20">
                      Posted
                    </span>
                    <MonoNumeral className="text-[11px] text-muted">
                      je_4821-IR · 14:02:11
                    </MonoNumeral>
                    <span className="ml-auto font-mono text-[10px] uppercase tracking-eyebrow text-positive">
                      Books closed
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </GlassPanel>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-10">
        <GlassPanel className="px-6 py-6 sm:px-8 sm:py-7">
          <div className="grid items-center gap-6 sm:grid-cols-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">
                Industry median close
              </p>
              <p className="mt-2 flex items-baseline gap-1.5">
                <MonoNumeral className="text-[40px] font-medium leading-none tracking-tight text-muted line-through decoration-anomaly/60 decoration-2">
                  25
                </MonoNumeral>
                <span className="font-mono text-[12px] uppercase tracking-eyebrow text-faint">
                  days
                </span>
              </p>
            </div>
            <div className="hidden items-center justify-center sm:flex">
              <span className="font-mono text-[24px] text-faint">→</span>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-accent">
                Your close · today
              </p>
              <p className="mt-2 flex items-baseline gap-1.5">
                <span className="text-[40px] font-medium leading-none tracking-tight text-primary">
                  {approved ? (
                    <AnimatedNumber key="post" value={2} duration={0.9} />
                  ) : (
                    <MonoNumeral>—</MonoNumeral>
                  )}
                </span>
                <span className="font-mono text-[12px] uppercase tracking-eyebrow text-muted">
                  {approved ? "days" : "approve to lock"}
                </span>
              </p>
            </div>
          </div>
        </GlassPanel>
      </Reveal>
    </section>
  );
}
