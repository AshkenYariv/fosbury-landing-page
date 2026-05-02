"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { trackEvent, type EventData } from "@/lib/analytics";

type Variant = "primary" | "ghost" | "subtle";
type Size = "sm" | "md" | "lg";

type TrackProps = {
  /** Umami event name, e.g. "click_hero_primary_cta" */
  track?: string;
  /** Optional metadata to send with the event */
  trackData?: EventData;
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  TrackProps & {
    variant?: Variant;
    size?: Size;
    asChild?: never;
  };

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  TrackProps & {
    variant?: Variant;
    size?: Size;
    href: string;
  };

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-fg hover:bg-accent/90 ring-1 ring-inset ring-white/10",
  ghost:
    "bg-transparent text-primary hover:bg-primary/5 ring-1 ring-inset ring-border-strong/60",
  subtle:
    "bg-surface text-primary hover:bg-surface-elevated ring-1 ring-inset ring-border",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-5 text-[15px]",
  lg: "h-11 px-6 text-[15px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", track, trackData, onClick, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      onClick={(e) => {
        if (track) trackEvent(track, trackData);
        onClick?.(e);
      }}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  track,
  trackData,
  onClick,
  ...props
}: AnchorProps) {
  return (
    <a
      className={cn(base, variants[variant], sizes[size], className)}
      onClick={(e) => {
        if (track) trackEvent(track, trackData);
        onClick?.(e);
      }}
      {...props}
    />
  );
}
