"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    umami?: {
      track: (
        eventName: string,
        eventData?: Record<string, unknown>,
      ) => void;
    };
  }
}

export default function VisitTracker() {
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 40;
    const interval = window.setInterval(() => {
      attempts += 1;
      if (window.umami) {
        window.umami.track("visit homepage");
        window.clearInterval(interval);
        return;
      }
      if (attempts >= maxAttempts) {
        window.clearInterval(interval);
      }
    }, 250);
    return () => window.clearInterval(interval);
  }, []);

  return null;
}
