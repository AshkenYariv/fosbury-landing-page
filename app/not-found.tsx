import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <ComingSoon
      eyebrow="404"
      title="That page doesn't exist."
      description="Try the overview, or send us a note if you were expecting something here."
    />
  );
}
