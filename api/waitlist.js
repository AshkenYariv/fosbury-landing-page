/**
 * The waitlist.
 *
 * A form on a static page cannot send mail: the Resend key would have to be in
 * the page, and a key in a page is a key anybody can read and spend. So the
 * browser posts an address here and this — running on the server, with the key
 * in the environment — is the only thing that ever sees it.
 *
 * Two letters go out per sign-up, and they are not equally important:
 *
 *   1. The notice to us. This one is the record. If it does not send, the
 *      sign-up did not happen and the page is told so.
 *   2. The confirmation to them, carrying the link to book half an hour. Best
 *      effort: Resend will only deliver to arbitrary addresses once the sending
 *      domain is verified, and somebody who has already given us their address
 *      should not be shown a failure over a DNS record they cannot see. It is
 *      logged, and the page is told whether it went, so it can say the true
 *      thing either way.
 *
 * Needs `RESEND_KEY` set on the Vercel project. Without it the endpoint says so
 * rather than pretending to have sent something.
 */

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
  if (!key) {
    console.error('[waitlist] RESEND_KEY is not set on this deployment');
    return res.status(500).json({ ok: false, error: 'The waitlist is not accepting sign-ups right now.' });
  }

  /* What the referrer and the page can tell us, which is all we collect. */
  const source = String(req.headers['referer'] || 'fosbury.ai');

  try {
    await send(key, {
      from: FROM,
      to: [NOTIFY],
      /* So hitting reply goes to the person who signed up. */
      reply_to: email,
      subject: `Waitlist: ${email}`,
      text: `${email} asked for access.\n\nFrom: ${source}`,
      html: `<p><strong>${esc(email)}</strong> asked for access.</p><p style="color:#8a8f98;font-size:13px">From: ${esc(source)}</p>`,
    });
  } catch (error) {
    console.error('[waitlist] could not record the sign-up', error);
    return res.status(502).json({ ok: false, error: 'We could not record that just now. Try again in a moment.' });
  }

  let confirmed = true;
  try {
    await send(key, welcome(email));
  } catch (error) {
    /* Recorded, not delivered. The lead is safe; a human can follow it up. */
    confirmed = false;
    console.error('[waitlist] confirmation to', email, 'did not send', error);
  }

  return res.status(200).json({ ok: true, confirmed, call: CALL_URL });
}

function safeParse(text) {
  try { return JSON.parse(text); } catch { return {}; }
}
