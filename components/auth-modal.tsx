"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { STICKER, bounce } from "@/components/shared/sections"
import { isValidEmail } from "@/lib/validate"

export type AuthMode = "login" | "signup"
type Provider = "google" | "email"
type Status = "idle" | "loading" | "done" | "error"

/** Envelope glyph, sized to match the Google "G". */
function MailGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  )
}

/** The multicolor Google "G". */
function GoogleGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.4 7.4 24 12 24z" />
      <path fill="#FBBC05" d="M5.4 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.4C.5 8.2 0 10 0 12s.5 3.8 1.4 5.4l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.6 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
    </svg>
  )
}

/**
 * Sign-in / sign-up modal. Offers Google (simulated for now — captures the
 * Google email) or email. On submit it posts to /api/signup, which validates
 * and stores the email (with the pasted URL, for signups) in the local JSON DB.
 */
export function AuthModal({
  open,
  mode,
  url,
  onClose,
  onSuccess,
}: {
  open: boolean
  mode: AuthMode
  url?: string
  onClose: () => void
  onSuccess?: (mode: AuthMode) => void
}) {
  const [view, setView] = useState<"choose" | "email">("choose")
  const [provider, setProvider] = useState<Provider>("email")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [alreadyExists, setAlreadyExists] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Fresh state every time the modal opens.
  useEffect(() => {
    if (!open) return
    setView("choose")
    setProvider("email")
    setEmail("")
    setStatus("idle")
    setAlreadyExists(false)
    setError("")
  }, [open])

  useEffect(() => {
    if (view === "email") inputRef.current?.focus()
  }, [view])

  // Close on Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  function choose(p: Provider) {
    setProvider(p)
    setEmail("")
    setError("")
    setView("email")
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (status === "loading") return
    setError("")
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }
    setStatus("loading")
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          provider,
          // The pasted website only matters for signups, not logins.
          url: mode === "signup" ? url : undefined,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean
        error?: string
        alreadyExists?: boolean
      }
      if (!res.ok || !data.ok) {
        setError(data.error || "Something broke — try again?")
        setStatus("error")
        return
      }
      setAlreadyExists(!!data.alreadyExists)
      setStatus("done")
      onSuccess?.(mode)
    } catch {
      setError("Something broke — try again?")
      setStatus("error")
    }
  }

  const title = mode === "login" ? "Welcome back" : "Create your account"
  const providerLabel = provider === "google" ? "Continue with Google" : "Continue with email"
  const emailPlaceholder = provider === "google" ? "you@gmail.com" : "you@startup.com"

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={bounce}
            className={`relative z-10 w-full max-w-md bg-[#fff4d6] p-7 ${STICKER}`}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-white text-lg font-black leading-none transition-transform hover:-translate-y-0.5"
            >
              ×
            </button>

            {status === "done" ? (
              <div className="py-2 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-black bg-[#22d3a7] text-2xl font-black">
                  ✓
                </div>
                <h2 className="text-2xl font-black">
                  {alreadyExists ? "You're already in" : "You're in!"}
                </h2>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-black/70">
                  {alreadyExists
                    ? "We've already got your spot saved — no need to sign up twice."
                    : mode === "signup" && url
                      ? `We'll start testing ${url} and email you the moment your batch opens.`
                      : "We'll email you the moment your batch opens — one note, no spam."}
                </p>
                <button
                  onClick={onClose}
                  className={`mt-6 w-full bg-[#7c3aed] px-6 py-3 text-base font-black text-white ${STICKER} transition-transform hover:-translate-y-0.5`}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black">{title}</h2>
                <p className="mt-1 text-sm font-semibold text-black/60">
                  {mode === "signup"
                    ? "Sign up to put your ads on autopilot."
                    : "Sign in to your account."}
                </p>

                <AnimatePresence mode="wait" initial={false}>
                  {view === "choose" ? (
                    <motion.div
                      key="choose"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="mt-6 flex flex-col gap-3"
                    >
                      <button
                        onClick={() => choose("google")}
                        className={`flex items-center justify-center gap-3 bg-white px-5 py-4 text-base font-black ${STICKER} transition-transform hover:-translate-y-0.5`}
                      >
                        <GoogleGlyph className="h-5 w-5" />
                        Continue with Google
                      </button>
                      <button
                        onClick={() => choose("email")}
                        className={`flex items-center justify-center gap-3 bg-[#ffe14d] px-5 py-4 text-base font-black ${STICKER} transition-transform hover:-translate-y-0.5`}
                      >
                        <MailGlyph className="h-5 w-5" />
                        Continue with email
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="email"
                      onSubmit={submit}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="mt-6 flex flex-col gap-3"
                    >
                      <div className="flex items-center gap-2 text-sm font-black">
                        {provider === "google" && <GoogleGlyph className="h-4 w-4" />}
                        <span>{providerLabel}</span>
                      </div>
                      <input
                        ref={inputRef}
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (error) setError("")
                        }}
                        placeholder={emailPlaceholder}
                        aria-label="Your email"
                        className={`bg-white px-5 py-4 text-base font-bold outline-none ${STICKER} placeholder:text-black/40`}
                      />
                      {error && (
                        <p className="text-sm font-black text-[#d4183d]">{error}</p>
                      )}
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className={`bg-[#ff3d8b] px-6 py-4 text-base font-black text-white ${STICKER} transition-transform hover:-translate-y-0.5 disabled:opacity-60`}
                      >
                        {status === "loading"
                          ? "…"
                          : mode === "login"
                            ? "Sign in"
                            : "Create account"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setView("choose")}
                        className="mt-1 text-xs font-bold text-black/50 underline underline-offset-2"
                      >
                        ← other options
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                <p className="mt-6 text-center text-[11px] font-bold text-black/40">
                  No card · We never spend your money without your go-ahead
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
