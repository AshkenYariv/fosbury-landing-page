import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/primitives/Reveal";
import { copy, BOOK_DEMO_URL } from "@/content/copy";

export function FooterCTA() {
  return (
    <section className="relative isolate overflow-hidden bg-primary text-bg">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 30%, rgb(var(--accent) / 0.4), transparent 65%)",
        }}
      />
      <Reveal className="mx-auto max-w-4xl px-6 py-32 text-center sm:py-40">
        <p className="text-balance text-display-md font-medium tracking-tight">
          {copy.footerCta.body}
        </p>
        <div className="mt-10 flex justify-center">
          <ButtonLink
            href={BOOK_DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            className="bg-bg text-primary hover:bg-bg/90"
            track="click_footer_cta_book_demo"
          >
            {copy.footerCta.cta}
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
