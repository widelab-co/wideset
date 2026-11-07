import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(__dirname, '../..');

// The bands are whatever utilities/z-index.css defines (`--ws-z-index-{name}` → `z-ws-{name}`).
const bands = new Set(
  Array.from(
    fs
      .readFileSync(path.resolve(root, 'src/styles/utilities/z-index.css'), 'utf-8')
      .matchAll(/--ws-z-index-([a-z]+)\s*:/g),
    (m) => m[1],
  ),
);

// Shipped source only: tests, stories and snapshots may quote the classes this test forbids.
const sourceFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === '__snapshots__' ? [] : sourceFiles(full);
    return /\.tsx?$/.test(entry.name) && !/\.(test|stories)\.tsx?$/.test(entry.name) ? [full] : [];
  });

// Read once for all three scans: reading src/ per test went over vitest's 5s default when the
// pre-push hook runs every package's tests at once.
const sources = sourceFiles(path.resolve(root, 'src')).map((file) => ({
  file: path.relative(root, file).replace(/\\/g, '/'),
  lines: fs.readFileSync(file, 'utf-8').split(/\r?\n/),
}));

const matches = (pattern: RegExp) =>
  sources.flatMap(({ file, lines }) =>
    lines.flatMap((line, index) =>
      Array.from(line.matchAll(pattern), (m) => ({
        where: `${file}:${index + 1}`,
        match: m[0],
        value: m[1],
      })),
    ),
  );

/**
 * Overlay order only holds if every component sits on a named band. A class that falls outside
 * the scale compiles silently: Tailwind's `z-50` is a plain 50 below every band, and a removed
 * `z-ws-5` compiles to nothing at all. See src/stories/foundations/ZIndex.stories.tsx.
 */
describe('Z-index bands', () => {
  it('reads the bands from z-index.css', () => {
    expect(bands.size).toBeGreaterThan(0);
  });

  it('uses no Tailwind z-index scale in source (z-10, z-50, -z-1, …)', () => {
    expect(matches(/(?<![\w-])-?z-(\d+)(?![\w-])/g)).toEqual([]);
  });

  it('uses arbitrary z-index values only relative to a band', () => {
    const offenders = matches(/(?<![\w-])-?z-\[([^\]]*)\]/g).filter(
      ({ value }) => !value.includes('--ws-z-index-'),
    );
    expect(offenders).toEqual([]);
  });

  it('uses only z-ws-* classes that z-index.css defines', () => {
    const offenders = matches(/(?<![\w-])z-ws-([\w-]+)/g).filter(({ value }) => !bands.has(value));
    expect(offenders).toEqual([]);
  });
});
