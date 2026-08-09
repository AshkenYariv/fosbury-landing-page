/**
 * The home page.
 *
 * Four things move on it: the screaming, the three claims and their screens,
 * the strip of switches, and the blocks arriving as you reach them. Nothing
 * here knows about the access dialog beyond the two events it announces.
 */
(() => {
'use strict';
const CALM = matchMedia('(prefers-reduced-motion: reduce)');
const watch = (el, at, fn) => {
  if (!('IntersectionObserver' in window)) { fn(true); return; }
  new IntersectionObserver(([e]) => fn(e.isIntersecting), { threshold: at }).observe(el);
};

/* ══════════════════════════════════════════════════════════════════════════
   The screaming.

   Ten frames at about a tenth of a second, which is where a cut stops reading
   as a slideshow and starts reading as a noise. It never stops for good: the
   dialog holds it still while it is open, and closing the dialog starts it
   again. The only way to make it stop is the thing the dialog is asking for.
   ══════════════════════════════════════════════════════════════════════════ */
const screams = document.getElementById('screams');
const shots = [...screams.querySelectorAll('img')];
const RATE = 115;
let at = 0, timer = 0, watched = true, asking = false, ready = false;

function run() {
  clearInterval(timer);
  if (!ready || asking || !watched || CALM.matches) return;
  timer = setInterval(() => {
    shots[at].removeAttribute('data-on');
    at = (at + 1) % shots.length;
    shots[at].setAttribute('data-on', '');
  }, RATE);
}

/* Off screen it is a timer nobody is watching burning a frame every tenth of a
   second. It runs while it is looked at and not otherwise. */
watch(screams, .12, (seen) => { watched = seen; run(); });
document.addEventListener('waitlist:open', () => { asking = true; run(); });   /* which is to say: stop */
document.addEventListener('waitlist:close', () => { asking = false; run(); }); /* and it picks up again */
Promise.all(shots.map((img) => img.decode().catch(() => {}))).then(() => { ready = true; run(); });

/* ══════════════════════════════════════════════════════════════════════════
   How it works.

   Three claims and three screens in one section. It walks itself, and
   choosing is a nudge rather than a stop: whatever you pick gets the same
   full hold everything else gets, and then it carries on.
   ══════════════════════════════════════════════════════════════════════════ */
const works = document.querySelector('.works');
const picks = [...document.querySelectorAll('.pick')];
const panes = [...document.querySelectorAll('.pane')];
/* The hold is the section's own, written where the rail that draws it lives. */
const HOLD = (parseFloat(getComputedStyle(works).getPropertyValue('--hold')) || 8) * 1000;
let shown = 0, walk = 0, inView = false;

/* The rail that empties and fills is a CSS animation hung off whichever claim
   is open, so it restarts by itself when the open one changes. Clicking the
   one already open has to look like something too, and the browser only
   replays an animation if the selection is taken away and handed back either
   side of a reflow. */
function show(next) {
  picks.forEach((p) => p.setAttribute('aria-selected', 'false'));
  void works.offsetWidth;
  shown = next;
  picks[shown].setAttribute('aria-selected', 'true');
  panes.forEach((p, i) => p.toggleAttribute('data-on', i === shown));
}
/* `data-walking` is what tells the rails to fill: they are only counting down
   to something when there is something to count down to. */
function walkOn() {
  clearInterval(walk);
  const walking = inView && !CALM.matches;
  works.toggleAttribute('data-walking', walking);
  if (walking) walk = setInterval(() => show((shown + 1) % picks.length), HOLD);
}
/* Choosing restarts the clock rather than stopping it: the hold you get for
   reading the one you asked for is the whole hold, every time. */
picks.forEach((p, i) => p.addEventListener('click', () => { show(i); walkOn(); }));
watch(works, .35, (seen) => { inView = seen; walkOn(); });

/* ══════════════════════════════════════════════════════════════════════════
   What is switched off.

   Written once and laid out twice: a marquee that travels half its own width
   needs two of everything for the seam to land off screen.
   ══════════════════════════════════════════════════════════════════════════ */
const SWITCHES = [
  ['Read receipts', 0], ['Typing indicators', 0], ['Online presence', 0], ['Unread badges', 0],
  ['Private channels', 0], ['@here', 0], ['Threads that end', 1], ['An owner on everything', 1],
  ['Loading spinners', 0], ['Agents that close things', 1], ['Reply-time scoreboards', 0],
  ['Working hours, respected', 1],
];
document.getElementById('track').innerHTML = [...SWITCHES, ...SWITCHES]
  .map(([name, on]) => `<div class="sw"${on ? ' data-on' : ''}><i></i>${name}<em>${on ? 'On' : 'Off'}</em></div>`)
  .join('');

/* ── arriving ──────────────────────────────────────────────────────────── */
const blocks = [...document.querySelectorAll('.reveal')];
if ('IntersectionObserver' in window && !CALM.matches) {
  /* Whatever is already on screen is simply there; only what is below the fold
     waits to be reached. */
  const later = blocks.filter((b) => {
    const here = b.getBoundingClientRect().top < window.innerHeight * .95;
    if (here) b.setAttribute('data-seen', '');
    return !here;
  });
  const seen = new IntersectionObserver((rows) => {
    for (const row of rows) {
      if (!row.isIntersecting) continue;
      row.target.setAttribute('data-seen', '');
      seen.unobserve(row.target);
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: .1 });
  later.forEach((b) => seen.observe(b));
} else {
  blocks.forEach((b) => b.setAttribute('data-seen', ''));
}
})();
