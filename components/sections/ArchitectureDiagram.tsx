import { ArchitectureFlow } from "@/components/mockups/ArchitectureFlow";
import { Reveal } from "@/components/primitives/Reveal";
import { copy } from "@/content/copy";

export function ArchitectureDiagram() {
  return (
    <section className="border-b border-border py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted">
            {copy.architecture.eyebrow}
          </p>
          <h2 className="mt-4 text-display-md font-medium tracking-tight text-primary">
            {copy.architecture.title}
          </h2>
        </Reveal>

        <Reveal className="mt-12" delay={0.1}>
          <ArchitectureFlow />
        </Reveal>

        <Reveal className="mx-auto mt-10 max-w-2xl text-center" delay={0.2}>
          <p className="text-balance text-[16px] leading-relaxed text-muted sm:text-[17px]">
            {copy.architecture.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
