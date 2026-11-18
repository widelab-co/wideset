import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * Production docs and Storybook answer only on wideset.co and storybook.wideset.co; the old
 * workers.dev addresses are retired (RELEASING.md). When the default visual direction changed,
 * wideset-build kept a workers.dev link and the first pass missed it. Nothing a consumer or an
 * agent reads may point there: the skills, the specs, the library and CLI source, the docs pages.
 */
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
  'packages/design-system/scripts/registry-smoke.mjs',
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
