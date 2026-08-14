/**
 * A download that did not work.
 *
 * One letter, to `hello@fosbury.ai`, with a reply-to pointing back at whoever
 * wrote it. That is the whole of it: there is no row and no table here, because
 * unlike a sign-up this is not a record anybody comes back to count — it is a
 * conversation that has to start, and an inbox is what starts conversations.
 *
 * The address is the alias rather than the mailbox behind it, which is the
 * opposite of what the waitlist notice does and deliberately so. That notice is
 * ours alone and nobody replies to it, so it goes straight to the mailbox. This
 * one is support: the person is told in the dialog where their letter went, they
 * will use that address again, and it has to be one that can be pointed
 * somewhere else — at somebody who is not Yariv — without a deploy.
 *
 * Needs `RESEND_KEY`. Without it there is nowhere for this to go and the page is
 * told so plainly, which is why the dialog carries the address in readable text
 * underneath the form: the failure case of a contact form must never be a dead
 * end.
 */

/* The alias, and the reason for it is above. Overridable so a preview
   deployment can be pointed somewhere harmless — previews inherit `RESEND_KEY`
   and would otherwise send real mail from the real domain. */
const FROM = process.env.EMAIL_FROM || 'Fosbury <hello@fosbury.ai>';
const SUPPORT = process.env.EMAIL_SUPPORT || 'hello@fosbury.ai';

/* Deliberately loose, and the same shape the page uses. We are trying to reach
   somebody, not authenticate them. */
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/;

/* Long enough for anybody describing a failure, including a pasted error, and
   short enough that this endpoint cannot be used to post a novel into an inbox.
   The page stops at the same number so the refusal usually happens there. */
const LONGEST = 4000;

/* What the page is allowed to say it is running on, and what each is called in
   the letter. Matched against a list rather than printed as it arrived: this is
   a value from a browser that ends up in a subject line, and a subject line is
   somewhere a newline does real damage. */
const PLATFORMS = {
  macos: 'macOS',
  windows: 'Windows',
  linux: 'Linux',
  unknown: 'Not a machine we recognised',
};

const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* Only ever printed into HTML, never into the plain-text half, so the escaping
   comes first and the line breaks after it — the other way round and the `<br>`
   this puts in would be escaped by the step meant to make it safe. */
const paragraphs = (text) => esc(text).replace(/\r?\n/g, '<br>');

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Use POST.' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : (req.body || {});
  const email = String(body.email || '').trim();
  const message = String(body.message || '').trim();

  /*
   * The honeypot, and the answer to it is `ok`.
   *
   * Telling an automated submission that it was refused is telling whoever
   * wrote it which field gave it away, and the next version leaves that field
   * alone. A 200 with nothing sent costs us nothing and teaches it nothing.
   */
  if (String(body.company || '').trim()) return res.status(200).json({ ok: true });

  if (!LOOKS_LIKE_EMAIL.test(email) || email.length > 254) {
    return res.status(400).json({ ok: false, error: 'That does not look like an email address.' });
  }
  if (!message) {
    return res.status(400).json({ ok: false, error: 'Tell us what happened, even briefly.' });
  }
  if (message.length > LONGEST) {
    return res.status(400).json({ ok: false, error: 'That is longer than this form can carry. Send us the short version and we will write back.' });
  }

  const key = process.env.RESEND_KEY;
  if (!key) {
    console.error('[download-help] RESEND_KEY is not set on this deployment');
    return res.status(502).json({
      ok: false,
      error: `We could not send that. Write to ${SUPPORT} and we’ll pick it up there.`,
    });
  }

  /* Everything the browser can tell us about the failure without anybody being
     asked for it, which is most of what makes one of these reproducible. */
  const platform = PLATFORMS[String(body.platform || '').toLowerCase()] || PLATFORMS.unknown;
  const agent = String(req.headers['user-agent'] || 'not given');
  const source = String(req.headers['referer'] || 'fosbury.ai');

  try {
    await send(key, {
      from: FROM,
      to: [SUPPORT],
      /* So hitting reply goes to the person the download failed for. */
      reply_to: email,
      subject: `Download help: ${platform} — ${email}`,
      text: [
        message,
        '',
        '—',
        `From:     ${email}`,
        `Platform: ${platform}`,
        `Browser:  ${agent}`,
        `Page:     ${source}`,
      ].join('\n'),
      html: `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;font-size:15px;line-height:1.6;color:#282a30;max-width:560px">
  <p style="margin:0 0 20px;white-space:pre-wrap">${paragraphs(message)}</p>
  <table style="border-top:1px solid #e6e6e9;padding-top:14px;margin-top:14px;font-size:13px;color:#8a8f98;border-collapse:collapse">
    <tr><td style="padding:2px 14px 2px 0">From</td><td style="padding:2px 0"><a href="mailto:${esc(email)}" style="color:#5e6ad2">${esc(email)}</a></td></tr>
    <tr><td style="padding:2px 14px 2px 0">Platform</td><td style="padding:2px 0">${esc(platform)}</td></tr>
    <tr><td style="padding:2px 14px 2px 0">Browser</td><td style="padding:2px 0">${esc(agent)}</td></tr>
    <tr><td style="padding:2px 14px 2px 0">Page</td><td style="padding:2px 0">${esc(source)}</td></tr>
  </table>
</div>`,
    });
  } catch (error) {
    console.error('[download-help] the letter did not send', error);
    return res.status(502).json({
      ok: false,
      error: `We could not send that. Write to ${SUPPORT} and we’ll pick it up there.`,
    });
  }

  return res.status(200).json({ ok: true });
}

function safeParse(text) {
  try { return JSON.parse(text); } catch { return {}; }
}
