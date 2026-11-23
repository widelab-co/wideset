/**
 * What the generators read out of the library, checked on the output a real run writes
 * (`pnpm --filter @wideset/docs test` runs scripts/generate.mjs first). These are the facts the
 * pages are built on: if a refactor of gen-props or gen-catalog breaks one, a page silently
 * shows a wrong rail, a missing default or a component that should not be there.
 */
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { asText } from './as-text.mjs';
import { generatedDir } from './paths.mjs';
import { resolveUtility } from './token-classes.mjs';

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

describe('token-classes: class → token', () => {
  const data = read('token-classes.json');
  const names = (utility) => resolveUtility(data, utility)?.map((token) => token.name);

  it('reads a colour class from its theme namespace, down to light and dark primitives', () => {
    assert.deepEqual(resolveUtility(data, 'bg-ws-dynamic-primary-default'), [
      { name: '--background-color-ws-dynamic-primary-default', group: 'background' },
    ]);
    const token = data.variables['--background-color-ws-dynamic-primary-default'];
    assert.equal(token.alias, '--ws-dynamic-fill-primary-default');
    assert.match(token.light, /^--ws-colors-light-/);
    assert.match(token.dark, /^--ws-colors-dark-/);
  });

  it('maps every spacing prefix to --spacing-ws-*, not only the one on the reference', () => {
    for (const utility of ['gap-ws-4', 'px-ws-4', '-ml-ws-4', 'size-ws-4', 'border-spacing-x-ws-4'])
      assert.deepEqual(names(utility), ['--spacing-ws-4'], utility);
    assert.deepEqual(names('h-ws-forms-md'), ['--spacing-ws-forms-md']);
  });

  it('tells a font size from a text colour (text-ws-400, text-ws-static-strong)', () => {
    assert.deepEqual(resolveUtility(data, 'text-ws-400'), [
      { name: '--text-ws-400', group: 'type' },
    ]);
    assert.deepEqual(resolveUtility(data, 'text-ws-static-strong'), [
      { name: '--text-color-ws-static-strong', group: 'text' },
    ]);
  });

  it('expands a typography-* utility through its @apply', () => {
    assert.deepEqual(names('typography-label-md'), [
      '--text-ws-400',
      '--tracking-ws-tight-25',
      '--leading-ws-500',
      '--font-weight-ws-normal',
    ]);
  });

  it('reads named utilities: z-index, drop shadows and the wds behaviour classes', () => {
    assert.deepEqual(names('z-ws-modal'), ['--ws-z-index-modal']);
    assert.deepEqual(names('drop-shadow-ws-medium'), ['--ws-elevation-drop-medium']);
    // A Wideset class that reads no token: known, so not an error.
    assert.deepEqual(names('wds-focus-visible'), []);
  });

  it('reads arbitrary variables only when they are ws tokens', () => {
    assert.deepEqual(names('bg-(--ws-static-stroke-base)'), ['--ws-static-stroke-base']);
    assert.deepEqual(names('rounded-l-[var(--radius-ws-control-lg)]'), ['--radius-ws-control-lg']);
    assert.equal(resolveUtility(data, 'bg-(--spreadsheet-tint)'), undefined);
  });

  it('reads the functional slide utilities from their --value() namespace', () => {
    assert.deepEqual(names('ws-slide-in-from-top-2'), ['--spacing-ws-2']);
  });

  it('returns null for a ws class that reads no variable, undefined for a non-token class', () => {
    assert.equal(resolveUtility(data, 'bg-ws-no-such-token'), null);
    assert.equal(resolveUtility(data, 'bg-(--ws-no-such-token)'), null);
    assert.equal(resolveUtility(data, 'flex'), undefined);
    assert.equal(resolveUtility(data, 'w-[16rem]'), undefined);
  });
});

describe('gen-guidance', () => {
  const page = (id) => readFileSync(join(generatedDir, 'guidance-md', `${id}.md`), 'utf8');

  it('gives every component its usage Markdown from its spec', () => {
    const missing = catalog
      .map((entry) => entry.id)
      .filter((id) => !existsSync(join(generatedDir, 'guidance-md', `${id}.md`)));
    assert.deepEqual(missing, []);
  });

  it('keeps every usage section in the Markdown for models', () => {
    const select = page('select');
    assert.match(select, /^### When not to use/m);
    assert.match(select, /^### Gotchas/m);
    assert.doesNotMatch(select, /^#+ Anatomy/m);
  });

  it('writes the Accessibility notes with no heading of their own', () => {
    const notes = readFileSync(join(generatedDir, 'guidance-a11y', 'button.md'), 'utf8');
    assert.ok(notes.trim().length > 0);
    assert.doesNotMatch(notes, /^#+ Accessibility/m);
  });

  it('keeps a placeholder in the Accessibility notes as text, not a tag', () => {
    // File Item's spec names the button "Remove <title>": as HTML it swallowed the page's tabs.
    const dir = join(generatedDir, 'guidance-a11y');
    const prose = (file) =>
      readFileSync(join(dir, file), 'utf8')
        .split(/(`+[^`]*`+)/)
        .filter((_, index) => index % 2 === 0)
        .join('');
    assert.deepEqual(
      readdirSync(dir).filter((file) => /<[a-z]/i.test(prose(file))),
      [],
    );
    assert.match(prose('file-item.md'), /Remove &lt;title>/);
  });

  it('closes a code span only on a backtick run of its own length', () => {
    assert.equal(
      asText('Press `` to insert a backtick. Remove <title>. Use `disabled`.'),
      'Press `` to insert a backtick. Remove &lt;title>. Use `disabled`.',
    );
    assert.equal(asText('Use ``a ` <b>`` and <i>.'), 'Use ``a ` <b>`` and &lt;i>.');
  });

  it('opens no code span on a backslash-escaped backtick', () => {
    assert.equal(asText('\\`Remove <title>\\`'), '\\`Remove &lt;title>\\`');
    assert.equal(asText('\\\\`<b>`'), '\\\\`<b>`');
    assert.equal(asText('`a\\` <i>'), '`a\\` &lt;i>');
    assert.equal(asText('\\``<title>` ``'), '\\``<title>` ``');
  });

  it('never lets a code span cross a blank line', () => {
    assert.equal(
      asText('`First paragraph.\n\nRemove <title>.\n\nLast paragraph.`'),
      '`First paragraph.\n\nRemove &lt;title>.\n\nLast paragraph.`',
    );
    assert.equal(asText('Use `<b>`\nacross lines.'), 'Use `<b>`\nacross lines.');
  });

  it('keeps fenced code as it is and escapes the prose after it', () => {
    assert.equal(
      asText('~~~html\n<title>\n~~~\nRemove <title>.'),
      '~~~html\n<title>\n~~~\nRemove &lt;title>.',
    );
    assert.equal(asText('````\n<a>\n```\n<b>\n`````\n<i>'), '````\n<a>\n```\n<b>\n`````\n&lt;i>');
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
