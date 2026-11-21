/**
 * The keys of a filter field over a list of links: the sidebars and the search palette
 * (`src/components/listKeys.ts`). Stop 0 is the field, the links follow.
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { listStop } from '../src/lib/listStops.mjs';

const sidebar = (key, at, extra = {}) => listStop({ key, at, links: 5, hasField: true, ...extra });

describe('arrow keys', () => {
  it('move from the field to the first link and back', () => {
    assert.deepEqual(sidebar('ArrowDown', 0), { focus: 1 });
    assert.deepEqual(sidebar('ArrowUp', 1), { focus: 0 });
  });

  it('move one link at a time', () => {
    assert.deepEqual(sidebar('ArrowDown', 2), { focus: 3 });
    assert.deepEqual(sidebar('ArrowUp', 3), { focus: 2 });
  });

  it('stop at the ends without scrolling the page', () => {
    assert.deepEqual(sidebar('ArrowDown', 5), { focus: 5 });
    assert.deepEqual(sidebar('ArrowUp', 0), { focus: 0 });
  });

  it('stay in the field when the filter hides every link', () => {
    assert.equal(listStop({ key: 'ArrowDown', at: 0, links: 0, hasField: true }), null);
  });
});

describe('Home and End', () => {
  it('jump to the first and the last link from a link', () => {
    assert.deepEqual(sidebar('Home', 4), { focus: 1 });
    assert.deepEqual(sidebar('End', 2), { focus: 5 });
  });

  it('move the caret in the field', () => {
    assert.equal(sidebar('Home', 0), null);
    assert.equal(sidebar('End', 0), null);
  });

  it('count from the first link when there is no field', () => {
    assert.deepEqual(listStop({ key: 'Home', at: 3, links: 4, hasField: false }), { focus: 0 });
    assert.deepEqual(listStop({ key: 'End', at: 0, links: 4, hasField: false }), { focus: 3 });
  });
});

describe('Enter', () => {
  it('in the field opens the first link', () => {
    assert.deepEqual(sidebar('Enter', 0), { open: true });
  });

  it('in the field does nothing when no link matches', () => {
    assert.equal(listStop({ key: 'Enter', at: 0, links: 0, hasField: true }), null);
  });

  it('on a link is left to the link', () => {
    assert.equal(sidebar('Enter', 2), null);
  });
});

describe('keys that are not ours', () => {
  it('ignores keys while an IME composes, so Enter commits the text', () => {
    assert.equal(sidebar('Enter', 0, { composing: true }), null);
    assert.equal(sidebar('ArrowDown', 0, { composing: true }), null);
  });

  it('ignores shortcuts with Alt, Ctrl or Meta', () => {
    assert.equal(sidebar('ArrowDown', 1, { modified: true }), null);
  });

  it('ignores focus outside the field and the links', () => {
    assert.equal(sidebar('ArrowDown', -1), null);
  });

  it('ignores other keys, Tab included', () => {
    assert.equal(sidebar('Tab', 1), null);
    assert.equal(sidebar('a', 0), null);
  });
});
