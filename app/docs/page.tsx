import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Fosbury documentation.",
  robots: { index: false, follow: false },
};

export default function DocsPage() {
  return (
    <ComingSoon
      eyebrow="Docs"
      title="Documentation."
      description="A reference for operators, integrators, and finance leads is being written."
    />
  );
}
