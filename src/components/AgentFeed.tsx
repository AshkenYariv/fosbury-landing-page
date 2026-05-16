"use client";

import { useEffect, useState } from "react";

type Event = {
  ts: string;
  agent: string;
  action: string;
  signal?: string;
};

const EVENTS: Event[] = [
  { ts: "11:42:08", agent: "PROSPECT-03", action: "identified champion at Acme.io", signal: "intent ↑" },
  { ts: "11:42:11", agent: "OUTREACH-01", action: "drafted sequence · 4 touches · 12d", signal: "queued" },
  { ts: "11:42:14", agent: "SIGNAL-07",   action: "competitor login detected · Notion AI", signal: "risk" },
  { ts: "11:42:19", agent: "MEETING-02",  action: "prep brief ready · Acme · 09:30 PT", signal: "ready" },
  { ts: "11:42:24", agent: "CRM-CORE",    action: "stage advanced · Acme → discovery", signal: "+1" },
  { ts: "11:42:29", agent: "PROSPECT-03", action: "47 ICP matches · Series A · NYC",   signal: "scored" },
  { ts: "11:42:33", agent: "OUTREACH-01", action: "reply detected · positive · Beam.co", signal: "warm" },
  { ts: "11:42:38", agent: "SIGNAL-07",   action: "usage dropped 38% · Lumen Labs", signal: "churn?" },
  { ts: "11:42:42", agent: "MEETING-02",  action: "action items extracted · 5 owners", signal: "logged" },
  { ts: "11:42:47", agent: "CRM-CORE",    action: "expansion path detected · Beam.co",  signal: "+$24k" },
];

export function AgentFeed() {
  const [head, setHead] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setHead((h) => (h + 1) % EVENTS.length), 2200);
    return () => clearInterval(id);
  }, []);

  const window = Array.from({ length: 5 }, (_, i) => EVENTS[(head + i) % EVENTS.length]);

  return (
    <div className="relative overflow-hidden rounded-[14px] border hairline bg-[var(--color-bg-elev)] shadow-[0_24px_60px_-30px_rgba(26,23,20,0.25)]">
      <div className="grain-heavy pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative flex items-center justify-between border-b hairline px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-fg-muted)]">
        <div className="flex items-center gap-2">
          <span className="inline-block size-1.5 rounded-full bg-[var(--color-accent)] dot-live" />
          live · agent feed
        </div>
        <span>10 agents · 1 founder</span>
      </div>

      <ul className="relative divide-y divide-[var(--color-line)]">
        {window.map((e, i) => (
          <li
            key={`${head}-${i}`}
            className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-3 px-5 py-3 font-mono text-[12.5px]"
            style={{
              animation: i === 0 ? "feed-slide 2.2s ease-out forwards" : undefined,
            }}
          >
            <span className="text-[var(--color-fg-muted)]">{e.ts}</span>
            <span className="rounded-sm bg-[var(--color-paper)] px-1.5 py-0.5 text-[10.5px] tracking-wider text-[var(--color-ink)]/80">
              {e.agent}
            </span>
            <span className="truncate text-[var(--color-ink)]/85">{e.action}</span>
            {e.signal && (
              <span className="text-[10.5px] uppercase tracking-wider text-[var(--color-accent)]">
                {e.signal}
              </span>
            )}
          </li>
        ))}
      </ul>

      <div className="relative border-t hairline px-5 py-3 font-mono text-[11px] text-[var(--color-fg-muted)]">
        <span className="text-[var(--color-ink)]/70">$</span> coherent over 90 days · 4,128 signals correlated
        <span className="cursor" />
      </div>
    </div>
  );
}
