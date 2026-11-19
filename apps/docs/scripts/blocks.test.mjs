import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { blockIds, docs } from './paths.mjs';

const ids = new Set(blockIds());
const categories = JSON.parse(readFileSync(join(docs, 'src/data/block-categories.json'), 'utf8'));

describe('blocks: what the docs add to the manifest', () => {
  it('reads the manifest', () => {
    assert.ok(ids.size > 0);
  });

  // The list also names blocks still on their way into the library (open pull requests), so they
  // land in their section the moment they merge; the gallery skips an id the manifest lacks.
  it('puts every block in one category at most', () => {
    const named = Object.values(categories).flat();
    assert.equal(new Set(named).size, named.length);
  });

  it('names every block the manifest has', () => {
    const named = new Set(Object.values(categories).flat());
    assert.deepEqual(
      [...ids].filter((id) => !named.has(id)),
      [],
    );
  });
});
