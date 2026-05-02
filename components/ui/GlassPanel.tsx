import { cn } from "@/lib/cn";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export function GlassPanel({ children, className, ...rest }: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-surface/80 ring-1 ring-border/80 backdrop-blur-glass",
        "shadow-glass-light dark:shadow-glass dark:bg-surface/70",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
