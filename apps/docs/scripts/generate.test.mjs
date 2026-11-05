/**
 * What the generators read out of the library, checked on the output a real run writes
 * (`pnpm --filter @wideset/docs test` runs scripts/generate.mjs first). These are the facts the
 * pages are built on: if a refactor of gen-props or gen-catalog breaks one, a page silently
 * shows a wrong rail, a missing default or a component that should not be there.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { generatedDir } from './paths.mjs';

const read = (name) => JSON.parse(readFileSync(join(generatedDir, name), 'utf8'));
const controls = read('controls.json');
const props = read('props.json');
const catalog = read('catalog.json');
const pages = read('pages.json');

const control = (type, name) => controls[type]?.find((row) => row.name === name);

describe('gen-props: playground controls', () => {
  it('reads a cva union and its default (Button variant)', () => {
    const variant = control('ButtonProps', 'variant');
    assert.equal(variant?.type, 'select');
    assert.ok(variant.values.includes('primary'));
    assert.ok(variant.values.includes('inverse'));
    assert.equal(variant.default, 'primary');
  });

  it('lists every member of a union (Tabs type, which once missed ghost)', () => {
    assert.deepEqual([...control('TabsProps', 'type').values].sort(), [
      'fullWidth',
      'ghost',
      'pills',
      'regular',
    ]);
  });

  it('reads booleans as switches', () => {
    assert.equal(control('ButtonProps', 'disabled')?.type, 'switch');
  });

  it('reads defaults (cva defaultVariants and destructuring)', () => {
    assert.equal(control('ButtonProps', 'size')?.default, 'md');
    assert.equal(control('TabsProps', 'size')?.default, 'sm');
    assert.equal(control('CheckboxProps', 'size')?.default, 'lg');
  });
});

describe('gen-props: props tables', () => {
  it('has JSDoc descriptions on own props', () => {
    const own = props.ButtonProps.props.filter((row) => row.source === 'own');
    assert.ok(own.length > 0);
    assert.ok(own.some((row) => row.description));
  });
});

describe('gen-catalog', () => {
  it('has one page per public component, internal ones left out', () => {
    const ids = catalog.map((entry) => entry.id);
    for (const id of ['button', 'icon-button', 'tabs', 'list-item', 'dropdown-menu'])
      assert.ok(ids.includes(id), id);
    for (const id of ['field-label', 'helper-text', 'scroll-area', 'thumbnail'])
      assert.ok(!ids.includes(id), `${id} is internal`);
  });

  it('gives every page a one-sentence description', () => {
    const missing = catalog.filter((entry) => !entry.description).map((entry) => entry.id);
    assert.deepEqual(missing, []);
  });

  it('points every page at its examples folder', () => {
    assert.equal(pages['icon-button'].examples, 'button/examples/icon-button');
    assert.equal(pages.tabs.examples, 'tabs/examples/tabs');
    assert.equal(pages.tabs.props, 'TabsProps');
  });

  it('has unique ids', () => {
    const ids = catalog.map((entry) => entry.id);
    assert.equal(new Set(ids).size, ids.length);
  });
});

describe('generate: foundations token data', () => {
  const tokens = read('tokens.json');

  it('resolves the spacing scale through the var() chain', () => {
    const step = tokens.spacing.find((row) => row.name === '--spacing-ws-4');
    assert.equal(step?.value, '0.375rem');
    assert.equal(step.primitive, '--ws-space-150');
    assert.equal(step.className, 'p-ws-4');
  });

  it('lists control and forms sizes apart from the scale', () => {
    assert.equal(tokens.sizes.find((row) => row.className === 'h-ws-forms-md')?.value, '2.5rem');
    assert.ok(tokens.spacing.every((row) => /^--spacing-ws-\d+$/.test(row.name)));
  });

  it('reads both radius ladders', () => {
    const groups = new Set(tokens.radius.map((row) => row.group));
    assert.deepEqual([...groups].sort(), ['container', 'control']);
    assert.equal(
      tokens.radius.find((row) => row.name === '--radius-ws-control-full')?.value,
      '624.9375rem',
    );
  });

  it('has every shadow-ws-* and drop-shadow-ws-* class', () => {
    const classes = tokens.shadows.map((row) => row.className);
    assert.equal(classes.length, 11);
    for (const name of ['shadow-ws-low', 'shadow-ws-forms-active', 'drop-shadow-ws-medium'])
      assert.ok(classes.includes(name), name);
    const low = tokens.shadows.find((row) => row.className === 'shadow-ws-low');
    assert.equal(low.variable, '--ws-elevation-low');
    assert.equal(low.dark, '0 0 0 0 transparent');
  });

  it('gives the reference a non-empty table per family', () => {
    for (const family of tokens.reference) assert.ok(family.tokens.length > 0, family.family);
  });

  it('resolves colours to light and dark primitives', () => {
    const background = tokens.reference.find((family) => family.family === 'background');
    const token = background.tokens.find((row) => row.className === 'bg-ws-static-background');
    assert.match(token.light, /^--ws-colors-light-/);
    assert.match(token.dark, /^--ws-colors-dark-/);
  });
});

describe('gen-token-usage: the token half of the graph', () => {
  const usage = read('token-usage.json');
  const uses = (id, filter) => usage.components[id].uses.filter(filter);

  it('reads a CVA class with the variant it sits under', () => {
    const [row] = uses(
      'button',
      (use) => use.class === 'bg-ws-dynamic-primary-default' && use.state === 'default',
    );
    assert.deepEqual(row?.when, { variant: 'primary', preset: 'filled' });
    assert.equal(row.token, '--ws-dynamic-fill-primary-default');
  });

  it('reads a state prefix as the state', () => {
    assert.ok(
      uses('button', (use) => use.class === 'bg-ws-dynamic-primary-hover')[0]?.state === 'hover',
    );
  });

  it('keeps the CVA defaults', () => {
    assert.equal(usage.components.button.defaults.variant, 'primary');
  });

  it('resolves a token to its light and dark primitive and the components it changes', () => {
    const token = usage.tokens['--ws-dynamic-fill-primary-default'];
    assert.match(token.light, /^--ws-colors-light-/);
    assert.match(token.dark, /^--ws-colors-dark-/);
    assert.ok(token.usedBy.includes('button'));
  });

  it('finds no ws class that points at nothing (a typo or a removed token)', () => {
    assert.deepEqual(usage.unresolved, {});
  });
});

describe('gen-guidance', () => {
  const page = (id) => readFileSync(join(generatedDir, 'guidance', `${id}.md`), 'utf8');

  it('gives every component a page from its spec', () => {
    const missing = catalog
      .map((entry) => entry.id)
      .filter((id) => !existsSync(join(generatedDir, 'guidance', `${id}.md`)));
    assert.deepEqual(missing, []);
  });

  it('shows on the page only when to use a component', () => {
    const select = page('select');
    assert.match(select, /^### When not to use/m);
    assert.doesNotMatch(select, /^### (Choosing props|Do \/ Don't|Gotchas)/m);
    assert.doesNotMatch(select, /^#+ Anatomy/m);
  });

  it('keeps every usage section in the Markdown for models', () => {
    const select = readFileSync(join(generatedDir, 'guidance-md', 'select.md'), 'utf8');
    assert.match(select, /^### Gotchas/m);
    assert.doesNotMatch(select, /^#+ Anatomy/m);
  });

  it('points links only at pages the site has', () => {
    const links = catalog.flatMap((entry) =>
      [...page(entry.id).matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]),
    );
    const known = new Set(catalog.map((entry) => `/components/${entry.id}`));
    assert.deepEqual(
      links.filter((link) => !known.has(link) && !/^https?:/.test(link)),
      [],
    );
  });
});
