import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = {
  title: "Fosbury for CFOs.",
  description: "Close in two days. Know your margin every morning.",
  robots: { index: false, follow: false },
};

export default function CFOPage() {
  return (
    <ComingSoon
      eyebrow="For CFOs"
      title="A close cycle that keeps up with the business."
      description="Numbers your team can ship to the board on Monday morning. We're writing this page now."
    />
  );
}
