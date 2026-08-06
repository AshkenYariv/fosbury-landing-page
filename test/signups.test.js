/**
 * What happens to an address on its way to the table.
 *
 * The statements themselves are run against a real Postgres by
 * `test/schema.test.js`, which is where a typo in the SQL would show up. This
 * file is about the shape around them: the first sign-up on a database with no
 * table yet, the second sign-up from somebody who already asked, a deployment
 * that was never given a database at all. None of those need a database to be
 * true, so none of them have one — `record` takes its connection as an argument
 * and here it is handed a stand-in that writes down what it was asked and
 * answers however the test needs it to.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { record, UPSERT } from '../lib/signups.js';

/**
 * A stand-in for the driver, which is asked for things exactly one way:
 * `query(text, params)`. Every call is kept so a test can say what was asked.
 */
function fakeSql(answer) {
  const calls = [];
  return {
    calls,
    query(text, params) {
      calls.push({ text, params });
      return Promise.resolve(answer(text, calls.length));
    },
  };
}

const rows = (times) => [{ id: 7, times }];
const opening = (call) => call.text.trim().split(/\s+/).slice(0, 3).join(' ');

test('a first sign-up comes back stored, and not as a returning one', async () => {
  const sql = fakeSql(() => rows(1));

  const written = await record('someone@example.com', 'https://fosbury.ai/', sql);

  assert.deepEqual(written, { stored: true, id: 7, returning: false });
  assert.equal(sql.calls.length, 1);
  assert.equal(sql.calls[0].text, UPSERT);
  /* The address and where it came from are parameters, never spliced in. */
  assert.deepEqual(sql.calls[0].params, ['someone@example.com', 'https://fosbury.ai/']);
});

test('asking again is the same row, and says so', async () => {
  const sql = fakeSql(() => rows(2));

  const written = await record('someone@example.com', null, sql);

  assert.equal(written.stored, true);
  assert.equal(written.returning, true);
});

test('no table yet: the schema goes in and the write is tried again', async () => {
  const missing = Object.assign(new Error('relation does not exist'), { code: '42P01' });
  /* Missing the first time, and there by the time it is asked again. */
  const sql = fakeSql((text, nth) => {
    if (nth === 1) throw missing;
    return text.trim().startsWith('create') ? [] : rows(1);
  });

  const written = await record('someone@example.com', 'https://fosbury.ai/', sql);

  assert.equal(written.stored, true);
  assert.deepEqual(sql.calls.map(opening), [
    'insert into waitlist_signups',
    'create table if',
    'create unique index',
    'insert into waitlist_signups',
  ]);
});

test('a table that stays missing is an error, not an endless retry', async () => {
  const missing = Object.assign(new Error('relation does not exist'), { code: '42P01' });
  const sql = fakeSql((text) => {
    if (text.trim().startsWith('create')) return [];
    throw missing;
  });

  await assert.rejects(() => record('someone@example.com', null, sql), /relation does not exist/);
  assert.equal(sql.calls.filter((call) => opening(call).startsWith('insert')).length, 2);
});

test('anything else is thrown rather than swallowed', async () => {
  const broken = Object.assign(new Error('connection refused'), { code: 'ECONNREFUSED' });
  const sql = fakeSql(() => { throw broken; });

  await assert.rejects(() => record('someone@example.com', null, sql), /connection refused/);
  /* One attempt. A refused connection is not a missing table. */
  assert.equal(sql.calls.length, 1);
});

test('a deployment with no database says so rather than pretending', async () => {
  const kept = { url: process.env.DATABASE_URL, pg: process.env.POSTGRES_URL };
  delete process.env.DATABASE_URL;
  delete process.env.POSTGRES_URL;

  try {
    const written = await record('someone@example.com', null);
    assert.equal(written.stored, false);
    assert.match(written.reason, /DATABASE_URL/);
  } finally {
    if (kept.url) process.env.DATABASE_URL = kept.url;
    if (kept.pg) process.env.POSTGRES_URL = kept.pg;
  }
});
