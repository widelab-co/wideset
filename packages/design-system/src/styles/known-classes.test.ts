import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

import { compileCss } from '../__tests__/compile-css';

/*
  Tailwind drops a class it does not know without a word: after the title scale removed
  `typography-subtitle-lg`, 21 headings rendered as body text while typecheck, lint, every test
  and CI were green. This test collects every Wideset class (`typography-*` and anything with
  `-ws-`) from the source and from the code in the specs, compiles them against the theme entry,
  and names each one that produces no CSS, with its file.
*/

const root = path.resolve(__dirname, '../..');

const filesUnder = (dir: string, keep: (file: string) => boolean): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === '__snapshots__' ? [] : filesUnder(full, keep);
    return keep(full) ? [full] : [];
  });

// Tests quote class names that are not usage (index.css leaves them out for the same reason).
const sourceFiles = filesUnder(
  path.join(root, 'src'),
  (file) => /\.tsx?$/.test(file) && !/\.test\.tsx?$/.test(file) && !file.includes('__tests__'),
);
const specFiles = filesUnder(path.join(root, 'specs'), (file) => file.endsWith('.md'));

// Only the code an agent copies from a spec: its fenced blocks, not the prose around them. A fence
// opens with three or more backticks or tildes and closes with at least as many of the same.
const codeFences = (markdown: string) => {
  const code: string[] = [];
  let fence: string | undefined;
  for (const line of markdown.split('\n')) {
    const marker = /^ {0,3}(`{3,}|~{3,})/.exec(line)?.[1];
    if (fence === undefined) {
      if (marker) fence = marker;
    } else if (
      marker?.[0] === fence[0] &&
      marker.length >= fence.length &&
      !line.trim().slice(marker.length).trim()
    ) {
      fence = undefined;
    } else {
      code.push(line);
    }
  }
  return code.join('\n');
};

/** Strips variants (`hover:`, `radix-state-open:`, `[&_svg]:`) and the important flag. */
const baseOf = (candidate: string) => {
  let depth = 0;
  let start = 0;
  for (let i = 0; i < candidate.length; i++) {
    const char = candidate[i];
    if (char === '[' || char === '(') depth++;
    else if (char === ']' || char === ')') depth--;
    else if (char === ':' && depth === 0) start = i + 1;
  }
  // A class at the end of a sentence in a comment carries its full stop.
  return candidate.slice(start).replace(/^!|!$/g, '').replace(/\.$/, '');
};

// A utility: an optional minus, a name, then a value (a word, an arbitrary `[…]` or a variable
// `(--…)`), then an optional `/modifier`. Anything else (a variable name, a path) is not a class.
const UTILITY =
  /^-?[a-z][a-z0-9]*(?:-[a-z0-9]+)*-(?:[a-z0-9][\w.-]*|\[[^\]\s]+\]|\(--[\w-]+\))(?:\/[\w.%[\]()-]+)?$/;
const isWideset = (base: string) => /(^|-)typography-|-ws-/.test(base) && !base.startsWith('--');

// A candidate ends at a quote, brace, comma or `=`, except inside brackets (`aria-[current=page]:`).
const CANDIDATE = /(?:\[[^\]\s]*\]|[^\s'"`{}<>,;=\\])+/g;

/** Every Wideset utility in a piece of source, by its base name. */
const classesIn = (text: string) =>
  new Set(
    (text.match(CANDIDATE) ?? [])
      .map(baseOf)
      // A class built in a template literal (`gap-ws-${n}`) ends where the expression starts.
      .filter((base) => UTILITY.test(base) && isWideset(base) && !base.endsWith('-')),
  );

// Tailwind escapes every character a selector cannot hold as is.
const selectorOf = (base: string) => '.' + base.replace(/[^\w-]/g, (char) => `\\${char}`);

/** Classes that are deliberately not utilities. Each needs a reason. */
const EXCEPTIONS = new Set<string>([]);

describe('class collection', () => {
  it('reads classes behind variants, bracketed ones included', () => {
    expect(classesIn('hover:gap-ws-nope data-[state=open]:p-ws-nope')).toEqual(
      new Set(['gap-ws-nope', 'p-ws-nope']),
    );
  });

  it('reads code fenced with backticks or tildes, not the prose', () => {
    const markdown = [
      'Prose with gap-ws-prose.',
      '~~~tsx',
      '<h2 className="typography-subtitle-lg" />',
      '~~~',
      '````md',
      '```',
      'p-ws-nested',
      '````',
    ].join('\n');
    expect(classesIn(codeFences(markdown))).toEqual(
      new Set(['typography-subtitle-lg', 'p-ws-nested']),
    );
  });
});

describe('Wideset classes', () => {
  it('compiles every typography and -ws- class used in src and in the specs’ code', () => {
    const usage = new Map<string, Set<string>>();
    const note = (file: string, text: string) => {
      for (const base of classesIn(text)) {
        if (EXCEPTIONS.has(base)) continue;
        const files = usage.get(base) ?? new Set();
        files.add(path.relative(root, file));
        usage.set(base, files);
      }
    };
    for (const file of sourceFiles) note(file, fs.readFileSync(file, 'utf-8'));
    for (const file of specFiles) note(file, codeFences(fs.readFileSync(file, 'utf-8')));

    const css = compileCss('index.css', [...usage.keys()].join(' '));
    // The selector, followed by anything that ends a class name in a selector.
    const compiled = (base: string) => {
      const selector = selectorOf(base);
      for (let at = css.indexOf(selector); at !== -1; at = css.indexOf(selector, at + 1)) {
        if (!/[\w\\-]/.test(css[at + selector.length] ?? '')) return true;
      }
      return false;
    };

    const missing = [...usage]
      .filter(([base]) => !compiled(base))
      .flatMap(([base, files]) => [...files].map((file) => `${file}: ${base}`))
      .sort();
    expect(missing).toEqual([]);
  }, 120_000);
});
