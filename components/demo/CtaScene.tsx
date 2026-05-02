"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { MonoNumeral } from "@/components/ui/MonoNumeral";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/primitives/Reveal";
import { BOOK_DEMO_URL } from "@/content/copy";

export function CtaScene({ onRestart }: { onRestart: () => void }) {
  return (
    <section className="mx-auto max-w-2xl">
      <Reveal>
        <GlassPanel className="px-6 py-10 text-center sm:px-10 sm:py-14">
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted">
            That&apos;s the loop
          </p>
          <h1 className="mt-4 text-display-md font-medium tracking-tight text-primary">
            Connect once. Close in two days. Find the leaks every morning.
          </h1>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-muted">
            <li className="inline-flex items-baseline gap-1.5">
              <MonoNumeral className="text-[22px] font-medium text-primary">2</MonoNumeral>
              <span className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">
                days to close
              </span>
            </li>
            <li className="inline-flex items-baseline gap-1.5">
              <MonoNumeral className="text-[22px] font-medium text-primary">$2.4M</MonoNumeral>
              <span className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">
                margin protected / quarter
              </span>
            </li>
            <li className="inline-flex items-baseline gap-1.5">
              <MonoNumeral className="text-[22px] font-medium text-primary">4</MonoNumeral>
              <span className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">
                weeks to go-live
              </span>
            </li>
          </ul>

          <p className="mx-auto mt-8 max-w-md text-[14px] leading-relaxed text-muted">
            See the same flow run on your stack. We&apos;ll wire up Shopify, your 3PL, and your
            ERP in advance and walk you through{" "}
            <span className="text-primary">your numbers</span>, live.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <ButtonLink
              href={BOOK_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              track="demo_final_cta_book_demo"
            >
              Book a 30-min walkthrough with your data
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path
                  d="M5 3.5L9.5 8 5 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </ButtonLink>
            <button
              type="button"
              onClick={onRestart}
              className="font-mono text-[11px] uppercase tracking-eyebrow text-faint transition-colors hover:text-muted"
            >
              ← Restart demo
            </button>
          </div>
        </GlassPanel>
      </Reveal>
    </section>
  );
}
