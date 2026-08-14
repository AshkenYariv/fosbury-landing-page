/**
 * The download-help form, and where its one letter goes.
 *
 * This endpoint is the last thing standing between somebody a download has
 * already failed for and giving up, so the ways it can fail quietly are worth
 * saying out loud: a letter addressed to the wrong inbox, a reply that goes
 * nowhere, a subject line broken by something typed into a form, or a form that
 * accepts a submission it never sent.
 *
 * Neither an inbox nor Resend is involved: `fetch` is a stand-in that agrees to
 * everything and keeps what it was handed.
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
    return (await import(`../api/download-help.js?copy=${copy++}`)).default;
  } finally {
    for (const [name, value] of Object.entries(kept)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
}

/** Post one report and hand back the letter it sent, if it sent one. */
async function post(handler, body, { key = 'test-key', headers = {} } = {}) {
  const sent = [];
  const keptFetch = globalThis.fetch;
  const keptKey = process.env.RESEND_KEY;

  /* Read when the request arrives rather than when the module loads, so it
     belongs here rather than in `load`. */
  if (key) process.env.RESEND_KEY = key;
  else delete process.env.RESEND_KEY;

  globalThis.fetch = async (_url, init) => {
    sent.push(JSON.parse(init.body));
    return { ok: true, status: 200, json: async () => ({ id: 'test' }), text: async () => '' };
  };

  const out = {};
  const res = {
    setHeader() {},
    status(code) { out.code = code; return res; },
    json(payload) { out.body = payload; return res; },
  };

  try {
    await handler(
      {
        method: 'POST',
        body,
        headers: { referer: 'https://fosbury.ai/', 'user-agent': 'TestBrowser/1.0', ...headers },
      },
      res,
    );
  } finally {
    globalThis.fetch = keptFetch;
    if (keptKey === undefined) delete process.env.RESEND_KEY;
    else process.env.RESEND_KEY = keptKey;
  }

  return { letter: sent[0], sent, out };
}

const report = (extra = {}) => ({
  email: 'stuck@example.com',
  message: 'The Mac download stops at 40%, every time.',
  platform: 'macos',
  ...extra,
});

test('the letter goes to hello@, and a reply goes to whoever is stuck', async () => {
  const handler = await load();

  const { letter, out } = await post(handler, report());

  assert.equal(out.code, 200);
  assert.equal(out.body.ok, true);
  /* The alias, not the mailbox behind it: this is the address the dialog shows
     people, and Google can be told to land it somewhere else without a deploy. */
  assert.deepEqual(letter.to, ['hello@fosbury.ai']);
  assert.equal(letter.from, 'Fosbury <hello@fosbury.ai>');
  assert.equal(letter.reply_to, 'stuck@example.com');
});

test('the letter carries what nobody had to be asked for', async () => {
  const handler = await load();

  const { letter } = await post(handler, report());

  /* What makes one of these reproducible, and none of it typed by hand. */
  assert.match(letter.text, /The Mac download stops at 40%/);
  assert.match(letter.text, /macOS/);
  assert.match(letter.text, /TestBrowser\/1\.0/);
  assert.match(letter.text, /https:\/\/fosbury\.ai\//);
  assert.match(letter.subject, /macOS/);
  assert.match(letter.subject, /stuck@example\.com/);
});

test('a platform the page did not recognise is said to be unrecognised, not printed', async () => {
  const handler = await load();

  /* The subject line is built out of this, and a subject line is somewhere a
     newline does real damage — so it is matched against a list rather than
     escaped and hoped for. */
  const { letter } = await post(handler, report({ platform: 'haiku\nBcc: someone@evil.example' }));

  assert.ok(!letter.subject.includes('\n'), 'a newline reached the subject line');
  assert.ok(!letter.subject.includes('evil.example'), 'an arbitrary platform reached the subject line');
  assert.match(letter.subject, /Not a machine we recognised/);
});

test('what was typed cannot become markup in the letter we read', async () => {
  const handler = await load();

  const { letter } = await post(handler, report({ message: '<img src=x onerror=alert(1)>\nsecond line' }));

  assert.ok(!letter.html.includes('<img'), 'the message became markup');
  assert.match(letter.html, /&lt;img/);
  /* Escaped first and broken into lines after, so the break survives. */
  assert.match(letter.html, /<br>second line/);
});

test('an address that is not one, and a report that says nothing, are refused', async () => {
  const handler = await load();

  const bad = await post(handler, report({ email: 'not-an-address' }));
  assert.equal(bad.out.code, 400);
  assert.equal(bad.sent.length, 0, 'a letter went out about an address we rejected');

  const empty = await post(handler, report({ message: '   ' }));
  assert.equal(empty.out.code, 400);
  assert.equal(empty.sent.length, 0);

  const huge = await post(handler, report({ message: 'x'.repeat(4001) }));
  assert.equal(huge.out.code, 400);
  assert.equal(huge.sent.length, 0);
});

test('the honeypot is answered with yes, and nothing is sent', async () => {
  const handler = await load();

  const { sent, out } = await post(handler, report({ company: 'Acme' }));

  /* Told it was refused, an automated submission learns which field gave it
     away. A 200 with nothing sent costs us nothing and teaches it nothing. */
  assert.equal(out.code, 200);
  assert.equal(out.body.ok, true);
  assert.equal(sent.length, 0, 'the honeypot sent a letter');
});

test('with nowhere to send it, the page is given the address instead', async () => {
  const handler = await load();

  const { out, sent } = await post(handler, report(), { key: null });

  assert.equal(out.code, 502);
  assert.equal(out.body.ok, false);
  /* The one thing this endpoint must never be is a dead end. */
  assert.match(out.body.error, /hello@fosbury\.ai/);
  assert.equal(sent.length, 0);
});

test('a deployment that should not write to the real inbox can say so', async () => {
  const handler = await load({
    EMAIL_FROM: 'Preview <preview@example.com>',
    EMAIL_SUPPORT: 'nowhere@example.com',
  });

  const { letter } = await post(handler, report());

  assert.deepEqual(letter.to, ['nowhere@example.com']);
  assert.equal(letter.from, 'Preview <preview@example.com>');
});

test('only POST', async () => {
  const handler = await load();
  const out = {};
  const res = { setHeader() {}, status(c) { out.code = c; return res; }, json(b) { out.body = b; return res; } };

  await handler({ method: 'GET', headers: {} }, res);

  assert.equal(out.code, 405);
});
