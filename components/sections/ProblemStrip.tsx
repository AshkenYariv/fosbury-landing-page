import { Reveal } from "@/components/primitives/Reveal";
import { MonoNumeral } from "@/components/ui/MonoNumeral";
import { copy } from "@/content/copy";

export function ProblemStrip() {
  return (
    <section className="border-y border-border bg-bg-subtle/60 py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <ul className="space-y-10">
          {copy.problem.statements.map((s, i) => (
            <Reveal key={i} as="article" delay={i * 0.1}>
              <li className="grid grid-cols-[auto_1fr] items-start gap-x-8 sm:gap-x-12">
                <div className="flex items-baseline gap-1">
                  <MonoNumeral className="text-display-md font-medium text-primary">
                    {s.numeral}
                  </MonoNumeral>
                  <MonoNumeral className="text-[13px] uppercase tracking-eyebrow text-faint">
                    {s.unit}
                  </MonoNumeral>
                </div>
                <p className="max-w-xl text-balance text-[17px] leading-relaxed text-muted sm:text-[19px]">
                  {s.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-14 border-t border-border pt-8 text-center" delay={0.3}>
          <p className="font-serif text-[20px] italic text-primary sm:text-[22px]">
            {copy.problem.closing}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
