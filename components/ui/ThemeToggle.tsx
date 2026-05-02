"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");
  const next = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label={`Switch to ${next} theme`}
      onClick={() => setTheme(next)}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full text-muted ring-1 ring-inset ring-border transition-colors hover:bg-primary/5 hover:text-primary",
        className,
      )}
      suppressHydrationWarning
    >
      <span className="sr-only">Toggle theme</span>
      {/* Sun (visible in dark) */}
      <svg
        viewBox="0 0 16 16"
        width="16"
        height="16"
        aria-hidden="true"
        className={cn("absolute transition-opacity", isDark ? "opacity-100" : "opacity-0")}
      >
        <circle cx="8" cy="8" r="3" fill="currentColor" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1="8"
            y1="1.5"
            x2="8"
            y2="3"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            transform={`rotate(${deg} 8 8)`}
          />
        ))}
      </svg>
      {/* Moon (visible in light) */}
      <svg
        viewBox="0 0 16 16"
        width="16"
        height="16"
        aria-hidden="true"
        className={cn("absolute transition-opacity", isDark ? "opacity-0" : "opacity-100")}
      >
        <path
          d="M11.5 9.5A4.5 4.5 0 0 1 6.5 4.5c0-.7.16-1.36.44-1.94A5.5 5.5 0 1 0 13.44 9.06c-.58.28-1.24.44-1.94.44Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}
