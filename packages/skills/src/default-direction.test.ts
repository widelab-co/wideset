import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * The default visual direction is said once in prose, in specs/patterns/directions.md, and once
 * in code, AppShell's `defaultVariants`. When it changed from Flat to Inset, it was also written
 * in four other places and one of them kept the old value. Everything else points to the pattern.
 */
const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const PATTERN = 'packages/design-system/specs/patterns/directions.md';
const read = (file: string) => readFileSync(join(REPO, file), 'utf8');

// A direction's name and "default" in one clause, either way round, or a fallback that names
// one ("without a way to ask, take `inset`").
const STATES_DEFAULT =
  /\b(inset|flat|frame|canvas)\b[^.\n]{0,25}\bdefault\b|\bdefault\b[^.\n]{0,25}\b(inset|flat|frame|canvas)\b|\btake `?(inset|flat|frame|canvas)\b/i;

const prose = execFileSync(
  'git',
  [
    'ls-files',
    '-z',
    '--',
    'packages/design-system/specs',
    'packages/skills/skills',
    'packages/skills/templates',
    'packages/skills/AGENTS.wideset.md',
    'apps/docs/src/content',
  ],
  { cwd: REPO },
)
  .toString()
  .split('\0')
  // The skills' references/specs and good practices are copies of the specs, checked at the source.
  .filter((file) => /\.(md|mdx)$/.test(file) && !/\/references\/(specs|good-practices)/.test(file));

describe('default visual direction', () => {
  it('is the same in the directions pattern and in AppShell', () => {
    const code = read('packages/design-system/src/components/app-shell/AppShell.variants.ts');
    const inCode = [...code.matchAll(/defaultVariants: \{ direction: '(\w+)' \}/g)].map(
      (m) => m[1],
    );
    const inPattern = read(PATTERN)
      .match(/take (\w+), the default\./)?.[1]
      .toLowerCase();
    expect(inCode.length).toBeGreaterThan(0);
    expect(new Set(inCode)).toEqual(new Set([inPattern]));
  });

  it('is stated nowhere else in what agents read', () => {
    const found = prose
      .filter((file) => file !== PATTERN)
      .flatMap((file) =>
        read(file)
          .split('\n')
          .flatMap((line, index) => (STATES_DEFAULT.test(line) ? [`${file}:${index + 1}`] : [])),
      );
    expect(found).toEqual([]);
  });
});
