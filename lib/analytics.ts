/**
 * Umami analytics helpers.
 *
 * - `trackEvent(name, data?)` — fire a custom event.
 * - Naming convention: `<action>_<subject>[_<modifier>]` in snake_case
 *   (e.g. `click_hero_primary_cta`, `submit_contact_form`,
 *   `click_pricing_plan_operator_book_demo`).
 *
 * Safe to call before the script loads or during SSR — calls are no-ops.
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

export function trackEvent(name: string, data?: EventData): void {
  if (typeof window === "undefined") return;
  try {
    window.umami?.track(name, data);
  } catch {
    // analytics must never break UX
  }
}
