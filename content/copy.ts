/**
 * Every visible string on the landing page lives here. Swap headlines, A/B test,
 * or rewrite verticals without touching JSX.
 */

export const BOOK_DEMO_URL =
  process.env.NEXT_PUBLIC_BOOK_DEMO_URL ||
  "https://calendly.com/ashkenazy-jariv/fosbury-intro";

export const copy = {
  meta: {
    title: "Fosbury — The AI-native ERP for modern consumer brands.",
    description:
      "Fosbury unifies your general ledger and inventory ledger on one AI-native data model. Close in two days. Know your margin every morning.",
    ogAlt:
      "Fosbury — close in two days, know your margin every morning. Product mockup of the close cockpit.",
  },

  nav: {
    items: [
      { label: "Product", href: "/#product" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Demo", href: "/demo" },
    ],
    cta: { label: "Book a demo" },
  },

  hero: {
    eyebrow: "The AI-native ERP for modern consumer brands",
    headline: ["Close in two days.", "Know your margin every morning."],
    subhead:
      "Fosbury unifies your general ledger and inventory ledger on one AI-native data model — so finance and operations finally tell the same story.",
    primaryCta: "Book a demo",
    secondaryCta: "See the product",
    secondaryCtaHref: "#product",
    trustEyebrow: "Trusted by the operators behind",
  },

  problem: {
    statements: [
      {
        numeral: "25",
        unit: "days",
        body: "How long your close takes when COGS, landed cost, and inventory variance never reconcile.",
      },
      {
        numeral: "2",
        unit: "dashboards",
        body: "Finance trusts the GL. Operations trusts the WMS. Neither matches.",
      },
      {
        numeral: "6",
        unit: "tools",
        body: "QuickBooks, a 3PL portal, three spreadsheets, and a CFO who works Sundays.",
      },
    ],
    closing: "Modern consumer brands grew up. The software underneath them didn't.",
  },

  product: {
    eyebrow: "Product",
    title: "One ledger. One truth. One set of agents.",
    sections: [
      {
        id: "perpetual-ledger",
        kicker: "01",
        headline: "The Perpetual Ledger.",
        body: "A general ledger that posts in real time as inventory, orders, and fulfillment events happen — not at month-end. Journal entries auto-generate from Shopify, your 3PL, and contract manufacturers, all reconciling to GL in one view.",
      },
      {
        id: "sku-margin",
        kicker: "02",
        headline: "SKU-Level Margin Truth.",
        body: "Daily gross margin by SKU, channel, and cohort. Landed cost allocated automatically across freight, duty, and handling. Anomalies surface before your category leads ask.",
      },
      {
        id: "operating-agents",
        kicker: "03",
        headline: "Operating Agents.",
        body: "Specialized agents for the close — inventory reconciliation, three-way match, revenue recognition, flux analysis. Each runs on the same data model the GL sits on, with full approval and audit trail.",
      },
    ],
  },

  outcomes: {
    eyebrow: "What changes",
    items: [
      { value: 2, suffix: " days", caption: "Average close time across customers" },
      { value: 94, suffix: "%", caption: "Reduction in manual journal entries" },
      { value: 4, suffix: " weeks", caption: "Time to go-live" },
      { value: 0, prefix: "$", caption: "Implementation fee" },
    ],
  },

  architecture: {
    eyebrow: "The operator's stack",
    title: "Fosbury sits beneath the tools you already run.",
    body: "We replace the spreadsheet seam between your operations and your finance team. Everything else in your stack stays.",
    nodes: {
      sources: [
        { label: "Shopify", category: "Channel" },
        { label: "Amazon", category: "Channel" },
        { label: "Stripe", category: "Payments" },
        { label: "Ramp", category: "Spend" },
        { label: "3PL", category: "Fulfillment" },
        { label: "Contract Mfr", category: "Supply" },
      ],
      replaces: { label: "NetSuite", note: "replaced" },
      center: { label: "Fosbury", note: "perpetual ledger · agents" },
    },
  },

  whyNow: {
    eyebrow: "Why now",
    body: "Consumer brands were rebuilt for the internet — direct relationships, daily data, instant feedback loops. Their financial systems weren't. We're building the substrate the next generation of physical-product companies will run on: one ledger, one truth, one set of agents that already know your business by Monday morning.",
  },

  pricing: {
    eyebrow: "Pricing",
    title: "We charge for outcomes, not seats.",
    footnote:
      "Your finance team should grow because the business does — not because the software taxed it.",
    cta: "Book a demo",
  },

  footerCta: {
    body: "Run your business on the same system your numbers already wish you used.",
    cta: "Book a demo",
  },

  footer: {
    legalLinks: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Status", href: "https://status.fosbury.ai" },
    ],
    soc2: "SOC 2 Type II",
    copyright: `© ${new Date().getFullYear()} Fosbury, Inc.`,
  },
} as const;

export type Copy = typeof copy;
