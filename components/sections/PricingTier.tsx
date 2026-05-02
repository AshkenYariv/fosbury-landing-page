import { ButtonLink } from "@/components/ui/Button";
import type { PricingTier as Tier } from "@/content/pricing";
import { copy, BOOK_DEMO_URL } from "@/content/copy";
import { cn } from "@/lib/cn";

export function PricingTier({ tier }: { tier: Tier }) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl bg-surface p-7 ring-1 transition-colors",
        tier.highlighted
          ? "ring-accent/50 shadow-glass-light dark:shadow-glass"
          : "ring-border hover:ring-border-strong",
      )}
    >
      <header>
        <div className="flex items-center justify-between">
          <h3 className="text-[20px] font-medium tracking-tight text-primary">
            {tier.name}
          </h3>
          {tier.highlighted && (
            <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-eyebrow text-accent">
              Most adopted
            </span>
          )}
        </div>
        <p className="mt-1 text-[13px] text-muted">For {tier.fit}</p>
      </header>

      <p className="mt-6 font-mono text-[13px] uppercase tracking-eyebrow text-faint">
        {tier.priceLine}
      </p>
      <p className="mt-3 text-balance text-[14px] leading-relaxed text-muted">
        {tier.description}
      </p>

      <ul className="mt-7 flex-1 space-y-2.5 border-t border-border pt-6">
        {tier.features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-2.5 text-[13px] leading-relaxed text-primary"
          >
            <svg
              viewBox="0 0 16 16"
              width="14"
              height="14"
              aria-hidden="true"
              className="mt-1 flex-none text-accent"
            >
              <path
                d="M3 8.5L6.5 12 13 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <ButtonLink
        href={BOOK_DEMO_URL}
        target="_blank"
        rel="noopener noreferrer"
        variant={tier.highlighted ? "primary" : "subtle"}
        size="md"
        className="mt-8 w-full"
        track={`click_pricing_plan_${tier.id}_book_demo`}
      >
        {copy.pricing.cta}
      </ButtonLink>
    </article>
  );
}
