/**
 * Which address each letter carries.
 *
 * Two letters leave the endpoint and they point in opposite directions: the
 * confirmation goes out to a stranger and has to be able to come back to us,
 * the notice comes to us and has to be able to go back to the stranger. Moving
 * the mail to Google turned those addresses into settings, and a setting that
 * is wrong is not a crash — it is mail quietly arriving somewhere nobody is
 * reading. So it is worth a test rather than a second look at the file.
 *
 * Neither a database nor Resend is involved: `record` is left without a
 * `DATABASE_URL` so it says so and returns, and `fetch` is a stand-in that
 * agrees to everything and keeps what it was handed.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

let copy = 0;

/**
 * The addresses are read once, when the module loads, which is the whole point
 * of them being constants. A test that wants a different set therefore needs a
 * module of its own, and the query string is what makes it one.
 */
async function load(env = {}) {
  const kept = {};
  for (const [name, value] of Object.entries(env)) {
    kept[name] = process.env[name];
    process.env[name] = value;
  }
  try {
    return (await import(`../api/waitlist.js?copy=${copy++}`)).default;
  } finally {
    for (const [name, value] of Object.entries(kept)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
}

/** Post one address and hand back the letters that were sent about it. */
async function letters(handler, email = 'someone@example.com') {
  const sent = [];
  const kept = {
    fetch: globalThis.fetch,
    url: process.env.DATABASE_URL,
    pg: process.env.POSTGRES_URL,
    key: process.env.RESEND_KEY,
  };

  /* No database on this "deployment", so the row is skipped and said to be
     skipped. The notice going out is what keeps that from being a 502. */
  delete process.env.DATABASE_URL;
  delete process.env.POSTGRES_URL;
  /* Unlike the addresses, the key is read when the request arrives rather than
     when the module loads, so it has to be here rather than in `load`. */
  process.env.RESEND_KEY = 'test-key';

  globalThis.fetch = async (_url, init) => {
    sent.push(JSON.parse(init.body));
    return { ok: true, status: 200, json: async () => ({ id: 'test' }), text: async () => '' };
  };

  const out = {};
  const res = {
    setHeader() {},
    status(code) { out.code = code; return res; },
    json(body) { out.body = body; return res; },
  };

  try {
    await handler(
      { method: 'POST', body: { email }, headers: { referer: 'https://fosbury.ai/' } },
      res,
    );
  } finally {
    globalThis.fetch = kept.fetch;
    if (kept.url) process.env.DATABASE_URL = kept.url;
    if (kept.pg) process.env.POSTGRES_URL = kept.pg;
    if (kept.key) process.env.RESEND_KEY = kept.key;
    else delete process.env.RESEND_KEY;
  }

  /* The notice is sent before the confirmation, and that order is the endpoint's
     own: the lead is held on to before anybody is thanked. */
  const [notice, welcome] = sent;
  return { notice, welcome, out };
}

test('the confirmation comes from the alias, and a reply goes back to it', async () => {
  const handler = await load();

  const { welcome } = await letters(handler, 'lead@example.com');

  assert.deepEqual(welcome.to, ['lead@example.com']);
  assert.equal(welcome.from, 'Fosbury <hello@fosbury.ai>');
  /* The alias, not the mailbox behind it: this address outlives whoever reads
     it, and Google can be told to land it somewhere else without a deploy. */
  assert.equal(welcome.reply_to, 'hello@fosbury.ai');
});

test('the notice goes to the mailbox, and replies to whoever signed up', async () => {
  const handler = await load();

  const { notice } = await letters(handler, 'lead@example.com');

  assert.deepEqual(notice.to, ['yariv@fosbury.ai']);
  assert.equal(notice.reply_to, 'lead@example.com');
  assert.match(notice.subject, /lead@example\.com/);
});

test('nothing is addressed to the personal inbox any more', async () => {
  const handler = await load();

  const { notice, welcome } = await letters(handler);

  /* Said out loud, because "no gmail in it" is also true of no letter at all,
     and a test that passes when nothing was sent is worse than no test. */
  assert.ok(notice && welcome, 'both letters should have been sent');
  assert.ok(
    !JSON.stringify([notice, welcome]).includes('gmail.com'),
    'a personal inbox is still somewhere in the mail',
  );
});

test('a deployment that should not write to the real inbox can say so', async () => {
  const handler = await load({
    EMAIL_FROM: 'Preview <preview@example.com>',
    EMAIL_REPLY_TO: 'replies@example.com',
    EMAIL_NOTIFY: 'notices@example.com',
  });

  const { notice, welcome } = await letters(handler);

  assert.equal(welcome.from, 'Preview <preview@example.com>');
  assert.equal(welcome.reply_to, 'replies@example.com');
  assert.deepEqual(notice.to, ['notices@example.com']);
  assert.equal(notice.from, 'Preview <preview@example.com>');
});
