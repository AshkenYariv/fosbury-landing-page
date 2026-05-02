"use client";

import { cn } from "@/lib/cn";

const steps = [
  { id: 1, label: "Connect" },
  { id: 2, label: "Close" },
  { id: 3, label: "Margin" },
  { id: 4, label: "Next" },
] as const;

export function Stepper({
  current,
  onJump,
}: {
  current: 1 | 2 | 3 | 4;
  onJump: (step: 1 | 2 | 3 | 4) => void;
}) {
  return (
    <ol className="flex w-full items-center gap-2 sm:gap-3">
      {steps.map((s, i) => {
        const state =
          s.id < current ? "done" : s.id === current ? "active" : "todo";
        const reachable = s.id <= current;
        return (
          <li key={s.id} className="flex flex-1 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => reachable && onJump(s.id as 1 | 2 | 3 | 4)}
              disabled={!reachable}
              aria-current={state === "active" ? "step" : undefined}
              className={cn(
                "group flex flex-1 items-center gap-2 text-left transition-colors",
                reachable ? "cursor-pointer" : "cursor-not-allowed",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "inline-flex h-5 w-5 flex-none items-center justify-center rounded-full font-mono text-[10px] ring-1 transition-colors",
                  state === "done" &&
                    "bg-accent text-accent-fg ring-accent",
                  state === "active" &&
                    "bg-accent/15 text-accent ring-accent/40",
                  state === "todo" &&
                    "bg-bg-subtle text-faint ring-border",
                )}
              >
                {state === "done" ? (
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
                ) : (
                  s.id
                )}
              </span>
              <span
                className={cn(
                  "hidden font-mono text-[11px] uppercase tracking-eyebrow sm:inline",
                  state === "active"
                    ? "text-primary"
                    : state === "done"
                      ? "text-muted"
                      : "text-faint",
                )}
              >
                {s.label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "h-px flex-1 transition-colors",
                  s.id < current ? "bg-accent/60" : "bg-border",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
