"use client";

type Source = {
  name: string;
  color: string;
  Logo: () => React.ReactElement;
};

function GongLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-label="Gong">
      <rect width="24" height="24" rx="6" fill="#8038F5" />
      <g fill="white">
        <rect x="5"  y="10" width="2" height="4"  rx="1" />
        <rect x="9"  y="7"  width="2" height="10" rx="1" />
        <rect x="13" y="9"  width="2" height="6"  rx="1" />
        <rect x="17" y="6"  width="2" height="12" rx="1" />
      </g>
    </svg>
  );
}

function SlackLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-label="Slack">
      <rect width="24" height="24" rx="6" fill="white" />
      <g transform="translate(2 2) scale(0.833)">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z" fill="#E01E5A"/>
        <path d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A"/>
        <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834z" fill="#36C5F0"/>
        <path d="M8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0"/>
        <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834z" fill="#2EB67D"/>
        <path d="M17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D"/>
        <path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52z" fill="#ECB22E"/>
        <path d="M15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#ECB22E"/>
      </g>
    </svg>
  );
}

function MixpanelLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-label="Mixpanel">
      <rect width="24" height="24" rx="6" fill="#5028C0" />
      {/* Mixpanel "X" mark — two crossing bezier blades meeting at center.
          Approximates the post-2023 rebrand symbol. */}
      <g fill="white">
        <path d="M6 5.6 C 7.4 5.0, 8.7 5.4, 9.6 6.6 L 12 9.8 L 14.4 6.6 C 15.3 5.4, 16.6 5.0, 18 5.6 C 17.2 7.0, 16.4 8.0, 15.1 9.6 L 13.0 12.0 L 15.1 14.4 C 16.4 16.0, 17.2 17.0, 18 18.4 C 16.6 19.0, 15.3 18.6, 14.4 17.4 L 12 14.2 L 9.6 17.4 C 8.7 18.6, 7.4 19.0, 6 18.4 C 6.8 17.0, 7.6 16.0, 8.9 14.4 L 11.0 12.0 L 8.9 9.6 C 7.6 8.0, 6.8 7.0, 6 5.6 Z" />
      </g>
    </svg>
  );
}

function ZoomLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-label="Zoom">
      <rect width="24" height="24" rx="6" fill="#2D8CFF" />
      <path d="M4.5 9.5a1.5 1.5 0 0 1 1.5-1.5h7a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5v-5z" fill="white"/>
      <path d="M15.5 11l3.2-1.9c.4-.3 1 0 1 .5v4.8c0 .5-.6.8-1 .5L15.5 13v-2z" fill="white"/>
    </svg>
  );
}

function OutlookLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-label="Outlook">
      {/* lighter envelope body */}
      <rect width="24" height="24" rx="6" fill="#0F6CBD" />
      {/* envelope flap suggestion */}
      <path
        d="M11.5 12.6 L17.6 8.6 V15 a1 1 0 0 1 -1 1 H12.5 a1 1 0 0 1 -1 -1 Z"
        fill="#1E78C7"
      />
      <path
        d="M11.5 12.6 L14.55 14.6 L17.6 12.6"
        stroke="#0F6CBD"
        strokeWidth="0.9"
        fill="none"
        strokeLinejoin="round"
      />
      {/* dark-blue rounded square holding the "O" */}
      <rect x="2.6" y="5.6" width="12.8" height="12.8" rx="2.4" fill="#0A3D78" />
      {/* white "O" — slightly oval, hollow */}
      <ellipse
        cx="9"
        cy="12"
        rx="3.6"
        ry="4.2"
        fill="none"
        stroke="white"
        strokeWidth="1.7"
      />
    </svg>
  );
}

const sources: Source[] = [
  { name: "Gong",     color: "#8038F5", Logo: GongLogo },
  { name: "Slack",    color: "#E01E5A", Logo: SlackLogo },
  { name: "Mixpanel", color: "#7856FF", Logo: MixpanelLogo },
  { name: "Zoom",     color: "#2D8CFF", Logo: ZoomLogo },
  { name: "Outlook",  color: "#0F6CBD", Logo: OutlookLogo },
];

