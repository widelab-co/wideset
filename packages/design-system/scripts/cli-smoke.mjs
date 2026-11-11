/*
  End-to-end test of the `wideset` CLI (packages/cli, the `wideset` package) the way a consumer meets
  it: a project from the official starter, then `npx wideset init`, `npx wideset add button`,
  `npx wideset skills`, and the project's own build. The CLI runs from the tarball `npm pack` produces, so the published file
  list, the bin and the pinned shadcn version are all part of what is tested.

    pnpm test:cli                               # from the repo root; every scenario
    node scripts/cli-smoke.mjs                  # the same, from packages/design-system
    node scripts/cli-smoke.mjs --only vite      # one of: vite, next, next-shadcn
    node scripts/cli-smoke.mjs --keep           # leave the work directory behind

  vite         npm create vite (react-ts): no Tailwind, TypeScript as strict as the template sets it
  next         create-next-app with its defaults: App Router, Tailwind, React Server Components
  next-shadcn  the same app after `shadcn init` and `shadcn add button`: init must only register
               the namespace, and both Buttons have to build side by side
  no-config    npm create vite and only `wideset skills --claude`, with no init and no
               components.json: the first command the docs give to a project on the npm package

  The starters are pinned below; STARTERS=latest uses whatever npm serves today (the weekly CI run).
  Without --registry the script builds the registry and serves it on 127.0.0.1, like
  registry-smoke.mjs, so the CLI fetches exactly the artefact under test.
*/
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildRegistry } from './build-registry.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LATEST = process.env.STARTERS === 'latest';
const CREATE_VITE = LATEST ? 'latest' : '9.2.1';
const CREATE_NEXT_APP = LATEST ? 'latest' : '16.4.3';
// The library builds the registry; the CLI is its own package next to it.
const CLI_ROOT = resolve(ROOT, '..', 'cli');
const PKG = JSON.parse(readFileSync(join(CLI_ROOT, 'package.json'), 'utf8'));
const SHADCN = PKG.devDependencies.shadcn;

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const has = (name) => args.includes(name);
const log = (msg) => console.log(`[cli-smoke] ${msg}`);

const run = (cmd, cmdArgs, cwd, { quiet = true } = {}) =>
  new Promise((done, reject) => {
    const child = spawn(cmd, cmdArgs, {
      cwd,
      env: { ...process.env, CI: 'true', npm_config_yes: 'true', FORCE_COLOR: '0' },
      stdio: quiet ? ['ignore', 'pipe', 'pipe'] : ['ignore', 'inherit', 'inherit'],
      shell: process.platform === 'win32',
    });
    let out = '';
    child.stdout?.on('data', (chunk) => (out += chunk));
    child.stderr?.on('data', (chunk) => (out += chunk));
    child.on('error', reject);
    child.on('close', (status) =>
      status === 0
        ? done(out)
        : reject(
            new Error(
              `${cmd} ${cmdArgs.join(' ')} failed (${status})\n${out
                .trim()
                .split('\n')
                .slice(-40)
                .join('\n')}`,
            ),
          ),
    );
  });

async function serveRegistry(work) {
  const dir = join(work, 'r');
  const server = createServer((req, res) => {
    const file = join(
      dir,
      decodeURIComponent(new URL(req.url, 'http://x').pathname.replace(/^\/r\/?/, '')),
    );
    if (!file.startsWith(dir) || !existsSync(file) || extname(file) !== '.json') {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('not found');
      return;
    }
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(readFileSync(file));
  });
  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  const base = `http://127.0.0.1:${server.address().port}/r`;
  try {
    buildRegistry({ out: dir, base });
  } catch (err) {
    server.close();
    throw err;
  }
  return { base, close: () => server.close() };
}

// ---------------------------------------------------------------------------------------------

const VITE_APP = `import { Button } from '@/components/ui/wideset/button/Button'

export default function App() {
  return <Button>Wideset</Button>
}
`;

const NEXT_PAGE = `import { Button } from '@/components/ui/wideset/button/Button';

// A Server Component rendering a scaffolded client component.
export default function Home() {
  return (
    <main>
      <Button>Wideset button</Button>
    </main>
  );
}
`;

