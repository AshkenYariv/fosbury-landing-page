import { promises as fs } from "fs"
import path from "path"
import { normalizeEmail } from "@/lib/validate"

// ─────────────────────────────────────────────────────────────────────────────
// Simple local JSON "database" for captured signups. This is deliberately
// minimal — one file, read-modify-write — and is meant to be swapped for a real
// database later. The store lives in /data (gitignored) so we never commit
// captured emails.
// ─────────────────────────────────────────────────────────────────────────────

export type Provider = "google" | "email"

export type Signup = {
  email: string
  url?: string
  provider: Provider
  createdAt: string
}

const DB_PATH = path.join(process.cwd(), "data", "signups.json")

async function readDb(): Promise<Signup[]> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8")
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") return []
    throw err
  }
}

async function writeDb(rows: Signup[]): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
  await fs.writeFile(DB_PATH, JSON.stringify(rows, null, 2) + "\n", "utf8")
}

/**
 * Insert a signup, or return the existing one if this email is already stored.
 * Emails are never duplicated. If we already have the email but no URL on file,
 * a newly-provided URL is backfilled.
 */
export async function upsertSignup(input: {
  email: string
  url?: string
  provider: Provider
}): Promise<{ created: boolean; row: Signup }> {
  const email = normalizeEmail(input.email)
  const url = input.url?.trim() || undefined

  const rows = await readDb()
  const existing = rows.find((r) => r.email === email)

  if (existing) {
    if (!existing.url && url) {
      existing.url = url
      await writeDb(rows)
    }
    return { created: false, row: existing }
  }

  const row: Signup = {
    email,
    url,
    provider: input.provider,
    createdAt: new Date().toISOString(),
  }
  rows.push(row)
  await writeDb(rows)
  return { created: true, row }
}
