// Shared validation helpers, safe to import on both client and server.

/**
 * Format-validate an email. We can't truly verify deliverability without
 * sending a confirmation, so we enforce a strict-but-sane shape: one @, a
 * dotted domain, no whitespace, sane length, and a real TLD.
 */
export function isValidEmail(email: string): boolean {
  const e = email.trim()
  if (e.length === 0 || e.length > 254) return false
  // local@domain.tld — domain must have at least one dot and a 2+ char TLD.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)
}

/** Lower-case + trim so the same address is never stored twice. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/** Light URL normalization for storage — adds https:// if no scheme given. */
export function normalizeUrl(url: string): string {
  const u = url.trim()
  if (!u) return ""
  return /^https?:\/\//i.test(u) ? u : `https://${u}`
}
