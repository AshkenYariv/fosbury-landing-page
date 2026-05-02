import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { ProblemStrip } from "@/components/sections/ProblemStrip";
import { ProductSection } from "@/components/sections/ProductSection";
import { MetricsRow } from "@/components/sections/MetricsRow";
import { ArchitectureDiagram } from "@/components/sections/ArchitectureDiagram";
import { WhyNow } from "@/components/sections/WhyNow";
import { PricingTable } from "@/components/sections/PricingTable";
import { FooterCTA } from "@/components/sections/FooterCTA";
import { Footer } from "@/components/sections/Footer";
import { JournalLedger } from "@/components/mockups/JournalLedger";
import { MarginGrid } from "@/components/mockups/MarginGrid";
import { AgentFeed } from "@/components/mockups/AgentFeed";
import { copy } from "@/content/copy";

export default function HomePage() {
  const [ledger, margin, agents] = copy.product.sections;

  return (
    <>
      <Nav />
      <main id="main">
        <Hero />

        <ProblemStrip />

        <div id="product" className="scroll-mt-20">
          <ProductSection
            id={ledger.id}
            kicker={ledger.kicker}
            headline={ledger.headline}
            body={ledger.body}
            mockup={<JournalLedger />}
          />
          <ProductSection
            id={margin.id}
            kicker={margin.kicker}
            headline={margin.headline}
            body={margin.body}
            mockup={<MarginGrid />}
            reverse
          />
          <ProductSection
            id={agents.id}
            kicker={agents.kicker}
            headline={agents.headline}
            body={agents.body}
            mockup={<AgentFeed />}
          />
        </div>

        <MetricsRow />
        <ArchitectureDiagram />
        <WhyNow />
        <PricingTable />
        <FooterCTA />
      </main>
      <Footer />
    </>
  );
}
