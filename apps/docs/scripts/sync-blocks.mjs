#!/usr/bin/env node
/**
 * Refresh what the Blocks pages show while the blocks' source is not in this branch: their list
 * and their screenshots. Not part of the build; run it by hand when the blocks or their
 * screenshots change:
 *
 *   BLOCKS_REPO=<a clone of this repository> \
 *   BLOCKS_REFS=<ref>[,<ref>…] \
 *   BLOCKS_SHOTS=<folder of screenshots> \
 *   node apps/docs/scripts/sync-blocks.mjs
 *
 * BLOCKS_REFS are the refs that hold `packages/design-system/src/blocks/` (read with `git show`,
 * nothing is checked out); a block listed by an earlier ref wins. BLOCKS_SHOTS holds one
 * `<id>-light.png` (or a bare `<id>.png`) and `<id>-dark.png` per block, 1440px wide or more.
 *
 * Writes:
 * - src/data/blocks.json: id, title, description, category and whether a dark shot exists;
 * - public/_docs/blocks/<id>-light.webp and -dark.webp, at most 1600px wide.
 * Both are committed. Once the blocks are in the library, the pages render them live from
 * `packages/design-system/src/blocks/` (src/lib/blocks.ts) and take titles and descriptions from
 * there; this file then only supplies the categories and the screenshots of the gallery.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DOCS = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { BLOCKS_REPO: REPO, BLOCKS_REFS, BLOCKS_SHOTS: SHOTS } = process.env;
if (!REPO || !BLOCKS_REFS || !SHOTS) {
  console.error('sync-blocks: set BLOCKS_REPO, BLOCKS_REFS and BLOCKS_SHOTS (see the file head).');
  process.exit(1);
}
const BLOCKS_DIR = 'packages/design-system/src/blocks';
const WIDTH = 1600;
const QUALITY = 80;

/** The business domain of each block, by what the screen is for. */
const CATEGORIES = {
  'AI & agents': [
    'ai-chat',
    'assistant',
    'chat',
    'code-editor',
    'agent-chat',
    'agent-code',
    'agent-context',
    'agent-research',
    'agent-sessions',
    'agent-states',
  ],
  'Finance & billing': [
    'billing',
    'invoice',
    'plans',
    'cancel-subscription',
    'send-payment',
    'checkout',
    'finance-dashboard',
    'crypto',
    'referrals',
  ],
  Commerce: ['orders', 'order-detail', 'order-confirmation', 'product-form', 'reviews', 'gallery'],
  'CRM & sales': ['customers', 'customer-detail', 'pipeline', 'sales-overview'],
  'Analytics & reporting': ['analytics', 'dashboard', 'report', 'goals', 'home', 'spreadsheet'],
  'Productivity & collaboration': [
    'kanban',
    'process',
    'gantt',
    'calendar',
    'booking',
    'event-detail',
    'call',
    'inbox',
    'notifications',
    'notifications-popover',
    'activity-feed',
    'files',
    'import',
    'workflow-builder',
    'command-palette',
    'communication',
    'team',
    'task-sidepanel',
    'profile',
    'filter-popover',
    'context-menu',
  ],
  'Content & learning': [
    'article',
    'lesson',
    'help-center',
    'media-viewer',
    'recording',
    'whats-new',
  ],
  'Auth & onboarding': [
    'sign-in',
    'sign-in-card',
    'sign-up',
    'two-factor',
    'verify-email',
    'forgot-password',
    'new-password',
    'accept-invite',
    'choose-workspace',
    'sso-sign-in',
    'onboarding',
    'check-email',
    'signed-out',
    'coach-marks',
  ],
  'Settings & admin': [
    'settings',
    'account-settings',
    'account-menu',
    'access-requests',
    'integrations',
    'no-access',
  ],
  'Dialogs & states': [
    'modal-form',
    'modal-stepper',
    'modal-details',
    'modal-task',
    'modal-search',
    'modal-access',
    'confirm-delete',
    'export-dialog',
    'move-dialog',
    'report-dialog',
    'feedback-dialog',
    'empty-list',
    'not-found',
    'page-states',
  ],
};
const categoryOf = (id) =>
  Object.entries(CATEGORIES).find(([, ids]) => ids.includes(id))?.[0] ?? 'Dialogs & states';

/** Every `{ id, title, description }` in the blocks' index.ts (BLOCKS and PANELS). */
const metaOf = (source) =>
  [
    ...source.matchAll(
      /\{\s*id: '([^']+)',\s*title: '([^']+)',[\s\S]*?description:\s*'((?:[^'\\]|\\.)*)'/g,
    ),
  ].map(([, id, title, description]) => ({
    id,
    title,
    description: description.replace(/\\'/g, "'"),
  }));

const blocks = new Map();
for (const ref of BLOCKS_REFS.split(',')) {
  const index = execFileSync('git', ['-C', REPO, 'show', `${ref.trim()}:${BLOCKS_DIR}/index.ts`], {
    encoding: 'utf8',
  });
  for (const meta of metaOf(index)) if (!blocks.has(meta.id)) blocks.set(meta.id, meta);
}

// sharp comes with Astro (its image service); the script borrows it instead of adding a dependency.
const sharp = createRequire(createRequire(import.meta.url).resolve('astro/package.json'))('sharp');
const out = resolve(DOCS, 'public/_docs/blocks');
mkdirSync(out, { recursive: true });
const shots = new Set(readdirSync(SHOTS));
const written = new Set();
const missing = [];
let bytes = 0;
const convert = async (source, name) => {
  const info = await sharp(resolve(SHOTS, source))
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(resolve(out, name));
  written.add(name);
  bytes += info.size;
};
const list = [];
for (const meta of blocks.values()) {
  const light = [`${meta.id}-light.png`, `${meta.id}.png`].find((file) => shots.has(file));
  const dark = shots.has(`${meta.id}-dark.png`);
  if (!light) {
    missing.push(meta.id);
    continue;
  }
  await convert(light, `${meta.id}-light.webp`);
  if (dark) await convert(`${meta.id}-dark.png`, `${meta.id}-dark.webp`);
  list.push({ ...meta, category: categoryOf(meta.id), dark });
}
// A block that left the list takes its screenshots with it.
for (const file of readdirSync(out)) if (!written.has(file)) rmSync(resolve(out, file));

list.sort((a, b) => a.id.localeCompare(b.id));
const data = resolve(DOCS, 'src/data/blocks.json');
if (!existsSync(dirname(data))) mkdirSync(dirname(data), { recursive: true });
writeFileSync(data, `${JSON.stringify(list, null, 2)}\n`);
console.log(
  `${list.length} blocks, ${written.size} screenshots, ${(bytes / 1024 / 1024).toFixed(1)} MB` +
    (missing.length ? `; no light screenshot, left out: ${missing.join(', ')}` : ''),
);
