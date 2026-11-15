import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { CATEGORY_ORDER, mergeBlocks, UNSORTED } from '../src/lib/blockList.mjs';
import { docs } from './paths.mjs';

const committed = JSON.parse(readFileSync(join(docs, 'src/data/blocks.json'), 'utf8'));

describe('blocks: the committed list', () => {
  it('gives every block a title, a description and a known category', () => {
    for (const block of committed) {
      assert.ok(block.title && block.description, block.id);
      assert.ok(CATEGORY_ORDER.includes(block.category), `${block.id}: ${block.category}`);
    }
    assert.equal(new Set(committed.map((block) => block.id)).size, committed.length);
  });

  it('has the screenshots it names, and no others', () => {
    const folder = join(docs, 'public/_docs/blocks');
    const expected = committed.flatMap((block) => [
      `${block.id}-light.webp`,
      ...(block.dark ? [`${block.id}-dark.webp`] : []),
    ]);
    assert.deepEqual(
      expected.filter((file) => !existsSync(join(folder, file))),
      [],
    );
    assert.deepEqual(readdirSync(folder).sort(), [...expected].sort());
  });
});

describe('blocks: the list the pages show', () => {
  it('falls back to the committed list while the library has no blocks', () => {
    const blocks = mergeBlocks(committed, [], []);
    assert.equal(blocks.length, committed.length);
    assert.ok(blocks.every((block) => !block.live && block.shot));
    const billing = blocks.find((block) => block.id === 'billing');
    assert.equal(billing.title, committed.find((block) => block.id === 'billing').title);
  });

  it('keeps the category order, then A–Z', () => {
    const blocks = mergeBlocks(committed, [], []);
    const order = blocks.map((block) => CATEGORY_ORDER.indexOf(block.category));
    assert.deepEqual(
      order,
      [...order].sort((a, b) => a - b),
    );
  });

  it('turns a block live when the library has its folder, with the library’s words', () => {
    const blocks = mergeBlocks(
      committed,
      [{ id: 'billing', title: 'Billing, renamed', description: 'From the library.' }],
      ['billing'],
    );
    const billing = blocks.find((block) => block.id === 'billing');
    assert.equal(billing.live, true);
    assert.equal(billing.title, 'Billing, renamed');
    assert.equal(billing.description, 'From the library.');
    assert.equal(billing.category, 'Finance & billing');
    assert.equal(blocks.filter((block) => block.live).length, 1);
  });

  it('lists a block only the library knows, last and without a screenshot', () => {
    const blocks = mergeBlocks(committed, [], ['brand-new-screen']);
    const added = blocks.at(-1);
    assert.deepEqual(
      { ...added },
      {
        id: 'brand-new-screen',
        title: 'Brand new screen',
        description: '',
        category: UNSORTED,
        dark: false,
        shot: false,
        live: true,
      },
    );
  });

  it('ignores a block the library lists but has no folder for', () => {
    const blocks = mergeBlocks(committed, [{ id: 'ghost', title: 'Ghost', description: '' }], []);
    assert.equal(
      blocks.find((block) => block.id === 'ghost'),
      undefined,
    );
  });
});
