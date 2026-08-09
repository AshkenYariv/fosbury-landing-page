/**
 * What happened, and where.
 *
 * Every counted thing is named here or named in the markup, and nowhere else —
 * a page with its event names scattered through four files is a page whose
 * numbers nobody trusts.
 *
 * Three kinds of thing are counted:
 *
 *   Screens.   Which of the two you are on, every time you arrive at it.
 *   Sections.  Which parts of a screen you actually reached, as you reach
 *              them. A section counts when it crosses the middle of the
 *              window, which is the point at which somebody is looking at it
 *              rather than merely scrolling past its first pixel.
 *   Clicks.    Anything carrying `data-track`. The attribute is the name, so
 *              a new button is counted by adding one word to its markup.
 *
 * Every event carries where it happened: which screen, and which section was
 * last under your eye. So "Get access — corner" from the middle of the six is
 * a different row from the same button pressed on the about screen, without
 * either of them needing its own name.
 */
(() => {
'use strict';

const send = (name, where) => {
  try { window.umami?.track(name, where); } catch { /* counted or not, the page goes on */ }
};

/* Held here rather than read off the page: the page takes a moment to change
   its mind between screens, and an event fired during that moment should say
   where it was going, not where it had been. */
let screen = document.documentElement.dataset.view || 'home';
let section = 'Hero';
const where = (extra) => ({ screen, section, ...extra });

/* ── sections ──────────────────────────────────────────────────────────────
   Where you are, and — the first time only — that you got there at all.
   ─────────────────────────────────────────────────────────────────────── */
const reached = new Set();
function reach(name) {
  section = name;
  if (reached.has(name)) return;
  reached.add(name);
  send(`Section — ${name}`, { screen });
}

if ('IntersectionObserver' in window) {
  /* A band across the middle of the window: a section is reached when it
     crosses that, whether it is a paragraph tall or three screens tall. The
     screen you are not on is stacked underneath this one and would otherwise
     report itself as being right in front of you. */
  const eye = new IntersectionObserver((rows) => {
    for (const row of rows) {
      if (row.isIntersecting && !row.target.closest('[data-idle]')) reach(row.target.dataset.section);
    }
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
  for (const mark of document.querySelectorAll('[data-section]')) eye.observe(mark);
}

/* ── screens ───────────────────────────────────────────────────────────────
   Arriving at a screen is arriving at the top of it, which the observer above
   has no change to notice — the two were always in the same place.
   ─────────────────────────────────────────────────────────────────────── */
document.addEventListener('screen:shown', (e) => {
  screen = e.detail?.screen || screen;
  send(`Screen — ${screen === 'about' ? 'About' : 'Home'}`, { screen });
  reach(screen === 'about' ? 'About' : 'Hero');
});

/* ── clicks ────────────────────────────────────────────────────────────────
   Caught on the way down, so a handler that swallows the event later — the bar
   does, to move between screens without a reload — cannot swallow the count
   with it.
   ─────────────────────────────────────────────────────────────────────── */
document.addEventListener('click', (e) => {
  const hit = e.target.closest('[data-track]');
  if (hit) send(hit.dataset.track, where());
}, true);

/* ── the waitlist ──────────────────────────────────────────────────────────
   `scripts/waitlist.js` says what happened and stays out of the naming.
   ─────────────────────────────────────────────────────────────────────── */
const say = (name, detail) => (e) => send(name, where(detail ? detail(e.detail || {}) : undefined));

document.addEventListener('waitlist:open',   say('Waitlist — opened', (d) => ({ from: d.from })));
document.addEventListener('waitlist:close',  say('Waitlist — closed', (d) => ({ joined: Boolean(d.joined) })));
document.addEventListener('waitlist:invalid', say('Waitlist — address rejected'));
document.addEventListener('waitlist:sending', say('Waitlist — address submitted'));
document.addEventListener('waitlist:joined', say('Waitlist — joined', (d) => ({ confirmed: d.confirmed })));
document.addEventListener('waitlist:failed', say('Waitlist — send failed', (d) => ({ reason: d.reason })));
})();
