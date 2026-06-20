"use client"

import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion"
import { useRef, useState } from "react"
import { BRAND, FOCUSED, FOOTER_LINE, SURFACES } from "@/lib/content"
import { LogoMark } from "@/components/logo"
import { ChannelIcon } from "@/components/channel-icons"
import { AuthModal, type AuthMode } from "@/components/auth-modal"
import {
  AutopilotSection,
  Console,
  FreeSection,
  Pop,
  PositioningSection,
  STICKER,
  bounce,
} from "@/components/shared/sections"

/**
 * Landing page. The hero leads with one box and a tight value line, with the
 * live budget console alongside it to show what we do — then the full story
 * unfolds as you scroll.
 */
export default function Landing() {
  const reduced = useReducedMotion()
  const [url, setUrl] = useState("")
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>("signup")
  const [done, setDone] = useState(false)
  const [urlMissing, setUrlMissing] = useState(false)
  const shake = useAnimationControls()
  const urlInputRef = useRef<HTMLInputElement>(null)

  const pop = (delay = 0) => ({
    initial: reduced ? false : { opacity: 0, scale: 0.85, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { ...bounce, delay },
  })

  // "Start free": a URL is required — shake the box if it's empty, otherwise
  // open the sign-up modal carrying the pasted URL.
  function startUrl(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) {
      setUrlMissing(true)
      urlInputRef.current?.focus()
      if (!reduced) {
        shake.start({
          x: [0, -10, 10, -8, 8, -4, 4, 0],
          transition: { duration: 0.5 },
        })
      }
      return
    }
    setAuthMode("signup")
    setAuthOpen(true)
  }

  // Header "Login": no URL needed.
  function openLogin() {
    setAuthMode("login")
    setAuthOpen(true)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fff4d6] font-sans text-black selection:bg-black selection:text-[#fff4d6]">
      {/* header */}
      <header className="sticky top-0 z-40 bg-[#fff4d6]/90 px-5 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <LogoMark className="h-8 w-8" />
            <span className="text-xl font-black tracking-tight">{BRAND}</span>
          </a>
          <button
            onClick={openLogin}
            className={`bg-[#ff3d8b] px-4 py-2 text-sm font-black text-white ${STICKER} transition-transform hover:-translate-y-0.5`}
          >
            Login
          </button>
        </div>
      </header>

      {/* hero — box on the left, live console on the right */}
      <section className="relative mx-auto max-w-6xl px-5 pt-14 pb-12 md:pt-20">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-16 top-10 -z-0 h-44 w-44 rounded-full bg-[#7c3aed]"
          animate={reduced ? undefined : { y: [0, -18, 0], rotate: [0, 12, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-10 bottom-4 -z-0 h-32 w-32 rounded-3xl bg-[#22d3a7]"
          animate={reduced ? undefined : { y: [0, 16, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          {/* left: the box is the hero */}
          <div className="text-center lg:text-left">
            <motion.span
              {...pop(0)}
              className={`inline-block bg-[#ffe14d] px-3 py-1 text-xs font-black uppercase ${STICKER}`}
            >
              {FOCUSED.eyebrow}
            </motion.span>

            <motion.h1
              {...pop(0.05)}
              className="mt-5 text-balance text-5xl font-black leading-[0.95] tracking-tight md:text-6xl"
            >
              {FOCUSED.headlineLead}{" "}
              <span className="bg-gradient-to-r from-[#ff3d8b] to-[#ff8a00] bg-clip-text text-transparent">
                {FOCUSED.headlinePayoff}
              </span>
            </motion.h1>

            <motion.p
              {...pop(0.1)}
              className="mx-auto mt-5 max-w-lg text-pretty text-base font-semibold leading-relaxed text-black/75 md:text-lg lg:mx-0"
            >
              {FOCUSED.sub}
            </motion.p>

            {/* THE BOX */}
            <motion.div {...pop(0.16)} className="mx-auto mt-8 max-w-lg lg:mx-0">
              <AnimatePresence mode="wait" initial={false}>
                {done ? (
                  <motion.div
                    key="done"
                    initial={reduced ? false : { opacity: 0, scale: 0.85, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={bounce}
                    className={`bg-[#22d3a7] px-6 py-5 text-left text-[15px] font-bold leading-relaxed ${STICKER}`}
                  >
                    {FOCUSED.success}
                  </motion.div>
                ) : (
                  <motion.form
                    key="url"
                    onSubmit={startUrl}
                    animate={shake}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    className="flex flex-col gap-3 sm:flex-row"
                  >
                    <input
                      ref={urlInputRef}
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value)
                        if (urlMissing) setUrlMissing(false)
                      }}
                      placeholder={FOCUSED.urlPlaceholder}
                      autoComplete="url"
                      aria-label="Your website URL"
                      aria-invalid={urlMissing}
                      className={`flex-1 bg-white px-5 py-4 text-base font-bold outline-none ${STICKER} placeholder:text-black/40 ${urlMissing ? "border-[#d4183d] shadow-[6px_6px_0_0_#d4183d]" : ""}`}
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05, rotate: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`bg-[#7c3aed] px-7 py-4 text-base font-black text-white ${STICKER}`}
                    >
                      {FOCUSED.cta} →
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>

              {!done && (
                <p className={`mt-4 text-xs font-bold ${urlMissing ? "text-[#d4183d]" : "text-black/60"}`}>
                  {urlMissing ? "Add your website link to start." : FOCUSED.reassurance}
                </p>
              )}
            </motion.div>

            {/* channels */}
            <motion.div
              {...pop(0.22)}
              className="mt-8 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start"
            >
              {SURFACES.map(({ key, label }) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-black"
                >
                  <ChannelIcon channel={key} className="h-3.5 w-3.5" />
                  {label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* right: live console shows what we actually do */}
          <Pop delay={0.12}>
            <Console />
          </Pop>
        </div>
      </section>

      {/* the rest of the story */}
      <PositioningSection />
      <FreeSection />
      <AutopilotSection />

      <footer className="px-5 py-8">
        <p className="mx-auto max-w-6xl text-center text-sm font-black">{FOOTER_LINE}</p>
      </footer>

      <AuthModal
        open={authOpen}
        mode={authMode}
        url={url}
        onClose={() => setAuthOpen(false)}
        onSuccess={(m) => {
          // Show the success sticker in the hero box for sign-ups.
          if (m === "signup") setDone(true)
        }}
      />
    </div>
  )
}
