"use client";

import { forwardRef } from "react";
import { trackEvent, type EventData } from "@/lib/analytics";

type TrackProps = {
  /** Umami event name, e.g. "Request Access - Hero" */
  track: string;
  /** Optional metadata to send with the event */
  trackData?: EventData;
};

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & TrackProps;

/** Plain `<a>` with click tracking. Use for in-page anchors and external URLs. */
export const TrackedAnchor = forwardRef<HTMLAnchorElement, AnchorProps>(
  ({ track, trackData, onClick, ...rest }, ref) => (
    <a
      ref={ref}
      onClick={(e) => {
        trackEvent(track, trackData);
        onClick?.(e);
      }}
      {...rest}
    />
  ),
);
TrackedAnchor.displayName = "TrackedAnchor";

type LogoLinkProps = TrackProps & {
  children: React.ReactNode;
  className?: string;
};

/** Logo / home link: tracks the click, then smooth-scrolls to top. */
export function LogoLink({ track, trackData, children, className }: LogoLinkProps) {
  return (
    <a
      href="/"
      aria-label="Fosbury home"
      onClick={(e) => {
        trackEvent(track, trackData);
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={className}
    >
      {children}
    </a>
  );
}
