"use client";

import { TrackedLink } from "@/components/ui/TrackedLink";
import { Wordmark } from "@/components/ui/Wordmark";
import { copy } from "@/content/copy";

/** Build a stable, snake_case event name for footer link clicks. */
const footerEvent = (column: string, label: string) =>
  `click_footer_${column}_${label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")}_link`;

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted">
            The AI-native ERP for modern consumer brands. One ledger, one truth.
          </p>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] text-faint">{copy.footer.copyright}</p>
          <ul className="flex items-center gap-5">
            {copy.footer.legalLinks.map((l) => (
              <li key={l.label}>
                <TrackedLink
                  href={l.href}
                  track={footerEvent("legal", l.label)}
                  className="text-[12px] text-faint transition-colors hover:text-muted"
                >
                  {l.label}
                </TrackedLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
