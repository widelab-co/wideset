/*
  Local scaffolding playground: a consumer app in playground/ that installs Wideset through the
  shadcn CLI from a registry served on this machine.

    pnpm playground                 # build registry → serve on :4000 → refresh the demo items → vite on :5174
    pnpm playground --all           # add every registry item, not only the ones the demo page uses
    pnpm playground --items button,select
    pnpm playground --no-add        # only serve the registry and start vite (assumes a previous add)
    pnpm playground --no-dev        # stop after installing (CI-style check)
    pnpm playground --no-build      # skip pnpm build:lib and reuse the existing dist

  The app's components.json points @wideset at http://127.0.0.1:4000/r/{name}.json, so once this is
  running, `npx shadcn add @wideset/<name>` works from playground/ in any terminal.
  The scaffolded files (src/components/ui/wideset, src/lib/wideset, src/styles) are committed, as in
  a consumer's repo. This script re-adds with --overwrite, so after editing src/components in the
  repo a run refreshes them and `git diff playground` shows exactly what a consumer would receive.
*/
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildRegistry } from './build-registry.mjs';
import { BLOCK_STYLES, blockEntries } from './registry-blocks.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const APP = join(ROOT, 'playground');
const PORT = 4000;
const BASE = `http://127.0.0.1:${PORT}/r`;
const OUT = join(ROOT, 'public', 'r');
// Everything src/App.tsx and src/main.tsx import; installed even for a `--items` subset.
const DEMO_ITEMS = [
  'styles',
  'button',
  'icon-button',
  'checkbox',
  'modal',
  'select',
  'switch',
  'tabs',
  'tag',
  'text-input',
];

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const has = (name) => args.includes(name);
const log = (msg) => console.log(`[playground] ${msg}`);

// Validate manual and generated item names before starting the library build.
function selectedItems() {
  const declared = JSON.parse(readFileSync(join(ROOT, 'registry.json'), 'utf8')).items;
  const blocks = blockEntries(ROOT);
  const known = [...declared, ...blocks].map((item) => item.name);
  if (blocks.length) known.push(BLOCK_STYLES);
  if (!has('--items')) return has('--all') ? known : [];
  const raw = flag('--items');
  if (!raw || raw.startsWith('--')) {
    throw new Error(
      '--items needs a comma-separated list of item names, e.g. --items button,select',
    );
  }
  const names = raw
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);
  const unknown = names.filter((name) => !known.includes(name));
  if (!names.length || unknown.length) {
    throw new Error(
      `--items: ${
        unknown.length ? `unknown item(s) ${unknown.join(', ')}` : 'no item names given'
      } — see registry.json and src/blocks/index.ts`,
    );
  }
  return names;
}

const run = (cmd, cmdArgs, cwd) =>
  new Promise((done, reject) => {
    const child = spawn(cmd, cmdArgs, {
      cwd,
      stdio: ['ignore', 'inherit', 'inherit'],
      env: { ...process.env, CI: 'true', npm_config_yes: 'true' },
      shell: process.platform === 'win32',
    });
    child.on('error', reject);
    child.on('close', (status) =>
      status === 0
        ? done()
        : reject(new Error(`${cmd} ${cmdArgs.join(' ')} exited with ${status}`)),
    );
  });

const alreadyServing = () =>
  fetch(`${BASE}/registry.json`)
    .then((r) => r.ok)
    .catch(() => false);

function serve() {
  const server = createServer((req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const file = join(ROOT, 'public', path);
    if (!file.startsWith(join(ROOT, 'public')) || !existsSync(file) || extname(file) !== '.json') {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('not found');
      return;
    }
    res.writeHead(200, { 'content-type': 'application/json', 'access-control-allow-origin': '*' });
    res.end(readFileSync(file));
  });
  return new Promise((done, reject) => {
    server.on('error', reject);
    server.listen(PORT, '127.0.0.1', () => done(server));
  });
}

async function main() {
  const selected = selectedItems();

  // The registry copies dist/*.css, so a stale dist would scaffold yesterday's styles. Rebuild
  // every run unless the caller opts out.
  if (has('--no-build') && existsSync(join(ROOT, 'dist', 'styles.css'))) {
    log('--no-build, reusing the existing dist');
  } else {
    log('running pnpm build:lib');
    await run('pnpm', ['build:lib'], ROOT);
  }
  const built = await buildRegistry({ out: OUT, base: BASE });
  log(`registry: ${built.items.length} items → public/r (base ${BASE})`);

  let server = null;
  if (await alreadyServing()) {
    // Reuse is for a second terminal against this same registry. Anything else on the port would
    // scaffold items this run never built, so check before trusting it.
    const served = await fetch(`${BASE}/registry.json`)
      .then((r) => r.json())
      .catch(() => null);
    const written = JSON.parse(readFileSync(join(OUT, 'registry.json'), 'utf8'));
    // Whole index, not just names: it carries every file list, dependency and the commit stamp,
    // so another checkout or an older build on the port is rejected too.
    if (JSON.stringify(served) !== JSON.stringify(written)) {
      throw new Error(
        `port ${PORT} is taken by something that does not serve this run's registry — ` +
          'stop it (or free the port) and run again',
      );
    }
    log(`something already serves ${BASE}, reusing it`);
  } else {
    server = await serve();
    log(`serving ${BASE}`);
  }

  if (!existsSync(join(APP, 'node_modules'))) {
    log('installing playground dependencies');
    await run('npm', ['install', '--no-audit', '--no-fund'], APP);
  }

  if (!has('--no-add')) {
    // src/App.tsx imports these by hand, so a subset run still has to install them or Vite fails
    // on an unresolved import.
    const names = [...new Set([...DEMO_ITEMS, ...selected])];
    log(`shadcn add ${names.length} items`);
    await run(
      'npx',
      ['shadcn', 'add', '--yes', '--overwrite', ...names.map((n) => `@wideset/${n}`)],
      APP,
    );
  }

  if (has('--no-dev')) {
    server?.close();
    return;
  }
  log('starting vite on http://localhost:5174 (registry stays up on :4000; Ctrl+C stops both)');
  await run('npx', ['vite', '--port', '5174', '--strictPort'], APP);
  server?.close();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
