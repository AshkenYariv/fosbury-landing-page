/**
 * Where a sign-up is kept.
 *
 * Until now the record of somebody asking for access was an email in an inbox.
 * That works right up until it does not: a letter that fails to send is a lead
 * that never existed, and an inbox cannot answer "how many this week" without
 * somebody counting by hand. So the address goes in a table, and the letters
 * become what they always should have been — a notification about a row that
 * already exists.
 *
 * The database is the Neon one behind the messaging app, reached through the
 * connection string Vercel puts in the environment. Shared deliberately rather
 * than stood up alongside: there is one product here, and one place to look for
 * who wants in. Nothing in that app knows about this table, and its push and
 * pull both enumerate only their own eighteen, so the two live in one database
 * without either having to know about the other.
 *
 * Needs `DATABASE_URL` (or `POSTGRES_URL`, which is what some of Vercel's
 * integrations call the same string) on the project. Without one this says so
 * and the endpoint carries on with the letters alone — a landing page that
 * stopped taking addresses because a database was missing would be a worse
 * failure than the one this fixes.
 */

import { neon } from '@neondatabase/serverless';

/*
 * The HTTP driver rather than a TCP client: one statement per sign-up, from a
 * function that is usually cold, and there is no connection to open, hand back,
 * or forget to close.
 */
const URL_KEYS = ['DATABASE_URL', 'POSTGRES_URL'];

/**
 * The table, written down once.
 *
 * `citext` would be the tidier way to say "one address, however it was typed",
 * but it is an extension and this is not our database to add extensions to. A
 * unique index on `lower(email)` says the same thing and installs nothing.
 */
export const SCHEMA = [
  `create table if not exists waitlist_signups (
     id          bigint generated always as identity primary key,
     email       text        not null,
     source      text,
     first_seen  timestamptz not null default now(),
     last_seen   timestamptz not null default now(),
     times       integer     not null default 1
   )`,
  `create unique index if not exists waitlist_signups_email
     on waitlist_signups (lower(email))`,
];

/**
 * One address, in.
 *
 * Signing up twice is not an error and not a second row: it is the same person
 * asking again, which is worth knowing, so the second time bumps a count and a
 * timestamp. `coalesce` on the source because a later ask that cannot say where
 * it came from is not evidence that the first one was wrong.
 *
 * A string with placeholders rather than a template tag, so that the statement
 * this ships is the statement the tests run against a real Postgres.
 */
export const UPSERT = `
  insert into waitlist_signups (email, source)
  values ($1, $2)
  on conflict (lower(email)) do update
    set last_seen = now(),
        times     = waitlist_signups.times + 1,
        source    = coalesce(excluded.source, waitlist_signups.source)
  returning id, times`;

function connection() {
  const key = URL_KEYS.find((name) => process.env[name]);
  return key ? neon(process.env[key]) : null;
}

/**
 * Record one address, and say what happened to it — the caller has to be able
 * to tell somebody the true thing about whether this was written down.
 *
 * `sql` is a seam, and the only one: the tests hand it a stand-in so that the
 * shape of this — a database that has never seen the table, an address that has
 * been here before — is exercised without a database to hand.
 */
export async function record(email, source, sql = connection()) {
  if (!sql) return { stored: false, reason: 'no DATABASE_URL on this deployment' };

  try {
    return await insert(sql, email, source);
  } catch (error) {
    /*
     * `42P01` is "no such table", which is less a failure than a first run:
     * nobody has to remember to migrate a database before the page can take an
     * address. Put the schema in place and try once more. Anything else — and
     * the second attempt failing too — is a real error and is thrown.
     *
     * Deliberately not remembered between requests. A flag saying "the table is
     * there" is a flag that is wrong the day somebody drops it, and the cost of
     * being wrong the other way is one extra round trip on a cold start against
     * a database that has never seen this table.
     */
    if (error && error.code === '42P01') {
      for (const statement of SCHEMA) await sql.query(statement);
      return insert(sql, email, source);
    }
    throw error;
  }
}

async function insert(sql, email, source) {
  const rows = await sql.query(UPSERT, [email, source]);
  const row = rows[0];
  return { stored: true, id: row.id, returning: row.times > 1 };
}
