#!/usr/bin/env node
/**
 * Refresh the Blocks gallery's thumbnails: every block in the library's manifest, light and dark,
 * shot from the docs' own preview route. Not part of the build; run it by hand when blocks change,
 * against the built site:
 *
 *   pnpm --filter @wideset/docs build && pnpm --filter @wideset/docs preview
 *   PLAYWRIGHT=<playwright's index.mjs, a path or file:// URL> node apps/docs/scripts/sync-blocks.mjs
 *
 * Playwright is not a dependency of this repository: PLAYWRIGHT points at any install of it
 * (without it the script imports `playwright` by name). BLOCKS_URL is the site (default
 * http://localhost:4322, `astro preview`); BLOCKS_ONLY=<id>[,<id>…] shoots only those blocks.
 *
 * Each block loads at 1440 × 960 from /blocks/<id>/preview?theme=light|dark and is written to
 * public/_docs/blocks/<id>-light.webp and -dark.webp (WebP, quality 80), which are committed.
 * Screenshots of blocks the manifest no longer lists are removed.
 */
/* global document, HTMLElement -- the callbacks given to the page run in the browser */
import { readdirSync, rmSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { isAbsolute, join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { blockIds, docs } from './paths.mjs';

const {
  PLAYWRIGHT = 'playwright',
  BLOCKS_URL = 'http://localhost:4322',
  BLOCKS_ONLY,
} = process.env;
const { chromium } = await import(
  isAbsolute(PLAYWRIGHT) ? pathToFileURL(PLAYWRIGHT).href : PLAYWRIGHT
);
// sharp comes with Astro (its image service); the script borrows it instead of adding a dependency.
const sharp = createRequire(createRequire(import.meta.url).resolve('astro/package.json'))('sharp');

const out = join(docs, 'public/_docs/blocks');
const ids = blockIds();
const shoot = BLOCKS_ONLY ? BLOCKS_ONLY.split(',').map((id) => id.trim()) : ids;
const unknown = shoot.filter((id) => !ids.includes(id));
if (unknown.length) throw new Error(`sync-blocks: not in the manifest: ${unknown.join(', ')}`);

const browser = await chromium.launch();
// Reduced motion: charts and panels drawn at rest, not halfway through their entrance.
const page = await browser.newPage({
  viewport: { width: 1440, height: 960 },
  reducedMotion: 'reduce',
});
for (const id of shoot) {
  for (const theme of ['light', 'dark']) {
    await page.goto(`${BLOCKS_URL}/blocks/${id}/preview?theme=${theme}`, {
      waitUntil: 'networkidle',
    });
    // The block renders in the browser (BlockFrame); a failed load shows its alert instead.
    await page.waitForFunction(() => document.querySelector('astro-island')?.childElementCount);
    if (await page.locator('astro-island > [role="alert"]').count())
      throw new Error(`${id}: did not load`);
    await page.evaluate(async () => {
      await document.fonts.ready;
      // A block that focuses a field on load would show its focus ring.
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    });
    await page.waitForTimeout(500);
    const png = await page.screenshot({ animations: 'disabled' });
    await sharp(png)
      .webp({ quality: 80 })
      .toFile(join(out, `${id}-${theme}.webp`));
  }
}
await browser.close();

// A block that left the manifest takes its screenshots with it.
for (const file of readdirSync(out))
  if (!ids.includes(file.replace(/-(light|dark)\.webp$/, ''))) rmSync(join(out, file));
const files = readdirSync(out);
const bytes = files.reduce((sum, file) => sum + statSync(join(out, file)).size, 0);
console.log(
  `${shoot.length} blocks shot; ${files.length} screenshots, ${(bytes / 1024 / 1024).toFixed(1)} MB`,
);
