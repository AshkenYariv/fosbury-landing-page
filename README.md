# Fosbury — Landing Page

Series A marketing site for Fosbury, an AI-native ERP for modern consumer brands. Built as a single-page Next.js 14 app with stub routes for verticals/personas/docs so future pages can ship without rebuilding.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + CSS variables (light + dark, light is canonical)
- Framer Motion for scroll reveals, count-ups, and the architecture diagram
- `next-themes` for the theme toggle
- `@vercel/og` for dynamic OG images on Edge runtime
- Geist Sans + Mono via the `geist` package (zero-CLS, self-hosted)

## Quick start

```bash
cp .env.example .env.local        # edit values
npm install
npm run dev                       # http://localhost:3000
```

Other scripts:

```bash
npm run build       # production build (Lighthouse target)
npm run start       # serve production build
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
```

## Environment

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used in metadata, sitemap, JSON-LD, OG. |
| `NEXT_PUBLIC_BOOK_DEMO_URL` | Where every "Book a demo" CTA points. Defaults to `https://calendly.com/ashkenazy-jariv/fosbury-intro`. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | When set, `<Analytics />` injects the Plausible script. Leave empty in dev. |

## Editing copy without touching JSX

Every visible string lives in `content/copy.ts`. Section components destructure what they need. Swap headlines, eyebrows, and CTAs there to A/B test without code changes. Customers and pricing have their own files:

- `content/copy.ts` — page-wide strings, plus the `BOOK_DEMO_URL` constant
- `content/customers.ts` — trust-strip brand list (logos rendered below the hero)
- `content/pricing.ts` — three tiers, features, fit ranges

## Trust-strip logos

v1 ships with **illustrative logos**: real F500 wordmarks (P&G Ventures, Unilever Prestige, Nestlé Health Science, Mondelez, Coty, Estée Lauder) used aspirationally as placeholders. Swap in real customer logos as commitments land:

1. Drop the customer's wordmark SVG into `public/logos/<slug>.svg` (single-color, ~32px tall, viewBox-bounded).
2. Update the matching entry in `content/customers.ts` (`name` + `logo` path).

## Theme

- Light is the canonical default (`#FAFAF7`). Dark mirrors Linear's low-contrast elegance (`#0E0E0F`).
- Tokens live in `app/globals.css` under `:root` and `.dark`. Tailwind maps semantic names (`bg-surface`, `text-primary`, `accent`, …) to those vars in `tailwind.config.ts` — there are **no `dark:` prefixes anywhere in JSX**.
- The single accent is violet (`#6E56CF`). Amber is **reserved exclusively** for anomaly states in the margin grid; do not reuse it elsewhere.

## OG images

Three pre-rendered variants live as static PNGs in `public/og/variant-{1,2,3}.png` so the static export works on GitHub Pages (no Edge runtime). `app/layout.tsx` references `variant-1` for both OpenGraph and Twitter cards.

- `variant=1` — "Close in two days."
- `variant=2` — "Know your margin every morning."
- `variant=3` — "The substrate beneath your stack."

To regenerate: temporarily restore the @vercel/og route on a local branch, run `next dev`, hit `/api/og?variant=N`, save the PNG over `public/og/variant-N.png`. The original PNGs were captured this way and stashed in `og-preview/` (gitignored).

## Routes

| Route | Status | Notes |
|---|---|---|
| `/` | Live | Single-page landing. |
| `/og/variant-{1,2,3}.png` | Static | Pre-rendered OG images. |
| `/docs` | Stub | `<ComingSoon>` + `noindex`. |
| `/for/[vertical]` | Stub (SSG) | `consumer-brands`, `manufacturing`, `distribution`, `medical-devices`. Anything else 404s. |
| `/for/cfo`, `/for/coo`, `/for/controller` | Stub | Persona pages, separate folders so each can diverge in structure. |
| `/sitemap.xml`, `/robots.txt` | Live | v1 sitemap lists only `/`. Stubs are `noindex` and excluded. |

## Demo CTA

Every "Book a demo" button — nav, hero, three pricing tiers, footer CTA — opens `BOOK_DEMO_URL` in a new tab. Default: the Fosbury Calendly link. Override via `NEXT_PUBLIC_BOOK_DEMO_URL`.

## Animation notes

- `<Reveal>` (`components/primitives/Reveal.tsx`) wraps motion.div with `whileInView` + `viewport={{ once: true, margin: '-10% 0px' }}`. Use it for scroll-triggered section reveals.
- `<StaggerList>` + `<StaggerItem>` for row-by-row animations (journal ledger, agent feed).
- `<AnimatedNumber>` for count-ups (metrics row, hero close-task progress).
- `prefers-reduced-motion` is honored globally via `useReducedMotion()` — all variants collapse to opacity-only.

## Future expansion (architected, not built)

- **Vertical pages** (`/for/*`) and **persona pages** (`/for/cfo`, etc.) have real routes today. To launch one, replace the `<ComingSoon>` with section components and remove `robots.index = false`. Add the URL to `app/sitemap.ts`.
- **Additional product sections** — duplicate `<ProductSection>` calls in `app/page.tsx` (e.g. Procurement, Demand Planning, AP/AR). The mockup component slot accepts any React node.
- **Customer stories** — when the first real wins land, add a `<CaseStudyGrid>` between `<MetricsRow>` and `<ArchitectureDiagram>`. The earlier scaffold is in git history if you want to bring it back.

## Verification

```bash
npm run typecheck   # passes clean
npm run lint        # passes clean
npm run build       # 14 routes generated, ~160KB First Load JS on /
```

Walking the page:

- Light mode → toggle to dark → verify both render. Theme persists via `localStorage`.
- Scroll through each section; mockup animations fire once per session (not on re-entry).
- macOS → System Settings → Accessibility → Reduce Motion → reload → confirm opacity-only fades.
- Click any "Book a demo" → opens the Calendly link in a new tab.
- `/for/nonsense` → 404. `/for/consumer-brands` → ComingSoon with `<meta name="robots" content="noindex,nofollow">`.
- View source on `/` → `<script type="application/ld+json">` includes `Organization`, `Product`, `WebSite`.

## What's intentionally not in v1

Per the brief's restraint clause: blog, learning center, multi-page marketing site, real video tour, JSON-LD `BreadcrumbList`, CMS integration, i18n, cookie banner. Add when there's a reason — not a maybe.
