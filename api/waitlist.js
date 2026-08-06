/**
 * The waitlist.
 *
 * A form on a static page cannot send mail or reach a database: the keys would
 * have to be in the page, and a key in a page is a key anybody can read and
 * spend. So the browser posts an address here and this — running on the server,
 * with the secrets in the environment — is the only thing that ever sees it.
 *
 * Three things happen with an address, and they are not equally important:
 *
 *   1. The row. This is the record: `lib/signups.js` writes it and it is what
 *      "the waitlist" now means. Everything else is a notification about it.
 *   2. The notice to us, so a sign-up is something you find out about rather
 *      than something you query for.
 *   3. The confirmation to them, carrying the link to book half an hour. Best
 *      effort: Resend will only deliver to arbitrary addresses once the sending
 *      domain is verified, and somebody who has already given us their address
 *      should not be shown a failure over a DNS record they cannot see. It is
 *      logged, and the page is told whether it went, so it can say the true
 *      thing either way.
 *
 * The page is told the sign-up failed only when *nothing* held on to it —
 * neither the table nor the inbox. Either one alone is enough to be able to
 * write back to somebody, and demanding both would mean a database hiccup
 * turning away a lead the inbox already had.
 *
 * Needs `RESEND_KEY` on the Vercel project, and `DATABASE_URL` for the table.
 */

import { record } from '../lib/signups.js';

const NOTIFY = 'ashkenazy.jariv@gmail.com';
const FROM = 'Fosbury <hello@fosbury.ai>';

/* Half an hour, whenever suits them. The page reads this back off the response
   so the link lives in one place rather than in two that drift apart. */
const CALL_URL = 'https://calendar.app.google/xegK1AbmJKyEs1my9';

/* Deliberately loose. The address is a lead, not a login — the only thing worth
   rejecting is what obviously is not one, and the rest is for a human to read. */
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function send(key, message) {
  const sent = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  if (!sent.ok) {
    const detail = await sent.text();
    const error = new Error(`resend ${sent.status}: ${detail}`);
    error.status = sent.status;
    throw error;
  }
  return sent.json().catch(() => ({}));
}

/* What we tell the person who just signed up. Plain, short, and with the one
   thing worth doing next in it. */
function welcome(email) {
  return {
    from: FROM,
    to: [email],
    reply_to: NOTIFY,
    subject: 'You’re on the Fosbury waitlist',
    text: [
      'Thanks for asking for access to Fosbury.',
      '',
      'You’re on the list, and we’ll write the moment a seat opens.',
      '',
      'In the meantime, if you’d like to see it properly and tell us how your',
      'team communicates today, book 30 minutes with us here:',
      CALL_URL,
      '',
      '— Yariv, Fosbury',
    ].join('\n'),
    html: `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;font-size:15px;line-height:1.6;color:#282a30;max-width:520px">
  <p style="margin:0 0 16px">Thanks for asking for access to <strong>Fosbury</strong>.</p>
  <p style="margin:0 0 16px">You’re on the list, and we’ll write the moment a seat opens.</p>
  <p style="margin:0 0 24px">In the meantime, if you’d like to see it properly and tell us how your team communicates today, book half an hour with us.</p>
  <p style="margin:0 0 28px">
    <a href="${CALL_URL}" style="display:inline-block;padding:13px 26px;border-radius:999px;background:#282a30;color:#ffffff;text-decoration:none;font-weight:500">Schedule a 30-minute call</a>
  </p>
  <p style="margin:0;color:#8a8f98;font-size:13px">— Yariv, Fosbury</p>
</div>`,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Use POST.' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : (req.body || {});
  const email = String(body.email || '').trim();

  if (!LOOKS_LIKE_EMAIL.test(email) || email.length > 254) {
    return res.status(400).json({ ok: false, error: 'That does not look like an email address.' });
  }

  const key = process.env.RESEND_KEY;

  /* What the referrer and the page can tell us, which is all we collect. */
  const source = String(req.headers['referer'] || 'fosbury.ai');

  /*
   * The row first, because it is the record and because the letters below are
   * about it. A returning address is not news: it lands in the same row, and
   * the notice says so rather than reading like a second person.
   */
  let written = { stored: false };
  try {
    written = await record(email, source);
    if (!written.stored) console.error('[waitlist] not written down:', written.reason);
  } catch (error) {
    console.error('[waitlist] could not write the sign-up down', error);
  }

  let notified = false;
  if (key) {
    try {
      const again = written.returning ? ' (again)' : '';
      await send(key, {
        from: FROM,
        to: [NOTIFY],
        /* So hitting reply goes to the person who signed up. */
        reply_to: email,
        subject: `Waitlist: ${email}${again}`,
        text: `${email} asked for access${again}.\n\nFrom: ${source}`,
        html: `<p><strong>${esc(email)}</strong> asked for access${again}.</p><p style="color:#8a8f98;font-size:13px">From: ${esc(source)}</p>`,
      });
      notified = true;
    } catch (error) {
      console.error('[waitlist] the notice did not send', error);
    }
  } else {
    console.error('[waitlist] RESEND_KEY is not set on this deployment');
  }

  /* Nothing held on to it. This is the only case the page is told no. */
  if (!written.stored && !notified) {
    return res.status(502).json({ ok: false, error: 'We could not record that just now. Try again in a moment.' });
  }

  let confirmed = false;
  if (key) {
    try {
      await send(key, welcome(email));
      confirmed = true;
    } catch (error) {
      /* Recorded, not delivered. The lead is safe; a human can follow it up. */
      console.error('[waitlist] confirmation to', email, 'did not send', error);
    }
  }

  return res.status(200).json({ ok: true, confirmed, call: CALL_URL });
}

function safeParse(text) {
  try { return JSON.parse(text); } catch { return {}; }
}
