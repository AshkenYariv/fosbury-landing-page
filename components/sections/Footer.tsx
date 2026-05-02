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
          <div className="mt-6 inline-flex items-center gap-2 rounded-md bg-bg-subtle px-2.5 py-1.5 ring-1 ring-border">
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" className="text-positive">
              <path
                d="M3 8.5L6.5 12 13 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted">
              {copy.footer.soc2}
            </span>
          </div>
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
