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
 * Every event carries where it happened: which screen, which section was last
 * under your eye, and which machine it was pressed on. So "Download — corner"
 * from the middle of the six is a different row from the same button pressed on
 * the about screen, and "Open app — hero" from a phone is a different row from
 * the same button on a Mac — without any of them needing its own name.
 *
 * The machine is the one dimension this page could not do without: half of what
 * it now offers is a file that only runs on three of them, and "the download
 * button was pressed" is not a number anybody can act on until it says which
 * download. It is `scripts/download.js` that works the answer out, once, and
 * `data-os` on the document is where this reads it — no second detection, and
 * no way for the two to disagree about what somebody is running.
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
/* Read at the moment of the event rather than kept, so the value is the one on
   the document and not a copy of whatever it was when this file loaded.
   `unknown` said out loud: a missing property is indistinguishable from an
   event sent before the counting was there, and the machines we cannot name
   are exactly the ones worth being able to count. */
const os = () => document.documentElement.dataset.os || 'unknown';
const where = (extra) => ({ screen, section, os: os(), ...extra });

/* ── sections ──────────────────────────────────────────────────────────────
   Where you are, and — the first time only — that you got there at all.
   ─────────────────────────────────────────────────────────────────────── */
const reached = new Set();
function reach(name) {
  section = name;
  if (reached.has(name)) return;
  reached.add(name);
  send(`Section — ${name}`, { screen, os: os() });
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
  send(`Screen — ${screen === 'about' ? 'About' : 'Home'}`, { screen, os: os() });
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

/* ── the download-help dialog ──────────────────────────────────────────────
   `scripts/help.js` says what happened and stays out of the naming.

   Worth counting in full rather than at the ends: somebody opening this is
   somebody a download has already failed for, and the gap between "opened" and
   "sent" is the number that says whether the form itself is the second thing
   that failed them. `os` rides along on all six, so a run of them from one
   platform is visible as one, which is usually what a broken build looks like.
   ─────────────────────────────────────────────────────────────────────── */
const say = (name, detail) => (e) => send(name, where(detail ? detail(e.detail || {}) : undefined));

document.addEventListener('help:open',    say('Download help — opened', (d) => ({ from: d.from })));
document.addEventListener('help:close',   say('Download help — closed', (d) => ({ sent: Boolean(d.sent) })));
document.addEventListener('help:invalid', say('Download help — rejected', (d) => ({ field: d.field })));
document.addEventListener('help:sending', say('Download help — submitted'));
document.addEventListener('help:sent',    say('Download help — sent'));
document.addEventListener('help:failed',  say('Download help — send failed', (d) => ({ reason: d.reason })));
})();
