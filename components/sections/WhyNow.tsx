import { Reveal } from "@/components/primitives/Reveal";
import { copy } from "@/content/copy";

export function WhyNow() {
  return (
    <section className="border-b border-border py-32 sm:py-40">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <p className="mb-8 font-mono text-[11px] uppercase tracking-eyebrow text-muted">
            {copy.whyNow.eyebrow}
          </p>
          <p
            className="text-balance font-serif text-[22px] italic leading-[1.45] text-primary sm:text-[26px]"
            style={{ maxWidth: "80ch", marginInline: "auto" }}
          >
            {copy.whyNow.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
