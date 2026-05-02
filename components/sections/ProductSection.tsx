import { Reveal } from "@/components/primitives/Reveal";
import { MonoNumeral } from "@/components/ui/MonoNumeral";
import { cn } from "@/lib/cn";

type Props = {
  id: string;
  kicker: string;
  headline: string;
  body: string;
  /** The mockup component is passed in so the section is layout-only. */
  mockup: React.ReactNode;
  /** When true, mockup renders left and copy renders right (alternating). */
  reverse?: boolean;
};

export function ProductSection({
  id,
  kicker,
  headline,
  body,
  mockup,
  reverse,
}: Props) {
  return (
    <section
      id={id}
      className="scroll-mt-20 border-b border-border py-28 sm:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20">
        <Reveal className={cn(reverse ? "lg:order-2" : undefined)}>
          <div className="max-w-lg">
            <MonoNumeral className="text-[11px] uppercase tracking-eyebrow text-faint">
              {kicker}
            </MonoNumeral>
            <h2 className="mt-3 text-display-md font-medium tracking-tight text-primary">
              {headline}
            </h2>
            <p className="mt-5 text-balance text-[17px] leading-relaxed text-muted sm:text-[18px]">
              {body}
            </p>
          </div>
        </Reveal>
        <Reveal
          className={cn("relative", reverse ? "lg:order-1" : undefined)}
          delay={0.1}
        >
          {mockup}
        </Reveal>
      </div>
    </section>
  );
}
