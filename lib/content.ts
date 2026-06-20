// ─────────────────────────────────────────────────────────────────────────────
// CONTENT LAYER
// All landing-page copy + sections live here.
// Swap the product name in ONE place:
export const BRAND = "Fosbury"
// ─────────────────────────────────────────────────────────────────────────────

export const HERO = {
  headline: "Put $300 into ads. Watch it find what works.",
  sub: "Plug in your site. We test small across Google, Meta, Reddit and TikTok, then move your budget into whatever brings real signups — automatically. You never open an ad dashboard.",
  cta: "Start free",
  urlPlaceholder: "yourstartup.com",
  reassurance: "Free to start. No card. We never spend a cent without your go-ahead.",
}

export const POSITIONING =
  "Other AI marketing tools hand you 40 posts to publish. You still do the work, and still can't tell what's working. Here you approve once, and results come back in dollars."

export const FREE_SECTION = {
  kicker: "Free · live now",
  title: "Your first week of content, written while the autopilot warms up.",
  body: "Paste your URL and get ready-to-post launch content for Reddit, X and LinkedIn in about a minute — in your product's voice.",
  samplePost: {
    platform: "Reddit · r/SideProject",
    title: "I got tired of guessing which ads work, so I built an autopilot",
    body: "Spent two years burning budget on campaigns I couldn't read. So I made something that tests small, kills the losers in days, and only scales what brings real signups. No dashboards. Would love your honest take.",
  },
}

export type ChannelKey = "google" | "meta" | "reddit" | "tiktok" | "instagram"

export const CHANNELS: { key: ChannelKey; label: string }[] = [
  { key: "google", label: "Google" },
  { key: "meta", label: "Meta" },
  { key: "reddit", label: "Reddit" },
  { key: "tiktok", label: "TikTok" },
  { key: "instagram", label: "Instagram" },
]

export const STEPS = [
  { n: "01", title: "Plug in your site", body: "No setup, no tracking spec, no tag manager. Just your URL." },
  { n: "02", title: "We test small", body: "Tiny budgets across every channel. Losers get cut within days." },
  { n: "03", title: "Budget flows to winners", body: "You approve once. We pour spend into whatever brings signups." },
]

export const AUTOPILOT_SECTION = {
  kicker: "New",
  title: "Connect a budget. We turn it into customers.",
}

// Creative gallery — 2 winning (full color), 2 paused (desaturated).
export type Creative = {
  format: "TikTok video" | "Instagram post" | "Google search" | "Meta feed"
  status: "scaling" | "paused"
  headline: string
  metric: string
}

export const CREATIVES: Creative[] = [
  { format: "TikTok video", status: "scaling", headline: "POV: your ads run themselves", metric: "CPA $4.10 ↓" },
  { format: "Meta feed", status: "scaling", headline: "Stop publishing. Start converting.", metric: "CPA $5.80 ↓" },
  { format: "Instagram post", status: "paused", headline: "Marketing, but make it automatic", metric: "CPA $19.40 — cut" },
  { format: "Google search", status: "paused", headline: "AI ads tool for founders", metric: "CPA $22.10 — cut" },
]

export const EARLY_ACCESS = {
  kicker: "Early access",
  title: "Want the autopilot first?",
  body: "We onboard founders in small batches. Drop your email for the next one.",
  cta: "Get early access",
  placeholder: "you@startup.com",
  success: "You're on the list. We'll email you when the next batch opens — no spam, just one note.",
}

export const FOOTER_LINE = `${BRAND} — built by founders who hated ad dashboards.`
