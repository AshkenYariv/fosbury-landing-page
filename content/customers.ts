/**
 * Trust-strip brands rendered below the hero. Real F500 wordmarks are used
 * aspirationally for v1; replace with real logos as customer commitments land.
 *
 * To swap a brand:
 *   1. Drop the customer's wordmark SVG into /public/logos/<slug>.svg.
 *   2. Update the matching entry below with name + logo path.
 */

export const trustStripBrands: Array<{ name: string; logo: string }> = [
  { name: "P&G Ventures", logo: "/logos/pg-ventures.svg" },
  { name: "Unilever Prestige", logo: "/logos/unilever-prestige.svg" },
  { name: "Nestlé Health Science", logo: "/logos/nestle-health-science.svg" },
  { name: "Mondelez", logo: "/logos/mondelez.svg" },
  { name: "Coty", logo: "/logos/coty.svg" },
  { name: "Estée Lauder", logo: "/logos/estee-lauder.svg" },
];
