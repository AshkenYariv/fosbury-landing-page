/**
 * The counting map in README.md, held to the page it describes.
 *
 * A button somebody added without adding it to the map is still counted — `track.js` reads the
 * attribute — but nobody reading the map knows to look for it, which is how a number goes unread for
 * a year. And a GA id that differs between the map and the script is somebody checking the wrong
 * property and concluding nobody came.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const page = read('index.html');
const readme = read('README.md');
const map = readme.split('## What is counted')[1]?.split('\n## ')[0] ?? '';

test('every live data-track on the page is in the map', () => {
  /* Commented-out markup is the download surface, switched off; the map lists it separately. */
  const live = page.replace(/<!--[\s\S]*?-->/g, '');
  const tracked = [...new Set([...live.matchAll(/data-track="([^"]+)"/g)].map((m) => m[1]))];
  assert.ok(tracked.length > 0, 'found no data-track at all');
  /* The map shortens a run of one family to `… 02 It already replied`, so a name counts as
     listed when it, or its tail after the family prefix, appears. */
  const missing = tracked.filter((name) => {
    const tail = name.split(' — ').slice(1).join(' — ');
    return !map.includes(`\`${name}\``) && !(tail && map.includes(`… ${tail}`));
  });
  assert.deepEqual(missing, [], 'on the page but not in README.md → What is counted');
});

test('the map and the script name the same GA4 property', () => {
  const id = read('scripts/analytics.js').match(/const ID = '(G-[A-Z0-9]+)'/)?.[1];
  assert.ok(id, 'scripts/analytics.js has no GA4 id');
  assert.ok(map.includes(id), `README.md does not name ${id}`);
  assert.ok(read('product-metrics/README.md').includes(id), `product-metrics/README.md does not name ${id}`);
});

test('the page loads the GA door before the map that sends through it', () => {
  const door = page.indexOf('<script defer src="/scripts/analytics.js">');
  const sender = page.indexOf('<script defer src="/scripts/track.js">');
  assert.ok(door > -1, 'index.html does not load scripts/analytics.js');
  assert.ok(sender > door, 'scripts/analytics.js must come before scripts/track.js');
});
