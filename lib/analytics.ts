/**
 * Umami analytics helpers.
 *
 * - `trackEvent(name, data?)` — fire a custom event.
 * - Naming convention: `<action>_<subject>[_<modifier>]` in snake_case
 *   (e.g. `click_hero_primary_cta_book_demo`, `click_nav_cta_book_demo`,
 *   `click_pricing_plan_operator_book_demo`).
 *
 * Safe to call before the script loads or during SSR. Calls made before
 * `window.umami` is ready are queued and replayed once the script attaches,
 * so we don't lose events from users who click immediately after landing.
 */

export type EventData = Record<
  string,
  string | number | boolean | null | undefined
>;

declare global {
  interface Window {
    umami?: {
      track: (name?: string, data?: EventData) => void;
    };
  }
}

type QueuedCall = { name: string; data?: EventData };

const queue: QueuedCall[] = [];
let pollHandle: ReturnType<typeof setInterval> | null = null;

function flush() {
  if (typeof window === "undefined" || !window.umami?.track) return;
  while (queue.length) {
    const call = queue.shift()!;
    try {
      window.umami.track(call.name, call.data);
    } catch {
      // analytics must never break UX
    }
  }
}

function startPolling() {
  if (pollHandle !== null || typeof window === "undefined") return;
  let attempts = 0;
  pollHandle = setInterval(() => {
    attempts += 1;
    if (window.umami?.track) {
      flush();
      if (pollHandle !== null) clearInterval(pollHandle);
      pollHandle = null;
      return;
    }
    // Give up after ~30s (150 * 200ms) — script is blocked or failing.
    if (attempts > 150) {
      if (pollHandle !== null) clearInterval(pollHandle);
      pollHandle = null;
      queue.length = 0;
    }
  }, 200);
}

export function trackEvent(name: string, data?: EventData): void {
  if (typeof window === "undefined") return;
  if (window.umami?.track) {
    try {
      window.umami.track(name, data);
    } catch {
      // analytics must never break UX
    }
    return;
  }
  queue.push({ name, data });
  startPolling();
}
