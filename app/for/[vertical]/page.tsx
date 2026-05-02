import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/ui/ComingSoon";

const VERTICALS = {
  "consumer-brands": {
    title: "Fosbury for consumer brands.",
    description:
      "The AI-native ERP built for DTC, retail, and channel-led consumer companies.",
  },
  manufacturing: {
    title: "Fosbury for manufacturing.",
    description:
      "Standard cost, work orders, and shop-floor margin truth on a perpetual ledger.",
  },
  distribution: {
    title: "Fosbury for distribution.",
    description:
      "Multi-warehouse inventory, freight, and landed cost reconciled to the GL nightly.",
  },
  "medical-devices": {
    title: "Fosbury for medical devices.",
    description:
      "Lot, serial, and quality-controlled inventory with audit-ready close.",
  },
} as const;

type Vertical = keyof typeof VERTICALS;

export function generateStaticParams() {
  return (Object.keys(VERTICALS) as Vertical[]).map((vertical) => ({ vertical }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: { vertical: string };
}): Promise<Metadata> {
  const v = VERTICALS[params.vertical as Vertical];
  if (!v) return { title: "Not found" };
  return {
    title: v.title,
    description: v.description,
    robots: { index: false, follow: false },
  };
}

export default function VerticalPage({
  params,
}: {
  params: { vertical: string };
}) {
  const v = VERTICALS[params.vertical as Vertical];
  if (!v) notFound();
  return (
    <ComingSoon
      eyebrow="Vertical"
      title={v.title}
      description={v.description}
    />
  );
}
