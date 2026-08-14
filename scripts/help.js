/**
 * "Having problems downloading?"
 *
 * A download button is the one control on this site that can fail silently and
 * take the person with it. Gatekeeper calls an unsigned app damaged, SmartScreen
 * calls it unrecognised, and a corporate proxy simply eats the file — and in
 * every one of those cases the page looks like it worked. So there is somewhere
 * to say so, and it is two fields and a button rather than an address somebody
 * has to copy into a mail client they may not have.
 *
 * Any `[data-help]` button opens it; `/api/download-help` is the only thing that
 * ever sees what was typed, and it sends one letter to `hello@fosbury.ai`.
 *
 * It announces every step on the document — opened, closed, rejected, sending,
 * sent, failed — and names none of them. That is how `scripts/track.js` counts
 * what happened and how `scripts/home.js` holds the hero still while the dialog
 * is up, without this file knowing about either.
 */
(() => {
'use strict';

/* Where to write if this form is the thing that is broken. Said out loud in the
   dialog rather than kept for the failure case: somebody who would rather use
   their own mail client should not have to make a form fail to find out how. */
const INBOX = 'hello@fosbury.ai';

/* Deliberately loose, and the same shape the endpoint uses. We are trying to
   reach somebody, not authenticate them. */
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/;
/* The endpoint refuses anything longer. Said here too so the refusal happens
   under the cursor rather than after a round trip. */
const LONGEST = 4000;

document.body.insertAdjacentHTML('beforeend', `
<div class="scrim" hidden>
  <div class="help" role="dialog" aria-modal="true" aria-labelledby="helpTitle">
    <button class="helpX" type="button" data-close data-track="Help — close pressed" aria-label="Close">
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4.2 4.2l7.6 7.6M11.8 4.2l-7.6 7.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>

    <div class="helpStep" data-step="ask">
      <h2 class="helpTitle" id="helpTitle">What went wrong?</h2>
      <p class="helpSub">Tell us what happened and we’ll write back. This goes straight to ${INBOX}.</p>

      <form class="helpForm" novalidate>
        <label class="helpLabel" for="helpEmail">Your email</label>
        <input class="helpField" id="helpEmail" type="email" name="email" placeholder="you@company.com"
               autocomplete="email" spellcheck="false">

        <label class="helpLabel" for="helpWhat">What happened</label>
        <textarea class="helpField helpArea" id="helpWhat" name="message" rows="4"
                  placeholder="The Mac download stops at 40%, every time." maxlength="${LONGEST}"></textarea>

        <!-- Nobody sees this and nobody fills it in, which is the point: a form
             that emails a real inbox on every submit is a form worth the four
             lines it costs to make automated submissions cheap to ignore. Off
             the tab order and hidden from the accessibility tree, so it is
             invisible to a screen reader as well as to an eye. -->
        <div class="helpTrap" aria-hidden="true">
          <label for="helpCompany">Company</label>
          <input id="helpCompany" type="text" name="company" tabindex="-1" autocomplete="off">
        </div>

        <button class="helpSend" type="submit">Send</button>
      </form>

      <p class="helpNote" role="status" aria-live="polite"></p>
      <p class="helpElse">We’ll include which system and browser you’re on, so we can reproduce it. Prefer your own mail? <a href="mailto:${INBOX}" data-track="Help — mailto">${INBOX}</a></p>
    </div>

    <div class="helpStep" data-step="done" hidden>
      <h2 class="helpTitle">That’s with us.</h2>
      <p class="helpSub">We read every one of these and we’ll write back to you. Sorry it didn’t just work.</p>
      <button class="helpSend helpDone" type="button" data-close data-track="Help — done pressed">Close</button>
    </div>
  </div>
</div>`);

const scrim = document.querySelector('.scrim');
const card = scrim.querySelector('.help');
const askStep = scrim.querySelector('[data-step="ask"]');
const doneStep = scrim.querySelector('[data-step="done"]');
const email = scrim.querySelector('#helpEmail');
const what = scrim.querySelector('#helpWhat');
const trap = scrim.querySelector('#helpCompany');
const note = scrim.querySelector('.helpNote');
const form = scrim.querySelector('.helpForm');

let opener = null, sending = false;

const announce = (step, detail) => document.dispatchEvent(new CustomEvent(`help:${step}`, { detail }));
const say = (text, bad) => {
  note.textContent = text;
  note.toggleAttribute('data-bad', Boolean(bad));
};

function open(from) {
  if (!scrim.hidden) return;
  opener = from || document.activeElement;
  scrim.hidden = false;
  document.body.setAttribute('data-locked', '');
  announce('open', { from: from?.dataset.help || 'page' });
  setTimeout(() => email.focus({ preventScroll: true }), 60);
}

function close() {
  if (scrim.hidden) return;
  scrim.hidden = true;
  document.body.removeAttribute('data-locked');
  announce('close', { sent: doneStep.hidden === false });
  if (opener?.isConnected) opener.focus({ preventScroll: true });
  opener = null;
}

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-help]')) { open(e.target.closest('[data-help]')); return; }
  if (e.target.closest('[data-close]')) close();
});
/* The backdrop, but not the card sitting on it. */
scrim.addEventListener('mousedown', (e) => { if (e.target === scrim) close(); });

