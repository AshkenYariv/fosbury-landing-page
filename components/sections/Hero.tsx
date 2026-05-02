import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { CloseCockpit } from "@/components/mockups/CloseCockpit";
import { Reveal } from "@/components/primitives/Reveal";
import { copy, BOOK_DEMO_URL } from "@/content/copy";
import { trustStripBrands } from "@/content/customers";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-28 sm:pt-32">
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <div className="accent-glow pointer-events-none absolute inset-0 -z-10" aria-hidden />

      <div className="mx-auto max-w-7xl px-6">
        <Reveal as="header" className="mx-auto max-w-4xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted">
            {copy.hero.eyebrow}
          </p>
          <h1 className="mt-6 text-display-xl font-medium tracking-tight text-primary">
            {copy.hero.headline.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-balance text-[17px] leading-relaxed text-muted sm:text-[19px]">
            {copy.hero.subhead}
          </p>
          <div className="mt-9 flex items-center justify-center gap-3">
            <ButtonLink
              href={BOOK_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              track="click_hero_primary_cta_book_demo"
            >
              {copy.hero.primaryCta}
            </ButtonLink>
            <ButtonLink
              href={copy.hero.secondaryCtaHref}
              variant="ghost"
              size="lg"
              track="click_hero_secondary_cta_see_product"
            >
              {copy.hero.secondaryCta}
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
          </div>
        </Reveal>

        <Reveal className="mt-16 sm:mt-20" delay={0.15}>
          <div className="relative mx-auto flex w-full max-w-5xl justify-center">
            <CloseCockpit />
          </div>
        </Reveal>

        <Reveal className="mt-20 sm:mt-24" delay={0.2}>
          <p className="mb-6 text-center font-mono text-[11px] uppercase tracking-eyebrow text-muted">
            {copy.hero.trustEyebrow}
          </p>
          <ul className="mx-auto grid max-w-5xl grid-cols-2 items-center gap-x-8 gap-y-6 sm:grid-cols-3 md:grid-cols-6">
            {trustStripBrands.map((b) => (
              <li
                key={b.name}
                className="flex items-center justify-center text-faint hover:text-muted transition-colors"
              >
                <Image
                  src={b.logo}
                  alt={b.name}
                  width={140}
                  height={28}
                  className="h-6 w-auto opacity-70"
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
