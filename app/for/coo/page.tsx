import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = {
  title: "Fosbury for COOs.",
  description: "Operations and finance, telling the same story.",
  robots: { index: false, follow: false },
};

export default function COOPage() {
  return (
    <ComingSoon
      eyebrow="For COOs"
      title="Operations and finance on the same data model."
      description="Inventory, fulfillment, and supply, reconciled to the GL in real time. We're writing this page now."
    />
  );
}
