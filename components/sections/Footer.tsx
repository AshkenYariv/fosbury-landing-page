import { Wordmark } from "@/components/ui/Wordmark";
import { copy } from "@/content/copy";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted">
            The AI-native ERP for modern consumer brands. One ledger, one truth.
          </p>
        </div>

        <div className="mt-14 border-t border-border pt-6">
          <p className="font-mono text-[11px] text-faint">{copy.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
