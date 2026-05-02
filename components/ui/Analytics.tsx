import Script from "next/script";

/**
 * Umami analytics. Auto-tracks pageviews on initial load and on SPA route
 * changes (the script hooks history.pushState/replaceState, which Next.js
 * App Router uses for client-side navigation).
 *
 * Custom events go through `trackEvent()` in lib/analytics.ts.
 */
const UMAMI_SRC = "https://cloud.umami.is/script.js";
const UMAMI_WEBSITE_ID =
  process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ??
  "4091c37b-0667-4e75-afd2-15874c002962";

export function Analytics() {
  return (
    <Script
      src={UMAMI_SRC}
      data-website-id={UMAMI_WEBSITE_ID}
      strategy="afterInteractive"
      defer
    />
  );
}
