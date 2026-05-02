"use client";

import Link, { type LinkProps } from "next/link";
import { forwardRef } from "react";
import { trackEvent, type EventData } from "@/lib/analytics";

type Props = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    /** Umami event name, e.g. "click_nav_pricing_link" */
    track: string;
    trackData?: EventData;
    children: React.ReactNode;
  };

/**
 * Next.js Link with click tracking. Use for plain (non-button) navigation
 * links — the Button/ButtonLink primitives already accept `track` directly.
 */
export const TrackedLink = forwardRef<HTMLAnchorElement, Props>(
  ({ track, trackData, onClick, children, ...rest }, ref) => (
    <Link
      ref={ref}
      onClick={(e) => {
        trackEvent(track, trackData);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </Link>
  ),
);
TrackedLink.displayName = "TrackedLink";
