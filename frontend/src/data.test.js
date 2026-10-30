import test from 'node:test';
import assert from 'node:assert/strict';
import { periods, events, people, search, formatYear } from './data.js';

test('every event has a valid group, source, unique ID, and existing related people', () => {
  const groups = new Set(periods.flatMap(p => p.groups.map(g => g.id)));
  assert.equal(new Set(events.map(e => e.id)).size, events.length);
  for (const e of events) {
    assert.ok(groups.has(e.group), e.id);
    assert.ok(e.sources.length, e.id);
    for (const id of e.people) assert.ok(people.some(p => p.id === id), id);
  }
  for (const group of groups) {
    const years = events.filter(e => e.group === group).map(e => e.year);
    assert.deepEqual(years, [...years].sort((a, b) => a - b));
  }
});
test('search handles Vietnamese accents, aliases, years and empty queries', () => {
  assert.ok(search('bach dang').some(e => e.id === 'bach-dang-1288'));
  assert.ok(search('tran quoc tuan').some(e => e.id === 'tran-hung-dao'));
  assert.ok(search('1945').some(e => e.id === 'doc-lap'));
  assert.ok(search('ĐỔI MỚI').some(e => e.id === 'doi-moi'));
  assert.equal(search('   ').length, 0);
  assert.equal(search('not-a-historical-event').length, 0);
  assert.equal(formatYear(-700), '700 TCN');
});
