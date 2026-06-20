import { NextResponse } from "next/server"
import { isValidEmail, normalizeUrl } from "@/lib/validate"
import { upsertSignup, type Provider } from "@/lib/db"

// We touch the filesystem, so force the Node.js runtime (not edge).
export const runtime = "nodejs"

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 })
  }

  const b = (body ?? {}) as Record<string, unknown>
  const email = typeof b.email === "string" ? b.email : ""
  const rawUrl = typeof b.url === "string" ? b.url : ""
  const provider: Provider = b.provider === "google" ? "google" : "email"

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 },
    )
  }

  const url = rawUrl.trim() ? normalizeUrl(rawUrl) : undefined

  try {
    const { created, row } = await upsertSignup({ email, url, provider })
    return NextResponse.json({
      ok: true,
      created,
      alreadyExists: !created,
      email: row.email,
    })
  } catch (err) {
    console.error("[signup] failed to store signup:", err)
    return NextResponse.json(
      { ok: false, error: "Something broke on our end — try again?" },
      { status: 500 },
    )
  }
}
