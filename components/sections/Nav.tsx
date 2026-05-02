"use client";

import { useEffect, useState } from "react";
import { Wordmark } from "@/components/ui/Wordmark";
import { ButtonLink } from "@/components/ui/Button";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { copy, BOOK_DEMO_URL } from "@/content/copy";
import { cn } from "@/lib/cn";

/** Build a stable, snake_case event name from a nav-item label. */
const navEvent = (label: string) =>
  `click_nav_${label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_link`;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-200",
        scrolled
          ? "border-b border-border/70 bg-bg/80 backdrop-blur-glass"
          : "bg-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 max-w-7xl items-center px-6"
      >
        <TrackedLink
          href="/"
          aria-label="Fosbury — home"
          track="click_nav_logo_home"
        >
          <Wordmark />
        </TrackedLink>
        <ul className="ml-10 hidden items-center gap-7 md:flex">
          {copy.nav.items.map((item) => (
            <li key={item.label}>
              <TrackedLink
                href={item.href}
                track={navEvent(item.label)}
                className="text-[14px] text-muted transition-colors hover:text-primary"
              >
                {item.label}
              </TrackedLink>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle className="relative" />
          <ButtonLink
            href={BOOK_DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            track="click_nav_cta_book_demo"
          >
            {copy.nav.cta.label}
          </ButtonLink>
        </div>
      </nav>
    </header>
  );
}
