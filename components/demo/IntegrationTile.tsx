"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export type Phase = "idle" | "connecting" | "connected";

export type Source = {
  id: string;
  label: string;
  category: string;
  /** If true, this source is being replaced (shown with strikethrough once connected). */
  replaced?: boolean;
};

type Props = {
  source: Source;
  selected: boolean;
  phase: Phase;
  /** Index in the connect order — used to stagger the connecting → connected animation. */
  connectIndex: number;
  onToggle: () => void;
};

export function IntegrationTile({
  source,
  selected,
  phase,
  connectIndex,
  onToggle,
}: Props) {
  const isWorking = selected && phase === "connecting";
  const isConnected = selected && phase === "connected";
  const interactive = phase === "idle";

  return (
    <button
      type="button"
      onClick={interactive ? onToggle : undefined}
      aria-pressed={selected}
      disabled={!interactive}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-xl bg-surface px-3 py-2.5 text-left ring-1 transition-all",
        "shadow-glass-light dark:shadow-glass",
        selected
          ? "ring-accent/40"
          : "ring-border opacity-60 hover:opacity-100 hover:ring-border-strong",
        interactive && "cursor-pointer",
        !interactive && !selected && "opacity-30",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "inline-flex h-7 w-7 flex-none items-center justify-center rounded-md font-mono text-[11px] font-semibold ring-1 transition-colors",
          selected
            ? "bg-accent/15 text-accent ring-accent/30"
            : "bg-bg-subtle text-faint ring-border",
        )}
      >
        {source.label.slice(0, 2).toUpperCase()}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-[13px] font-medium",
            isConnected && source.replaced
              ? "text-muted line-through decoration-anomaly/70 decoration-[1.5px]"
              : "text-primary",
          )}
        >
          {source.label}
        </span>
        <span className="block truncate font-mono text-[10px] uppercase tracking-eyebrow text-faint">
          {source.category}
        </span>
      </span>

      <span
        aria-hidden
        className={cn(
          "inline-flex h-5 w-5 flex-none items-center justify-center rounded-full text-[10px] ring-1 transition-all",
          phase === "idle" && selected && "bg-accent/15 text-accent ring-accent/30",
          phase === "idle" && !selected && "bg-bg-subtle text-faint ring-border",
          isWorking && "bg-accent/15 text-accent ring-accent/30",
          isConnected && source.replaced && "bg-anomaly-subtle text-anomaly ring-anomaly/30",
          isConnected && !source.replaced && "bg-positive/10 text-positive ring-positive/20",
        )}
      >
        {phase === "idle" && selected && (
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
        {phase === "idle" && !selected && (
          <svg viewBox="0 0 12 12" width="9" height="9">
            <path
              d="M3 6h6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        )}
        {isWorking && (
          <motion.span
            className="block h-1.5 w-1.5 rounded-full bg-accent"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: connectIndex * 0.08,
            }}
          />
        )}
        {isConnected && !source.replaced && (
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
        {isConnected && source.replaced && (
          <span className="font-mono text-[8px] uppercase tracking-eyebrow leading-none">
            ×
          </span>
        )}
      </span>

      {isConnected && source.replaced && (
        <span className="absolute -top-1.5 right-2 inline-flex items-center rounded-full bg-anomaly-subtle px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-eyebrow text-anomaly ring-1 ring-anomaly/30">
          replaced
        </span>
      )}
    </button>
  );
}
