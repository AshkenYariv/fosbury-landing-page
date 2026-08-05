/**
 * The waitlist.
 *
 * A form on a static page cannot send mail: the Resend key would have to be in
 * the page, and a key in a page is a key anybody can read and spend. So the
 * browser posts an address here and this — running on the server, with the key
 * in the environment — is the only thing that ever sees it.
 *
 * Needs `RESEND_KEY` set on the Vercel project. Without it the endpoint says so
 * rather than pretending to have sent something.
 */

const NOTIFY = 'ashkenazy.jariv@gmail.com';
const FROM = 'Fosbury <hello@fosbury.ai>';

/* Deliberately loose. The address is a lead, not a login — the only thing worth
   rejecting is what obviously is not one, and the rest is for a human to read. */
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

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
    const sent = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: [NOTIFY],
        /* So hitting reply goes to the person who signed up. */
        reply_to: email,
        subject: `Waitlist: ${email}`,
        text: `${email} asked for access.\n\nFrom: ${source}`,
        html: `<p><strong>${esc(email)}</strong> asked for access.</p><p style="color:#8a8f98;font-size:13px">From: ${esc(source)}</p>`,
      }),
    });

    if (!sent.ok) {
      const detail = await sent.text();
      console.error('[waitlist] resend rejected the send', sent.status, detail);
      return res.status(502).json({ ok: false, error: 'We could not record that just now. Try again in a moment.' });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('[waitlist] send failed', error);
    return res.status(502).json({ ok: false, error: 'We could not record that just now. Try again in a moment.' });
  }
}

function safeParse(text) {
  try { return JSON.parse(text); } catch { return {}; }
}
