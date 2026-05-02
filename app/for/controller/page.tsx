import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = {
  title: "Fosbury for controllers.",
  description: "A clean audit trail and a close that doesn't run your weekends.",
  robots: { index: false, follow: false },
};

export default function ControllerPage() {
  return (
    <ComingSoon
      eyebrow="For controllers"
      title="A close that doesn't run your weekends."
      description="Auto-posted journals, full audit trail, three-way match agents. We're writing this page now."
    />
  );
}
