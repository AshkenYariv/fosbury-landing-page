"use client"

import { useState } from "react"

// ─────────────────────────────────────────────────────────────────────────────
// TODO: paste your real form endpoint here (Formspree / Tally / your own API).
// e.g. const ENDPOINT = "https://formspree.io/f/xxxxxxx"
const ENDPOINT = "" // ← leave empty to run in demo mode (logs + fake success)
// ─────────────────────────────────────────────────────────────────────────────

export async function submitEarlyAccess(payload: { email: string; url?: string }) {
  if (!ENDPOINT) {
    // Demo mode: no endpoint configured yet.
    console.log("[Driftwood] early-access signup (demo mode):", payload)
    await new Promise((r) => setTimeout(r, 650))
    return { ok: true as const }
  }
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    })
    return { ok: res.ok as boolean }
  } catch {
    return { ok: false as const }
  }
}

/** Headless early-access form state. The page styles its own markup. */
export function useEarlyAccess(getUrl?: () => string | undefined) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status === "loading") return
    setStatus("loading")
    const res = await submitEarlyAccess({ email, url: getUrl?.() })
    setStatus(res.ok ? "done" : "error")
  }

  return { email, setEmail, status, submit }
}
