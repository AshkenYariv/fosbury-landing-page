"use client";

const NODES = [
  { id: "champion",   label: "champions",  x: 60,  y: 50 },
  { id: "usage",      label: "usage",      x: 60,  y: 140 },
  { id: "competitor", label: "competitor", x: 60,  y: 230 },
  { id: "budget",     label: "budget",     x: 60,  y: 320 },
  { id: "renewal",    label: "renewal",    x: 540, y: 95 },
  { id: "expansion",  label: "expansion",  x: 540, y: 185 },
  { id: "pipeline",   label: "pipeline",   x: 540, y: 275 },
];

const CENTER = { x: 300, y: 185 };

export function SignalGraph() {
  return (
    <div className="relative overflow-hidden rounded-[14px] border hairline bg-[var(--color-bg-elev)] p-6 shadow-[0_24px_60px_-30px_rgba(26,23,20,0.25)]">
      <div className="grain-heavy pointer-events-none absolute inset-0 opacity-50" />

      <div className="relative mb-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-fg-muted)]">
        <span>correlation engine</span>
        <span className="text-[var(--color-accent)]">stable · t+47d</span>
      </div>

      <svg viewBox="0 0 600 370" className="relative w-full h-auto" aria-hidden>
        <defs>
          <radialGradient id="halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#b8421d" stopOpacity="0.20" />
            <stop offset="60%" stopColor="#b8421d" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#b8421d" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="line-in" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(26,23,20,0.10)" />
            <stop offset="100%" stopColor="rgba(184,66,29,0.65)" />
          </linearGradient>
          <linearGradient id="line-out" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(184,66,29,0.65)" />
            <stop offset="100%" stopColor="rgba(26,23,20,0.10)" />
          </linearGradient>
        </defs>

        <circle cx={CENTER.x} cy={CENTER.y} r="120" fill="url(#halo)" />

        {NODES.slice(0, 4).map((n) => (
          <line
            key={`l-${n.id}`}
            x1={n.x + 6}
            y1={n.y}
            x2={CENTER.x - 18}
            y2={CENTER.y}
            stroke="url(#line-in)"
            strokeWidth="1"
          />
        ))}

        {NODES.slice(4).map((n) => (
          <line
            key={`l-${n.id}`}
            x1={CENTER.x + 18}
            y1={CENTER.y}
            x2={n.x - 6}
            y2={n.y}
            stroke="url(#line-out)"
            strokeWidth="1"
          />
        ))}

        <circle cx={CENTER.x} cy={CENTER.y} r="22" fill="#fbf7ec" stroke="#b8421d" strokeWidth="1.6" />
        <text
          x={CENTER.x}
          y={CENTER.y + 4}
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="11"
          fill="#b8421d"
          letterSpacing="0.14em"
        >
          AGENT
        </text>

        {NODES.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="4" fill="#fbf7ec" stroke="rgba(26,23,20,0.5)" />
            <text
              x={n.x < CENTER.x ? n.x - 12 : n.x + 12}
              y={n.y + 4}
              textAnchor={n.x < CENTER.x ? "end" : "start"}
              fontFamily="ui-monospace, monospace"
              fontSize="11"
              fill="rgba(26,23,20,0.75)"
              letterSpacing="0.08em"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>

      <div className="relative mt-2 flex items-center justify-between font-mono text-[11px] text-[var(--color-fg-muted)]">
        <span>4 scattered systems · 1 coherent view</span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-1.5 rounded-full bg-[var(--color-accent)] dot-live" />
          correlating
        </span>
      </div>
    </div>
  );
}