const NEXT_SHADCN_PAGE = `import { Button as ShadcnButton } from '@/components/ui/button';
import { Button } from '@/components/ui/wideset/button/Button';

export default function Home() {
  return (
    <main>
      <ShadcnButton>shadcn button</ShadcnButton>
      <Button>Wideset button</Button>
    </main>
  );
}
`;

const SCENARIOS = {
  vite: {
    async create(work, name) {
      await run(
        'npm',
        ['create', `vite@${CREATE_VITE}`, name, '--', '--template', 'react-ts', '--no-interactive'],
        work,
      );
      const app = join(work, name);
      await run('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error'], app);
      return app;
    },
    page: ['src/App.tsx', VITE_APP],
    marker: null,
  },
  next: {
    async create(work, name) {
      await run(
        'npx',
        [`create-next-app@${CREATE_NEXT_APP}`, name, '--yes', '--use-npm', '--disable-git'],
        work,
      );
      return join(work, name);
    },
    page: ['app/page.tsx', NEXT_PAGE],
    marker: 'Wideset button',
  },
  'next-shadcn': {
    async create(work, name) {
      const app = await SCENARIOS.next.create(work, name);
      await run(
        'npx',
        [
          `shadcn@${SHADCN}`,
          'init',
          '-b',
          'radix',
          '-p',
          'nova',
          '--yes',
          '--force',
          '--no-reinstall',
        ],
        app,
      );
      await run('npx', [`shadcn@${SHADCN}`, 'add', 'button', '--yes'], app);
      return app;
    },
    page: ['app/page.tsx', NEXT_SHADCN_PAGE],
    marker: 'shadcn button',
  },
  'no-config': {
    create: (work, name) => SCENARIOS.vite.create(work, name),
    skillsOnly: true,
  },
};

async function scenario(name, { work, tarball, base }) {
  const spec = SCENARIOS[name];
  const app = await spec.create(work, name);
  const read = (path) => readFileSync(join(app, path), 'utf8');
  const before = existsSync(join(app, 'components.json'))
    ? JSON.parse(read('components.json'))
    : null;
  const wideset = (...cliArgs) =>
    run('npm', ['exec', '--yes', `--package=${tarball}`, '--', 'wideset', ...cliArgs], app);

  if (spec.skillsOnly) {
    writeFileSync(join(app, 'CLAUDE.md'), '# Project\n');
    await wideset('skills', '--registry', base);
    for (const file of [
      'AGENTS.wideset.md',
      '.agents/skills/wideset-setup/SKILL.md',
      '.claude/skills/wideset-setup/SKILL.md',
      '.claude/agents/wideset-ui-reviewer.md',
      '.cursor/rules/wideset.mdc',
    ]) {
      if (!existsSync(join(app, file))) throw new Error(`wideset skills did not write ${file}`);
    }
    if (existsSync(join(app, 'components.json'))) {
      throw new Error('wideset skills created a components.json in a project without one');
    }
    if (!read('CLAUDE.md').includes('@AGENTS.wideset.md')) {
      throw new Error('wideset skills did not import the rules from CLAUDE.md');
    }
    await run('npm', ['run', 'build'], app);
    return;
  }

  await wideset('init', '--registry', base);

  const config = JSON.parse(read('components.json'));
  if (config.registries?.['@wideset'] !== `${base}/{name}.json`) {
    throw new Error(`components.json does not point @wideset at ${base}`);
  }
  if (before) {
    // A shadcn project keeps its own config; init only adds the namespace.
    const withoutRegistries = (c) => JSON.stringify({ ...c, registries: null });
    if (withoutRegistries(config) !== withoutRegistries(before)) {
      throw new Error('init changed more than the registries of an existing components.json');
    }
  }

  // Second run: nothing may change.
  const tracked = [
    'components.json',
    'tsconfig.json',
    'tsconfig.app.json',
    'vite.config.ts',
    'src/main.tsx',
    'app/layout.tsx',
  ].filter((path) => existsSync(join(app, path)));
  const snapshot = tracked.map(read);
  await wideset('init');
  const drifted = tracked.filter((path, i) => read(path) !== snapshot[i]);
  if (drifted.length) throw new Error(`a second init changed ${drifted.join(', ')}`);

  const listed = await wideset('list');
  if (!/^\s+button\s/m.test(listed)) throw new Error('wideset list does not show button');

  await wideset('add', 'button');
  // Agent skills: at the project root in every layout, and running it twice changes nothing.
  const own = '# Team rules\n';
  writeFileSync(join(app, 'AGENTS.md'), own);
  await wideset('skills');
  for (const file of [
    'AGENTS.wideset.md',
    '.agents/skills/wideset-setup/SKILL.md',
    '.agents/skills/wideset-build/references/specs/patterns/form-page.md',
    '.cursor/rules/wideset.mdc',
  ]) {
    if (!existsSync(join(app, file))) throw new Error(`wideset skills did not write ${file}`);
  }
  if (existsSync(join(app, 'src/AGENTS.wideset.md'))) {
    throw new Error('wideset skills wrote under src/ instead of the project root');
  }
  const agents = read('AGENTS.md');
  if (!agents.startsWith(own)) throw new Error('wideset skills lost the existing AGENTS.md');
  await wideset('skills');
  if (read('AGENTS.md') !== agents) throw new Error('a second wideset skills changed AGENTS.md');
  if (agents.split('AGENTS.wideset.md').length !== 2) {
    throw new Error('AGENTS.md does not point at AGENTS.wideset.md exactly once');
  }

  const info = JSON.parse(await wideset('info', '--json'));
  if (info.mode !== 'registry' || !info.skills.installed || !info.skills.version) {
    throw new Error(`wideset info --json reported ${JSON.stringify(info)}`);
  }

  const [page, content] = spec.page;
  writeFileSync(join(app, page), content);
  await run('npm', ['run', 'build'], app);

  if (spec.marker) {
    const html = join(app, '.next', 'server', 'app', 'index.html');
    if (!existsSync(html) || !readFileSync(html, 'utf8').includes(spec.marker)) {
      throw new Error(`next build did not prerender "${spec.marker}"`);
    }
  }
}

