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
 * Everything goes to two places. Umami gets the names above, written for a
 * person to read. Google Analytics gets the same moments as a handful of
 * snake_case events with the name as a parameter, because GA4 event names are
 * identifiers (letters, digits, underscores, forty characters) and a report
 * with one event per button is a report nobody can pivot. GA additionally gets
 * a `ui_click` for every click on the page, tagged or not — the Skipping Stones
 * rule — so a button somebody forgot to name still shows up as pressed. The
 * full map is in the README under "What is counted".
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

const send = (name, where, ga) => {
  try { window.umami?.track(name, where); } catch { /* counted or not, the page goes on */ }
  if (ga) window.fosburyGa?.(ga, { name, ...where });
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
  send(`Section — ${name}`, { screen, os: os() }, 'section_reached');
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
/* GA's page view, sent here rather than by gtag (see `scripts/analytics.js`).
   The address is built from the screen, not read off the bar: `nav.js` says a
   screen arrived a moment before it pushes the address that goes with it, and
   a `#section` on the end is a place on the page rather than a page. */
const pageView = () => window.fosburyGa?.('page_view', {
  page_location: `${location.origin}${screen === 'about' ? '/about' : '/'}`,
  page_title: document.title,
  screen,
  os: os(),
});

document.addEventListener('screen:shown', (e) => {
  screen = e.detail?.screen || screen;
  send(`Screen — ${screen === 'about' ? 'About' : 'Home'}`, { screen, os: os() });
  pageView();
  reach(screen === 'about' ? 'About' : 'Hero');
});

/* The screen somebody landed on. `nav.js` only announces changes, and it has
   already put the right title on the document by the time this runs — the two
   are deferred, and this is the earlier of them, so it waits for the page. */
document.addEventListener('DOMContentLoaded', () => {
  screen = document.documentElement.dataset.view || screen;
  pageView();
});

/* ── clicks ────────────────────────────────────────────────────────────────
   Caught on the way down, so a handler that swallows the event later — the bar
   does, to move between screens without a reload — cannot swallow the count
   with it.
   ─────────────────────────────────────────────────────────────────────── */
/* What a person thinks they clicked is the control, not the <span> inside it.
   The page's own name for it wins; after that, what it says on it. Never an
   input's value — the help dialog's fields are what somebody typed. */
const CONTROL = 'a,button,summary,label,input,select,textarea,[role="button"],[role="link"],[role="tab"],[data-track]';
const label = (el) =>
  el.dataset.track || el.getAttribute('aria-label') || el.innerText || el.textContent ||
  el.getAttribute('title') || el.getAttribute('alt') || '';

document.addEventListener('click', (e) => {
  const target = e.target.nodeType === 1 ? e.target : e.target.parentElement;
  const hit = target?.closest('[data-track]');
  if (hit) send(hit.dataset.track, where());

  /* GA's catch-all. A container's text is the whole page under it, and GA4
     buckets a dimension into "(other)" past 500 distinct values — so only a
     control gets a label, and a click on the background says so. */
  const control = target?.closest(CONTROL);
  const el = control || target || document.body;
  const href = control?.getAttribute('href');
  window.fosburyGa?.('ui_click', {
    element: el.tagName.toLowerCase(),
    label: (control ? label(control) : '') || '(none)',
    is_control: Boolean(control),
    tracked: Boolean(hit),
    link_url: href ? control.href : undefined,
    link_outbound: href ? control.hostname !== location.hostname : undefined,
    ...where(),
  });
}, true);

/* ── the download-help dialog ──────────────────────────────────────────────
   `scripts/help.js` says what happened and stays out of the naming.

   Worth counting in full rather than at the ends: somebody opening this is
   somebody a download has already failed for, and the gap between "opened" and
   "sent" is the number that says whether the form itself is the second thing
   that failed them. `os` rides along on all six, so a run of them from one
   platform is visible as one, which is usually what a broken build looks like.
   ─────────────────────────────────────────────────────────────────────── */
const say = (name, detail) => (e) => send(name, where(detail ? detail(e.detail || {}) : undefined), 'download_help');

document.addEventListener('help:open',    say('Download help — opened', (d) => ({ from: d.from })));
document.addEventListener('help:close',   say('Download help — closed', (d) => ({ sent: Boolean(d.sent) })));
document.addEventListener('help:invalid', say('Download help — rejected', (d) => ({ field: d.field })));
document.addEventListener('help:sending', say('Download help — submitted'));
document.addEventListener('help:sent',    say('Download help — sent'));
document.addEventListener('help:failed',  say('Download help — send failed', (d) => ({ reason: d.reason })));
})();
