import { Reveal } from "@/components/primitives/Reveal";
import { PricingTier } from "./PricingTier";
import { tiers } from "@/content/pricing";
import { copy } from "@/content/copy";

export function PricingTable() {
  return (
    <section
      id="pricing"
      className="scroll-mt-20 border-b border-border py-28 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted">
            {copy.pricing.eyebrow}
          </p>
          <h2 className="mt-4 text-display-md font-medium tracking-tight text-primary">
            {copy.pricing.title}
          </h2>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-eyebrow text-accent ring-1 ring-accent/30">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            {copy.pricing.note}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.06}>
              <PricingTier tier={t} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center" delay={0.2}>
          <p className="mx-auto max-w-xl text-[12px] leading-relaxed text-faint">
            {copy.pricing.footnote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
