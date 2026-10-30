import test from 'node:test';
import assert from 'node:assert/strict';
import { read, write } from './storage.js';

test('bookmarks and exact reading position survive a storage round trip', () => {
  const values = new Map();
  globalThis.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const position = { y: 1587, period: 'phong-kien', group: 'tran', event: 'bach-dang-1288' };
  assert.equal(write('saved', ['bach-dang-1288']), true);
  assert.deepEqual(read('saved', []), ['bach-dang-1288']);
  write('position', position);
  assert.deepEqual(read('position', null), position);
  assert.ok(values.has('dong-su-viet:position'));
});

test('unavailable or corrupted browser storage does not crash the experience', () => {
  globalThis.localStorage = { getItem: () => '{broken json', setItem: () => { throw new Error('quota exceeded'); } };
  assert.deepEqual(read('saved', []), []);
  assert.equal(write('saved', ['doc-lap']), false);
  globalThis.localStorage = { getItem: () => { throw new Error('access denied'); } };
  assert.equal(read('position', null), null);
});
