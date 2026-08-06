/**
 * The statements, against a real Postgres.
 *
 * `test/signups.test.js` proves the shape of the code around the SQL with a
 * stand-in; this proves the SQL itself, which a stand-in cannot: that the DDL
 * parses and is safe to run twice, that two spellings of one address are one
 * row, and that asking again does not quietly wipe what the first ask told us.
 *
 * It needs a Postgres to talk to and skips itself when there is not one, so
 * `npm test` still means something on a machine without a database. Locally
 * that is whatever `psql` would connect to; set `TEST_DATABASE_URL` to point it
 * somewhere else. Never a database that matters — it drops its own table.
 */

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const DB = process.env.TEST_DATABASE_URL || 'postgres:///fosbury_signups_test';

function psql(sql) {
  return execFileSync('psql', [DB, '-X', '-q', '-A', '-t', '-v', 'ON_ERROR_STOP=1', '-c', sql], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

let live = false;
try {
  execFileSync('createdb', ['fosbury_signups_test'], { stdio: 'ignore' });
} catch { /* Already there, or no Postgres — the ping below is what decides. */ }
try {
  psql('select 1');
  live = true;
} catch { /* No database to talk to. Every test here skips. */ }

/* The shipped statements, not a copy of them. */
const { SCHEMA, UPSERT } = await import('../lib/signups.js');

before(() => { if (live) psql('drop table if exists waitlist_signups'); });
after(() => { if (live) psql('drop table if exists waitlist_signups'); });

test('the schema applies, and applies again', { skip: !live && 'no Postgres' }, () => {
  for (const statement of SCHEMA) psql(statement);
  for (const statement of SCHEMA) psql(statement);
  assert.equal(psql("select to_regclass('waitlist_signups') is not null"), 't');
});

test('one address however it is typed, and the first source is kept', { skip: !live && 'no Postgres' }, () => {
  for (const statement of SCHEMA) psql(statement);

  const write = (email, source) =>
    psql(UPSERT.replace('$1', `'${email}'`).replace('$2', source ? `'${source}'` : 'null'));

  write('Someone@Example.com', 'https://fosbury.ai/');
  write('someone@example.com', null);
  write('other@example.com', 'https://fosbury.ai/about');

  assert.equal(psql('select count(*) from waitlist_signups'), '2');
  assert.equal(psql("select times from waitlist_signups where lower(email) = 'someone@example.com'"), '2');
  /* The second ask had nothing to say about where it came from. It did not
     therefore say the first was wrong. */
  assert.equal(
    psql("select source from waitlist_signups where lower(email) = 'someone@example.com'"),
    'https://fosbury.ai/',
  );
  assert.equal(psql('select count(*) from waitlist_signups where last_seen < first_seen'), '0');
});
