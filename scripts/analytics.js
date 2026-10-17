/**
 * Google Analytics 4 — the door, not the map.
 *
 * This file loads gtag and gives the page one function, `window.fosburyGa`, to
 * send through. It names nothing: what is counted, and what each thing is
 * called, is `scripts/track.js` and nowhere else, which sends every event to
 * Umami and here in the same breath. Ported from the Skipping Stones landing
 * site's `public/analytics.js` — same dev-host rule, same `ui_click`.
 *
 * Page views are sent by `track.js` rather than by gtag, because the two
 * screens are one document: gtag's own page view would only ever see the first
 * one, and its history listener would count every `#section` jump as a page.
 * `send_page_view: false` turns both off.
 */
(() => {
'use strict';

/* The Fosbury GA4 property's web stream. One stream covers fosbury.ai and
   app.fosbury.ai, so a visit that goes from the page into the app is one
   journey rather than two strangers. Property "Fosbury" (Israel time), stream
   "Fosbury web (fosbury.ai + app)". Empty means nothing is loaded or sent. */
const ID = 'G-98TXZSL290';

/* Local work must never reach the property, or the funnel is our own reloads.
   Vercel preview deployments are the same thing on a public address. */
const DEV = /^(localhost|127\.0\.0\.1|\[?::1\]?)$/.test(location.hostname) ||
  /\.vercel\.app$/.test(location.hostname);
const OFF = !/^G-[A-Z0-9]{6,}$/.test(ID);

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
window.gtag = gtag;

gtag('js', new Date());
gtag('config', ID, { send_page_view: false });

if (DEV || OFF) {
  /* Nothing is loaded, so nothing is sent: dataLayer just fills up unread.
     The log is how you check an event's payload before it ships. */
  console.info(`[analytics] ${OFF ? 'no GA4 id' : 'dev host'} — events logged, not sent`);
} else {
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
  document.head.appendChild(s);
}

/* GA4 truncates parameter values at 100 characters and keeps the leading
   bytes, so a long label would arrive as an unrecognisable prefix. Cut it
   here, with an ellipsis that says the cut happened. */
const clip = (v) => {
  const s = String(v ?? '').replace(/\s+/g, ' ').trim();
  return s.length > 100 ? `${s.slice(0, 99)}…` : s;
};

/* One door for every event, so dev hosts log instead of send and no caller
   can forget to clip. Booleans arrive as yes/no, which is what a GA4
   dimension can be filtered on. */
window.fosburyGa = (name, params = {}) => {
  const out = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    out[k] = typeof v === 'boolean' ? (v ? 'yes' : 'no') : clip(v);
  }
  if (DEV || OFF) { console.info(`[analytics] ${name}`, out); return; }
  try { gtag('event', name, out); } catch { /* counted or not, the page goes on */ }
};
})();
