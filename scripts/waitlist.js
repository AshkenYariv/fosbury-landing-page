/**
 * The access dialog.
 *
 * The one ask on the site, so it is written once and every page loads it. Any
 * `[data-ask]` button opens it; `/api/waitlist` is the only thing that ever
 * sees the address.
 *
 * It announces every step on the document — opened, closed, rejected, sending,
 * joined, failed — and names none of them. That is how a page holds something
 * still while the dialog is up, and how `scripts/track.js` counts what
 * happened, without this file knowing anything about either.
 */
(() => {
'use strict';

const CALM = matchMedia('(prefers-reduced-motion: reduce)');
const ASK = 'What’s your email?';
/* Deliberately loose, and the same shape the endpoint uses. The address is a
   lead, not a login: the only thing worth rejecting is what obviously is not
   one. */
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/;
/* Replaced by whatever the endpoint says the booking link is, so the link
   lives in one place rather than in two that drift apart. */
const CALL_URL = 'https://calendar.app.google/xegK1AbmJKyEs1my9';

document.body.insertAdjacentHTML('beforeend', `
<div class="scrim" hidden>
  <div class="ask" role="dialog" aria-modal="true" aria-labelledby="askTitle">
    <button class="askX" type="button" data-close data-track="Waitlist — close pressed" aria-label="Close">
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4.2 4.2l7.6 7.6M11.8 4.2l-7.6 7.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>

    <div class="askStep" data-step="ask">
      <h2 class="askTitle" id="askTitle" aria-label="${ASK}">
        <span data-typed aria-hidden="true"></span><span class="caret" aria-hidden="true"></span>
      </h2>
      <form class="askForm" novalidate>
        <input class="askField" type="email" name="email" placeholder="you@company.com"
               autocomplete="email" spellcheck="false" aria-label="Your email address">
        <button class="askSend" type="submit" aria-label="Join the waitlist">
          <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M3 8h9.4M8.6 4.2 12.8 8l-4.2 3.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </form>
      <p class="askNote" role="status" aria-live="polite"></p>
    </div>

    <div class="askStep" data-step="done" hidden>
      <h2 class="askTitle">You’re on the waitlist.</h2>
      <p class="askSub">If you’d like to join alpha testing and shape where Fosbury goes</p>
      <a class="askCall" href="${CALL_URL}" target="_blank" rel="noopener"
         data-track="Waitlist — schedule a call">Schedule a 30-minute call</a>
    </div>
  </div>
</div>`);

const scrim = document.querySelector('.scrim');
const card = scrim.querySelector('.ask');
const askStep = scrim.querySelector('[data-step="ask"]');
const doneStep = scrim.querySelector('[data-step="done"]');
const titleEl = scrim.querySelector('#askTitle');
const typedEl = titleEl.querySelector('[data-typed]');
const field = scrim.querySelector('.askField');
const note = scrim.querySelector('.askNote');
const call = scrim.querySelector('.askCall');
const form = scrim.querySelector('.askForm');

let typeTimer = 0, opener = null, joined = false, sending = false;

const announce = (what, detail) => document.dispatchEvent(new CustomEvent(`waitlist:${what}`, { detail }));
const say = (text, bad) => {
  note.textContent = text;
  note.toggleAttribute('data-bad', Boolean(bad));
};

/* The question writes itself. The label carries the whole of it, so a screen
   reader hears a sentence rather than a letter at a time. */
function typeQuestion() {
  clearTimeout(typeTimer);
  if (CALM.matches) { typedEl.textContent = ASK; titleEl.dataset.state = 'rest'; return; }
  typedEl.textContent = '';
  titleEl.dataset.state = 'typing';
  let i = 0;
  const tick = () => {
    typedEl.textContent = ASK.slice(0, ++i);
    /* A hair slower after a space, the way a sentence is actually typed. */
    if (i < ASK.length) typeTimer = setTimeout(tick, ASK[i - 1] === ' ' ? 96 : 52);
    else titleEl.dataset.state = 'rest';
  };
  typeTimer = setTimeout(tick, 220);
}

function open(from) {
  if (!scrim.hidden) return;
  opener = from || document.activeElement;
  scrim.hidden = false;
  document.body.setAttribute('data-locked', '');
  announce('open', { from: from?.dataset.ask || 'page' });
  if (joined) { call.focus({ preventScroll: true }); return; }
  typeQuestion();
  setTimeout(() => field.focus({ preventScroll: true }), CALM.matches ? 0 : 120);
}

function close() {
  if (scrim.hidden) return;
  scrim.hidden = true;
  document.body.removeAttribute('data-locked');
  clearTimeout(typeTimer);
  announce('close', { joined });
  if (opener?.isConnected) opener.focus({ preventScroll: true });
  opener = null;
}

document.addEventListener('click', (e) => {
  const asked = e.target.closest('[data-ask]');
  if (asked) {
    /* Whichever button asked says which room to open: dark over the hero and
       the closing section, light over paper. */
    scrim.dataset.tone = asked.dataset.tone || 'dark';
    open(asked);
    return;
  }
  if (e.target.closest('[data-close]')) close();
});
/* The backdrop, but not the card sitting on it. */
scrim.addEventListener('mousedown', (e) => { if (e.target === scrim) close(); });

document.addEventListener('keydown', (e) => {
  if (scrim.hidden) return;
  if (e.key === 'Escape') { close(); return; }
  if (e.key !== 'Tab') return;
  /* Nothing behind the dialog gets the keyboard while it is open. */
  const stops = [...card.querySelectorAll('button, input, a[href]')]
    .filter((n) => !n.disabled && n.offsetParent);
  if (!stops.length) return;
  const first = stops[0], last = stops[stops.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (sending) return;
  const email = field.value.trim();
  if (!LOOKS_LIKE_EMAIL.test(email)) {
    /* Announced, and never with the address in it: what is useful is that the
       send did not land, not who was trying to send it. */
    announce('invalid');
    say('That does not look like an email address.', true);
    field.focus();
    return;
  }

  sending = true;
  field.disabled = true;
  say('One moment…');
  announce('sending');
  try {
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      cache: 'no-store',
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.ok) throw new Error(body.error || `That did not go through (${res.status}).`);

    joined = true;
    announce('joined', { confirmed: Boolean(body.confirmed) });
    if (body.call) call.href = body.call;
    askStep.hidden = true;
    doneStep.hidden = false;
    call.focus({ preventScroll: true });
  } catch (err) {
    /* A dead fetch throws a TypeError with nothing readable in it — the usual
       cause is a page opened without its API behind it, so say that much. */
    const offline = err instanceof TypeError;
    announce('failed', { reason: offline ? 'offline' : 'server' });
    say(offline
      ? 'We could not reach the server. Check your connection and try again.'
      : (err.message || 'That did not go through. Try again in a moment.'), true);
  } finally {
    sending = false;
    field.disabled = false;
    if (!joined) field.focus({ preventScroll: true });
  }
});
})();
