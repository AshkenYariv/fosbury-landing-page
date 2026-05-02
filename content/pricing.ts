export type PricingTier = {
  id: "foundation" | "operator" | "platform";
  name: string;
  fit: string;
  /** Anchor descriptor, not a price */
  priceLine: string;
  description: string;
  features: string[];
  /** Visually emphasized card */
  highlighted?: boolean;
};

export const tiers: PricingTier[] = [
  {
    id: "foundation",
    name: "Foundation",
    fit: "$5–25M revenue",
    priceLine: "Outcome-anchored",
    description:
      "Inventory-to-cash close, agents included. Tied to days-to-close reduction.",
    features: [
      "Perpetual ledger for orders, fulfillment, COGS",
      "SKU-level margin with landed-cost allocation",
      "Inventory reconciliation agent",
      "Three-way match agent",
    ],
  },
  {
    id: "operator",
    name: "Operator",
    fit: "$25–100M, multi-channel",
    priceLine: "Custom",
    description:
      "Adds procurement intelligence and demand planning on top of Foundation.",
    features: [
      "Everything in Foundation",
      "Procurement intelligence",
      "Demand planning agents",
      "Supplier scorecard automation",
      "Multi-channel margin attribution",
    ],
    highlighted: true,
  },
  {
    id: "platform",
    name: "Platform",
    fit: "$100M+, multi-entity",
    priceLine: "Talk to us",
    description: "The full operating system for multi-entity consumer brands.",
    features: [
      "Everything in Operator",
      "Multi-entity consolidation",
      "Custom agent development",
      "Dedicated solution architect",
      "Quarterly executive review",
      "99.95% uptime SLA",
    ],
  },
];