const snippets: Record<string, string[]> = {
  Gong:     ["Champion mentioned leaving", "CEO joined the call", "Pricing objection raised"],
  Slack:    ["CFO joined #northwind",      "Procurement engaged",  "Channel quiet 8d"],
  Mixpanel: ["+3 power users at Globex",   "Active sessions −38%", "Pricing page revisited"],
  Zoom:     ["QBR scheduled",              "Demo no-show",         "Exec sync booked"],
  Outlook:  ["'Maybe Q4' reply",           "Inbound RFP",          "Threads went cold"],
};

type Kind = "grow" | "risk" | "health";

type ActionIcon = (props: { color: string }) => React.ReactElement;

const ExpandIcon: ActionIcon = ({ color }) => (
  <svg viewBox="0 0 16 16" className="h-full w-full" aria-hidden>
    <path
      d="M3.5 11.5 L8 7 L10 9 L13 5.5 M9.5 5.5 H13 V9"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const SaveIcon: ActionIcon = ({ color }) => (
  <svg viewBox="0 0 16 16" className="h-full w-full" aria-hidden>
    <path
      d="M8 2.2 L13 4 V8.2 C13 11 10.8 13 8 13.8 C5.2 13 3 11 3 8.2 V4 Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M6 8.2 L7.4 9.6 L10.2 6.7"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const UnstickIcon: ActionIcon = ({ color }) => (
  <svg viewBox="0 0 16 16" className="h-full w-full" aria-hidden>
    <path
      d="M2.5 8 H10 M7 4.5 L10.5 8 L7 11.5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M13 4 V12"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity="0.55"
    />
  </svg>
);

const RenewIcon: ActionIcon = ({ color }) => (
  <svg viewBox="0 0 16 16" className="h-full w-full" aria-hidden>
    <path
      d="M13 8 A5 5 0 1 1 11.4 4.3"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M13.5 2.5 V4.6 H11.4"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const actions: { verb: string; account: string; metric: string; kind: Kind; Icon: ActionIcon }[] = [
  { verb: "Expand",  account: "Globex Inc",     metric: "+$120k ARR",   kind: "grow",   Icon: ExpandIcon  },
  { verb: "Save",    account: "Northwind Labs", metric: "$480k at risk", kind: "risk",   Icon: SaveIcon    },
  { verb: "Unstick", account: "Helix Co.",      metric: "8d silent",     kind: "health", Icon: UnstickIcon },
  { verb: "Renew",   account: "Trellis Health", metric: "21d to renewal",kind: "health", Icon: RenewIcon   },
];

const kindHex: Record<Kind, string> = {
  grow:   "#15803D",
  risk:   "#C9491A",
  health: "#1E40AF",
};

// Geometry — a fixed viewBox keeps proportions stable as the container scales.
const VB_W = 900;
const VB_H = 540;
const SRC_X = 150;     // x where signal lines begin (just right of source icons)
const CTR_X = 450;     // brain center x
const CTR_Y = 270;     // brain center y
const ACT_X = 750;     // x where action lines terminate (just left of action labels)
const BRAIN_R = 48;    // core radius

function distributeY(i: number, n: number, margin: number) {
  if (n === 1) return VB_H / 2;
  const usable = VB_H - 2 * margin;
  return margin + (i / (n - 1)) * usable;
}

function smoothPath(x1: number, y1: number, x2: number, y2: number) {
  const cx = (x1 + x2) / 2;
  return `M ${x1},${y1} C ${cx},${y1} ${cx},${y2} ${x2},${y2}`;
}

export default function ProductCard() {
  return (
    <div className="relative w-full max-w-[920px]">
      {/* soft warm backdrop */}
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[40px] bg-gradient-to-br from-[color:var(--color-accent-wash)] via-transparent to-transparent opacity-70 blur-3xl" />

      <div
        className="relative w-full"
        style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
      >
        {/* SVG layer: signal lines, action lines, central node */}
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
        >
          <defs>
            {sources.map((s) => (
              <linearGradient
                key={`gin-${s.name}`}
                id={`gin-${s.name}`}
                x1="0" x2="1" y1="0" y2="0"
              >
                <stop offset="0%"   stopColor={s.color} stopOpacity="0" />
                <stop offset="40%"  stopColor={s.color} stopOpacity="0.55" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0.95" />
              </linearGradient>
            ))}
            {actions.map((a, i) => (
              <linearGradient
                key={`gout-${i}`}
                id={`gout-${i}`}
                x1="0" x2="1" y1="0" y2="0"
              >
                <stop offset="0%"   stopColor={kindHex[a.kind]} stopOpacity="0.95" />
                <stop offset="60%"  stopColor={kindHex[a.kind]} stopOpacity="0.55" />
                <stop offset="100%" stopColor={kindHex[a.kind]} stopOpacity="0" />
              </linearGradient>
            ))}
            <radialGradient id="brain-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#EA5A1E" stopOpacity="0.22" />
              <stop offset="55%"  stopColor="#EA5A1E" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#EA5A1E" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Incoming signal lines: source → brain */}
          {sources.map((s, i) => {
            const y1 = distributeY(i, sources.length, 60);
            const d = smoothPath(SRC_X, y1, CTR_X - BRAIN_R, CTR_Y);
            return (
              <g key={`in-${s.name}`}>
                <path d={d} stroke={s.color} strokeOpacity={0.12} strokeWidth={1.1} fill="none" />
                <path
                  d={d}
                  stroke={`url(#gin-${s.name})`}
                  strokeWidth={1.4}
                  strokeDasharray="2 9"
                  strokeLinecap="round"
                  fill="none"
                  style={{ animation: `dashFlow ${5.5 + i * 0.55}s linear ${i * 0.45}s infinite` }}
                />
                {/* ingress dot landing on the brain */}
                <circle
                  cx={CTR_X - BRAIN_R}
                  cy={CTR_Y}
                  r={2.2}
                  fill={s.color}
                  opacity={0.85}
                />
              </g>
            );
          })}

          {/* Outgoing action lines: brain → action */}
          {actions.map((a, i) => {
            const y2 = distributeY(i, actions.length, 90);
            const d = smoothPath(CTR_X + BRAIN_R, CTR_Y, ACT_X, y2);
            const c = kindHex[a.kind];
            return (
              <g key={`out-${i}`}>
                <path d={d} stroke={c} strokeOpacity={0.12} strokeWidth={1.1} fill="none" />
                <path
                  d={d}
                  stroke={`url(#gout-${i})`}
                  strokeWidth={1.5}
                  strokeDasharray="2 9"
                  strokeLinecap="round"
                  fill="none"
                  style={{ animation: `dashFlow ${5 + i * 0.6}s linear ${0.9 + i * 0.5}s infinite` }}
                />
                {/* egress dot leaving the brain */}
                <circle
                  cx={CTR_X + BRAIN_R}
                  cy={CTR_Y}
                  r={2.2}
                  fill={c}
                  opacity={0.85}
                />
                {/* terminal dot at the label */}
                <circle cx={ACT_X} cy={y2} r={3} fill={c} />
              </g>
            );
          })}

          {/* Central node — abstract "intelligence" */}
          <g transform={`translate(${CTR_X} ${CTR_Y})`}>
            {/* soft glow halo */}
            <circle r={120} fill="url(#brain-glow)" />

            {/* slow pulse rings */}
            <circle
              r={BRAIN_R + 18}
              fill="none"
              stroke="#EA5A1E"
              strokeOpacity="0.22"
              strokeWidth="1"
              style={{
                transformOrigin: "center",
                transformBox: "fill-box",
                animation: "pulseRing 5s ease-out infinite",
              }}
            />
            <circle
              r={BRAIN_R + 18}
              fill="none"
              stroke="#EA5A1E"
              strokeOpacity="0.22"
              strokeWidth="1"
              style={{
                transformOrigin: "center",
                transformBox: "fill-box",
                animation: "pulseRing 5s ease-out 2.5s infinite",
              }}
            />

            {/* outer faint ring */}
            <circle r={BRAIN_R + 10} fill="none" stroke="#ECE3D2" strokeWidth="1" />

            {/* core disc */}
            <circle
              r={BRAIN_R}
              fill="#FFFFFF"
              stroke="#ECE3D2"
              strokeWidth="1"
            />

            {/* Fosbury brand glyph — dark rounded square with arc + bar */}
            <g style={{ transformOrigin: "center", transformBox: "fill-box", animation: "brainBreathe 5s ease-in-out infinite" }}>
              <rect
                x={-26}
                y={-26}
                width={52}
                height={52}
                rx={11}
                fill="#1c1814"
              />
              {/* high-jump arc */}
              <path
                d="M -18,11 Q 0,-16 18,11"
                stroke="#f5f1e8"
                strokeWidth={2.6}
                fill="none"
                strokeLinecap="round"
              />
              {/* horizontal bar */}
              <line
                x1={-19}
                y1={16}
                x2={19}
                y2={16}
                stroke="#EA5A1E"
                strokeWidth={2.6}
                strokeLinecap="round"
              />
            </g>
          </g>
        </svg>

        {/* Source labels (HTML overlay, left side) */}
        <div className="pointer-events-none absolute inset-0">
          {sources.map((s, i) => {
            const y = distributeY(i, sources.length, 60);
            const lines = snippets[s.name] ?? [];
            const cycle = lines.length * 4.2; // total cycle length (s)
            return (
              <div
                key={`src-${s.name}`}
                className="absolute"
                style={{
                  left: `${(SRC_X / VB_W) * 100}%`,
                  top: `${(y / VB_H) * 100}%`,
                  transform: "translate(0, -50%)",
                }}
              >
                {/* name + logo group, anchored just LEFT of SRC_X */}
                <div
                  className="flex items-center gap-2.5"
                  style={{ transform: "translate(calc(-100% - 8px), 0)" }}
                >
                  <span className="hidden text-[11px] font-medium uppercase tracking-[0.16em] text-[color:var(--color-muted)] sm:inline">
                    {s.name}
                  </span>
                  <span
                    className="block h-8 w-8 overflow-hidden rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_18px_-10px_rgba(40,30,20,0.25)] ring-1 ring-black/5"
                    title={s.name}
                  >
                    <s.Logo />
                  </span>
                </div>

                {/* floating snippet bubbles — sit JUST RIGHT of the icon, above the line */}
                <div
                  className="absolute hidden lg:block"
                  style={{ left: 16, top: -22, width: 200 }}
                >
                  {lines.map((text, j) => (
                    <span
                      key={j}
                      className="absolute left-0 top-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[10.5px] font-medium tracking-tight"
                      style={{
                        color: s.color,
                        background: `${s.color}10`,
                        boxShadow: `inset 0 0 0 1px ${s.color}33`,
                        opacity: 0,
                        animation: `snippetCycle ${cycle}s ease-in-out ${j * 4.2}s infinite both`,
                      }}
                    >
                      {text}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action labels (HTML overlay, right side) */}
        <div className="pointer-events-none absolute inset-0">
          {actions.map((a, i) => {
            const y = distributeY(i, actions.length, 90);
            const color = kindHex[a.kind];
            // Rolling "fresh play" highlight: each play takes a turn pulsing,
            // staggered so one is always lighting up.
            const highlightDelay = i * 3; // seconds
            return (
              <div
                key={`act-${i}`}
                className="absolute flex items-center gap-2.5 whitespace-nowrap rounded-xl px-1.5 py-1"
                style={{
                  left: `${(ACT_X / VB_W) * 100}%`,
                  top: `${(y / VB_H) * 100}%`,
                  transform: "translate(14px, -50%)",
                  animation: `playHighlight 12s ease-in-out ${highlightDelay}s infinite`,
                }}
              >
                <span
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    background: `${color}14`,
                    boxShadow: `inset 0 0 0 1px ${color}26`,
                  }}
                >
                  <span className="block h-4 w-4">
                    <a.Icon color={color} />
                  </span>
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="flex items-baseline gap-1.5">
                    <span className="text-[14px] font-semibold tracking-tight text-[color:var(--color-ink)]">
                      {a.verb}
                    </span>
                    <span className="text-[12.5px] tracking-tight text-[color:var(--color-muted)]">
                      {a.account}
                    </span>
                  </span>
                  <span
                    className="mt-0.5 font-[var(--font-mono)] text-[10.5px] font-medium tabular-nums tracking-tight"
                    style={{ color }}
                  >
                    {a.metric}
                  </span>
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
