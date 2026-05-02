import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive demo",
  description: "A 90-second walkthrough of running a modern consumer brand on Fosbury.",
  robots: { index: false, follow: false },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
