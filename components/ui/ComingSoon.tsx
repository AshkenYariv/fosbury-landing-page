import Link from "next/link";
import { ButtonLink } from "./Button";

type Props = {
  /** small caps eyebrow displayed above the title */
  eyebrow?: string;
  title: string;
  /** one-line description */
  description?: string;
};

export function ComingSoon({ eyebrow, title, description }: Props) {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-32 text-center"
    >
      <div className="mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary"
          aria-label="Fosbury — back to home"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path
              d="M9.5 12L5.5 8l4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Fosbury
        </Link>
      </div>
      {eyebrow && (
        <p className="mb-4 font-mono text-xs uppercase tracking-eyebrow text-muted">
          {eyebrow}
        </p>
      )}
      <h1 className="text-display-md font-medium tracking-tight">{title}</h1>
      {description && (
        <p className="mt-5 max-w-xl text-balance text-base text-muted sm:text-lg">
          {description}
        </p>
      )}
      <div className="mt-10 flex items-center gap-3">
        <ButtonLink href="/" variant="ghost" size="md">
          Back to overview
        </ButtonLink>
      </div>
    </main>
  );
}
