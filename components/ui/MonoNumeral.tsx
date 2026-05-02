import { cn } from "@/lib/cn";

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode;
};

export function MonoNumeral({ children, className, ...rest }: Props) {
  return (
    <span className={cn("font-mono tabular tracking-tight", className)} {...rest}>
      {children}
    </span>
  );
}
