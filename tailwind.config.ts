import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        "bg-subtle": "rgb(var(--bg-subtle) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-elevated": "rgb(var(--surface-elevated) / <alpha-value>)",
        primary: "rgb(var(--text) / <alpha-value>)",
        muted: "rgb(var(--text-muted) / <alpha-value>)",
        faint: "rgb(var(--text-faint) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        "border-strong": "rgb(var(--border-strong) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-subtle": "rgb(var(--accent-subtle) / <alpha-value>)",
        "accent-fg": "rgb(var(--accent-fg) / <alpha-value>)",
        anomaly: "rgb(var(--anomaly) / <alpha-value>)",
        "anomaly-subtle": "rgb(var(--anomaly-subtle) / <alpha-value>)",
        positive: "rgb(var(--positive) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        serif: ["ui-serif", "Georgia", "serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 8vw, 6rem)", { lineHeight: "0.95", letterSpacing: "-0.035em" }],
        "display-lg": ["clamp(2.75rem, 6vw, 4.5rem)", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
      },
      letterSpacing: {
        eyebrow: "0.18em",
      },
      boxShadow: {
        glass: "0 1px 0 rgb(255 255 255 / 0.04) inset, 0 24px 48px -24px rgb(0 0 0 / 0.18), 0 8px 16px -8px rgb(0 0 0 / 0.08)",
        "glass-light": "0 1px 0 rgb(255 255 255 / 0.6) inset, 0 24px 48px -24px rgb(15 15 20 / 0.12), 0 6px 14px -6px rgb(15 15 20 / 0.06)",
      },
      backdropBlur: {
        glass: "16px",
      },
    },
  },
  plugins: [],
};

export default config;
