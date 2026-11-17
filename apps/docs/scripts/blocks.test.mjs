import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { blockIds, docs } from './paths.mjs';

const ids = new Set(blockIds());
const categories = JSON.parse(readFileSync(join(docs, 'src/data/block-categories.json'), 'utf8'));

describe('blocks: what the docs add to the manifest', () => {
  it('reads the manifest', () => {
    assert.ok(ids.size > 0);
  });

  it('puts only listed blocks in a category, each in one', () => {
    const named = Object.values(categories).flat();
    assert.deepEqual(
      named.filter((id) => !ids.has(id)),
      [],
    );
    assert.equal(new Set(named).size, named.length);
  });

  it('has screenshots only of listed blocks, light and dark', () => {
    const files = readdirSync(join(docs, 'public/_docs/blocks'));
    const shot = /^(.+)-(light|dark)\.webp$/;
    assert.deepEqual(
      files.filter((file) => !ids.has(file.match(shot)?.[1])),
      [],
    );
    const pair = (file) =>
      file.replace(shot, (_, id, theme) => `${id}-${theme === 'light' ? 'dark' : 'light'}.webp`);
    assert.deepEqual(
      files.filter((file) => !files.includes(pair(file))),
      [],
    );
  });
});
