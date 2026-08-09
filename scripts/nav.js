/**
 * The two screens, and the bar over them.
 *
 * There is one document. The two screens sit on top of each other: the one you
 * are leaving clears to white and the one you asked for settles onto the same
 * white canvas. Nothing is fetched and nothing is thrown away, so there is no
 * reload and no flash of a page being built. The address bar is kept honest
 * with the history API, so `/about` is still a real link somebody can send,
 * and back and forward still work.
 *
 * The bar is told which screen it is on and dresses itself accordingly; the
 * corner ask follows you everywhere except the two places that already make
 * the same offer at full size.
 */
(() => {
'use strict';
const deck = document.querySelector('.deck');
const nav = document.querySelector('.nav');
const corner = document.querySelector('.getAccess');
const about = nav.querySelector('.navAbout');

/* Each screen carries its own name, address and title, so this file holds no
   list of what the site happens to contain today. */
const screens = {};
for (const view of deck.querySelectorAll('.view')) screens[view.dataset.view] = view;
const routes = Object.fromEntries(Object.values(screens).map((v) => [v.dataset.path, v.dataset.view]));

const OUT = 260;                    /* how long the screen takes to clear; see --out */
const landed = () => routes[location.pathname] || 'home';
let at = landed(), swap = 0;

/* ── the corner ────────────────────────────────────────────────────────────
   Off over the hero, which is asking already, and off over the closing
   section, which asks at full size. On everywhere else, including the whole
   of the about screen.
   ─────────────────────────────────────────────────────────────────────── */
let onHero = false, onClose = false;
function ask() {
  if (corner) corner.toggleAttribute('data-on', at === 'home' ? !onHero && !onClose : true);
}

/* Said out loud rather than counted here: `scripts/track.js` is the one place
   that knows what any of this is called. */
const arrived = (screen) =>
  document.dispatchEvent(new CustomEvent('screen:shown', { detail: { screen } }));

/* ── the travel ────────────────────────────────────────────────────────────
   Clear the screen you are on, swap underneath the white it leaves behind,
   then settle the new one onto it. The bar does not wait for any of that: it
   changes shape the moment you ask, which is what makes the two feel like one
   place rather than two pages.
   ─────────────────────────────────────────────────────────────────────── */
function show(next, push) {
  if (!screens[next] || next === at) return;
  const leaving = screens[at];
  const arriving = screens[next];
  at = next;

  nav.dataset.view = next;
  about.toggleAttribute('aria-current', next === 'about');
  document.title = arriving.dataset.title;
  ask();
  arrived(next);
  if (push) history.pushState({ view: next }, '', arriving.dataset.path);

  leaving.setAttribute('data-off', '');
  clearTimeout(swap);
  swap = setTimeout(() => {
    /* Nothing is on screen at this point, so the height of the page and where
       you are in it can change without anybody watching it happen. */
    leaving.setAttribute('data-idle', '');
    arriving.removeAttribute('data-idle');
    scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.dataset.view = next;
    requestAnimationFrame(() => arriving.removeAttribute('data-off'));
  }, OUT);
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const to = new URL(link.href, location.href);
  if (to.origin !== location.origin) return;
  const next = routes[to.pathname];
  if (next === undefined) return;

  /* A link to the screen you are already on is either an anchor within it,
     which behaves, or the mark, which takes you back to the top of it. */
  if (next === at) {
    if (to.hash) return;
    e.preventDefault();
    scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  e.preventDefault();
  show(next, true);
});

addEventListener('popstate', (e) => show(e.state?.view || landed(), false));

/* ── arriving ─────────────────────────────────────────────────────────────
   Whichever screen was asked for is the one that is up, with no travel to it,
   and the bar opens out of the mark from there.
   ─────────────────────────────────────────────────────────────────────── */
for (const [name, view] of Object.entries(screens)) {
  view.toggleAttribute('data-idle', name !== at);
  view.toggleAttribute('data-off', name !== at);
}
document.documentElement.dataset.view = at;
document.title = screens[at].dataset.title;
about.toggleAttribute('aria-current', at === 'about');
history.replaceState({ view: at }, '', location.pathname);

/* What each label is worth, once, so the bar has a real length to travel to.
   Its words are sized to their own content, so this holds whether the bar is
   open or shut, and it is taken again whenever the words could have changed
   size underneath it. */
const labels = [...nav.querySelectorAll('.navHome')];
const measure = () => {
  for (const label of labels) label.style.setProperty('--w', `${label.firstElementChild.offsetWidth}px`);
};
/* Where each label stands in the queue, out and back, so the order is the
   bar's own rather than something written down twice. */
labels.forEach((label, i) => {
  label.style.setProperty('--out-i', `${i * 60}ms`);
  label.style.setProperty('--shut-i', `${(labels.length - 1 - i) * 60}ms`);
});
measure();
addEventListener('resize', measure);
if (document.fonts) document.fonts.ready.then(measure);

/* Shut, then open: the bar arrives out of its own mark. */
nav.dataset.view = '';
nav.getBoundingClientRect();
requestAnimationFrame(() => {
  nav.dataset.view = at;
  arrived(at);
});

if (corner) {
  const watch = (el, threshold, fn) => {
    if (!el || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(([e]) => { fn(e.isIntersecting); ask(); }, { threshold }).observe(el);
  };
  watch(document.querySelector('.hero'), .02, (seen) => { onHero = seen; });
  watch(document.querySelector('.end'), .12, (seen) => { onClose = seen; });
  ask();
}
})();
