import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Reveal } from "@/components/primitives/Reveal";
import { copy } from "@/content/copy";

export function MetricsRow() {
  return (
    <section className="border-b border-border py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mb-12 text-center">
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted">
            {copy.outcomes.eyebrow}
          </p>
        </Reveal>
        <ul className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {copy.outcomes.items.map((m, i) => (
            <Reveal as="article" key={i} delay={i * 0.08}>
              <li className="text-center">
                <p className="text-display-lg font-medium tracking-tight text-primary">
                  <AnimatedNumber
                    value={m.value}
                    prefix={"prefix" in m ? m.prefix : undefined}
                    suffix={"suffix" in m ? m.suffix : undefined}
                  />
                </p>
                <p className="mx-auto mt-3 max-w-[26ch] font-mono text-[12px] uppercase tracking-eyebrow text-muted">
                  {m.caption}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
