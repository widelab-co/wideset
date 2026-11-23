/**
 * The token graph as agents receive it: `/graph.json` from a real docs build
 * (src/lib/tokenUsage.ts renders every playground, so it only runs inside Astro). CI builds the
 * docs before `pnpm test`; without a build (`pnpm --filter @wideset/docs build`) the suite skips.
 *
 * The shape checks are the format contract: a change to the Anatomy tab's labels in
 * tokenClasses.ts, or to how the graph is assembled, must not silently change what agents read.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { docs } from './paths.mjs';

const file = join(docs, 'dist/graph.json');
const built = existsSync(file);
const graph = built ? JSON.parse(readFileSync(file, 'utf8')) : null;
const uses = (id) => graph.componentTokens[id].uses;
const find = (id, part, className) =>
  uses(id).find((use) => use.part === part && use.className === className);

describe('graph.json: format', { skip: !built && 'no docs build (dist/graph.json)' }, () => {
  it('has a version and every section', () => {
    assert.equal(graph.version, 1);
    for (const key of ['components', 'edges', 'componentTokens', 'tokens'])
      assert.ok(graph[key], key);
  });

  it('gives every component a token use', () => {
    for (const { id } of graph.components)
      assert.ok(graph.componentTokens[id]?.uses.length > 0, id);
  });

  it('writes uses and tokens with the same keys everywhere', () => {
    const allowed = new Set([
      'part',
      'internal',
      'nested',
      'className',
      'state',
      'property',
      'tokens',
      'group',
      'when',
    ]);
    for (const { uses: list } of Object.values(graph.componentTokens))
      for (const use of list) {
        for (const key of Object.keys(use)) assert.ok(allowed.has(key), key);
        assert.ok(Array.isArray(use.when) && use.when.length > 0, use.className);
        assert.ok(
          use.tokens.every((name) => graph.tokens[name]),
          use.className,
        );
      }
    for (const token of Object.values(graph.tokens))
      assert.deepEqual(Object.keys(token), ['alias', 'light', 'dark', 'usedBy']);
  });

  it('keys states for machines, not the Anatomy tab labels', () => {
    const states = new Set(
      Object.values(graph.componentTokens).flatMap(({ uses: list }) =>
        list.map((use) => use.state),
      ),
    );
    for (const state of states)
      assert.match(state, /^[a-z]+(:[\w-]+)?(\+[a-z]+(:[\w-]+)?)*$/, state);
  });
});

describe('graph.json: what it says', { skip: !built && 'no docs build (dist/graph.json)' }, () => {
  it('files a CVA class under its compound variant', () => {
    assert.deepEqual(find('button', 'Button', 'bg-ws-dynamic-primary-default')?.when, [
      { variant: 'primary', preset: 'filled' },
    ]);
  });

  it('reads a state prefix as the state', () => {
    assert.equal(find('button', 'Button', 'hover:bg-ws-dynamic-primary-hover')?.state, 'hover');
  });

  it('resolves a token to light and dark primitives and lists who uses it', () => {
    const token = graph.tokens['--background-color-ws-dynamic-primary-default'];
    assert.match(token.light, /^--ws-colors-light-/);
    assert.match(token.dark, /^--ws-colors-dark-/);
    assert.ok(token.usedBy.includes('button'));
  });

  it('includes the internal parts FormField renders', () => {
    const internal = new Set(
      uses('form-field')
        .filter((use) => use.internal)
        .map((use) => use.part),
    );
    assert.ok(internal.has('FieldLabel'));
    assert.ok(internal.has('HelperText'));
  });

  it('reads Accordion from its own parts', () => {
    assert.ok(
      uses('accordion').some(
        (use) =>
          use.part === 'AccordionItem' &&
          use.tokens.includes('--border-color-ws-dynamic-secondary-disabled'),
      ),
    );
  });

  it('keeps IconButton out of Button', () => {
    assert.ok(uses('button').every((use) => use.part.startsWith('Button')));
    assert.ok(uses('icon-button').some((use) => use.part === 'IconButton'));
  });

  it('gives a class a component adds conditionally its condition (Checkbox label)', () => {
    assert.deepEqual(find('checkbox', 'CheckboxLabel', 'text-ws-static-subtle')?.when, [
      { disabled: true },
    ]);
  });

  it('files a layout prefix under the state, not as one', () => {
    // Checkbox writes `[&_svg]:size-ws-…`-style child selectors; none may become a state.
    const states = uses('checkbox').map((use) => use.state);
    assert.ok(states.every((state) => !/[[&>_]/.test(state)));
  });

  it('reads a portalled part from its variants (Sidepanel panel by side)', () => {
    assert.deepEqual(find('sidepanel', 'SidepanelPanel', 'right-ws-5')?.when, [{ side: 'right' }]);
    assert.ok(find('dropdown-menu', 'DropdownMenuContent', 'bg-ws-static-overlay'));
  });
});
