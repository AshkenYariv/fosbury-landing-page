import { cn } from "@/lib/cn";

/** Fosbury wordmark — small geometric mark + name. Pure CSS, no asset request. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 select-none", className)}>
      <span
        aria-hidden
        className="relative inline-flex h-5 w-5 items-center justify-center rounded-md bg-primary"
      >
        <span className="h-1 w-1 rounded-full bg-bg" />
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-primary">
        Fosbury
      </span>
    </span>
  );
}
