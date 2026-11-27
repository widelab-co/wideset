import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/** Checks that consumer-facing files use the production docs and Storybook origins. */
const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const SHIPPED = [
  'packages/skills',
  'packages/design-system/specs',
  'packages/design-system/src',
  'packages/cli/src',
  'apps/docs/src',
];
// Infrastructure that serves or detects the develop Worker and the PR previews, which keep it.
const INFRASTRUCTURE = new Set([
  'apps/docs/astro.config.mjs',
  'apps/docs/wrangler.jsonc',
  'apps/docs/src/layouts/DocsLayout.astro',
]);

const tracked = execFileSync('git', ['ls-files', '-z', '--', ...SHIPPED], { cwd: REPO })
  .toString()
  .split('\0')
  // Tests name the address to look for it, as this one does.
  .filter((file) => file && !/\.test\.tsx?$/.test(file));

describe('docs origin', () => {
  it('finds the files to check', () => {
    expect(tracked.length).toBeGreaterThan(100);
  });

  it('never links the retired workers.dev origins from what ships', () => {
    const found = tracked
      .filter((file) => !INFRASTRUCTURE.has(file))
      .flatMap((file) =>
        readFileSync(join(REPO, file), 'utf8')
          .split('\n')
          .flatMap((line, index) => (line.includes('workers.dev') ? [`${file}:${index + 1}`] : [])),
      );
    expect(found).toEqual([]);
  });
});