async function main() {
  const only = flag('--only');
  if (only && !SCENARIOS[only]) {
    throw new Error(`--only expects one of ${Object.keys(SCENARIOS).join(', ')}, got "${only}"`);
  }
  const names = only ? [only] : Object.keys(SCENARIOS);

  const work = mkdtempSync(join(tmpdir(), 'wideset-cli-smoke-'));
  log(`work dir ${work}`);
  if (!existsSync(join(ROOT, 'dist', 'styles.css'))) {
    throw new Error('dist/ is missing — run pnpm build:lib (the registry ships dist/*.css)');
  }
  const registry = flag('--registry')
    ? { base: flag('--registry').replace(/\/$/, ''), close: () => {} }
    : await serveRegistry(work);

  const failures = [];
  try {
    mkdirSync(join(work, 'pack'));
    // The `wideset` package as npm would publish it: its file list, bin and shadcn pin.
    await run(
      'npm',
      ['pack', '--ignore-scripts', '--pack-destination', join(work, 'pack')],
      CLI_ROOT,
    );
    const tarball = join(work, 'pack', `wideset-${PKG.version}.tgz`);
    log(`packed ${tarball}; create-vite@${CREATE_VITE}, create-next-app@${CREATE_NEXT_APP}`);

    for (const name of names) {
      const started = Date.now();
      try {
        await scenario(name, { work, tarball, base: registry.base });
        log(`ok    ${name} (${((Date.now() - started) / 1000).toFixed(0)}s)`);
      } catch (err) {
        failures.push(name);
        log(`FAIL  ${name}\n${err.message}`);
      }
    }
  } finally {
    registry.close();
    if (!has('--keep')) rmSync(work, { recursive: true, force: true });
  }
  if (failures.length) {
    log(`${failures.length} failed: ${failures.join(', ')}`);
    process.exit(1);
  }
  log(`${names.length} scenarios passed`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