document.addEventListener('keydown', (e) => {
  if (scrim.hidden) return;
  if (e.key === 'Escape') { close(); return; }
  /* Enter sends from anywhere but the box you are writing a paragraph in, where
     it has to keep meaning a new line. */
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { form.requestSubmit(); return; }
  if (e.key !== 'Tab') return;
  /* Nothing behind the dialog gets the keyboard while it is open. */
  const stops = [...card.querySelectorAll('button, input, textarea, a[href]')]
    .filter((n) => !n.disabled && n.tabIndex !== -1 && n.offsetParent);
  if (!stops.length) return;
  const first = stops[0], last = stops[stops.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (sending) return;

  const address = email.value.trim();
  const message = what.value.trim();

  /* Rejected one at a time and in reading order, so the cursor lands on the
     thing being complained about rather than on whichever field is first. */
  if (!LOOKS_LIKE_EMAIL.test(address)) {
    announce('invalid', { field: 'email' });
    say('That does not look like an email address.', true);
    email.focus();
    return;
  }
  if (!message) {
    announce('invalid', { field: 'message' });
    say('Tell us what happened, even briefly.', true);
    what.focus();
    return;
  }

  sending = true;
  form.setAttribute('data-sending', '');
  email.disabled = what.disabled = true;
  say('Sending…');
  announce('sending');

  try {
    const res = await fetch('/api/download-help', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: address,
        message,
        /* What the page already knows, so nobody has to be asked for it. Absent
           on a machine we could not name, which is itself worth knowing when
           somebody is reporting that no download worked. */
        platform: document.documentElement.dataset.os || 'unknown',
        company: trap.value,
      }),
      cache: 'no-store',
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.ok) throw new Error(body.error || `That did not go through (${res.status}).`);

    announce('sent');
    askStep.hidden = true;
    doneStep.hidden = false;
    doneStep.querySelector('.helpDone').focus({ preventScroll: true });
  } catch (err) {
    /* A dead fetch throws a TypeError with nothing readable in it. Either way
       the address is on screen underneath, so nobody is left with nowhere to
       go — which is the whole reason this dialog exists. */
    const offline = err instanceof TypeError;
    announce('failed', { reason: offline ? 'offline' : 'server' });
    say(offline
      ? `We could not reach the server. Write to ${INBOX} and we’ll pick it up there.`
      : (err.message || `That did not go through. Write to ${INBOX} instead.`), true);
  } finally {
    sending = false;
    form.removeAttribute('data-sending');
    email.disabled = what.disabled = false;
  }
});
})();
